
import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Task } from '../types';

interface ChecklistScreenProps {
    userId: string;
}

export const ChecklistScreen: React.FC<ChecklistScreenProps> = ({ userId }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeModal, setActiveModal] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, [userId]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Map database snake_case to typescript camelCase if needed, 
            // but simplistic mapping for now assuming DB cols match or we adjust
            setTasks(data || []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const addTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        const category = formData.get('category') as string;
        const dueDate = formData.get('dueDate') as string;

        if (!title) return;

        try {
            const newTask = {
                title,
                category,
                due_date: dueDate, // Mapping to snake_case for DB
                user_id: userId,
                completed: false
            };

            const { data, error } = await supabase
                .from('tasks')
                .insert([newTask])
                .select()
                .single();

            if (error) throw error;

            setTasks([data, ...tasks]);
            setActiveModal(false);
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Erro ao adicionar tarefa.');
        }
    };

    const toggleTask = async (task: Task) => {
        try {
            // Optimistic update
            const updatedTasks = tasks.map(t =>
                t.id === task.id ? { ...t, completed: !t.completed } : t
            );
            setTasks(updatedTasks);

            const { error } = await supabase
                .from('tasks')
                .update({ completed: !task.completed })
                .eq('id', task.id);

            if (error) {
                // Revert on error
                setTasks(tasks);
                throw error;
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const deleteTask = async (taskId: string) => {
        if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;

        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', taskId);

            if (error) throw error;

            setTasks(tasks.filter(t => t.id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
            <header className="flex justify-between items-end">
                <div className="space-y-2">
                    <h2 className="text-5xl font-serif">Checklist</h2>
                    <p className="text-zinc-500">As pequenas vitórias que levam ao grande dia.</p>
                </div>
                <button onClick={() => setActiveModal(true)} className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-xl">
                    <Plus size={18} /> Nova Tarefa
                </button>
            </header>

            {loading ? (
                <div className="text-center py-20 text-zinc-500">Carregando tarefas...</div>
            ) : (
                <div className="bg-zinc-950 p-10 rounded-[40px] border border-white/5 space-y-4">
                    {tasks.length === 0 ? (
                        <div className="text-center py-10 text-zinc-500">Nenhuma tarefa encontrada. Adicione a primeira!</div>
                    ) : (
                        tasks.map(task => (
                            <div key={task.id} className="flex items-center gap-4 p-6 bg-zinc-900 rounded-3xl border border-white/5 group hover:border-red-600/30 transition-all">
                                <button onClick={() => toggleTask(task)} className={`p-1 rounded-lg border-2 transition-all ${task.completed ? 'bg-red-600 border-red-600 text-white' : 'border-white/10 text-transparent'}`}>
                                    <Check size={16} />
                                </button>
                                <div className="flex-1">
                                    <span className={`text-lg block ${task.completed ? 'text-zinc-500 line-through' : 'text-white'}`}>
                                        {task.title}
                                    </span>
                                    {/* Handle both camelCase (frontend type) and snake_case (DB raw) just in case, though we should settle on one map */}
                                    {(task.dueDate || (task as any).due_date) && (
                                        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                                            {task.dueDate || (task as any).due_date}
                                        </span>
                                    )}
                                </div>
                                <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 p-2 text-zinc-600 hover:text-red-500 transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Task Modal */}
            {activeModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setActiveModal(false)}></div>
                    <div className="bg-zinc-950 border border-white/10 w-full max-w-lg rounded-[32px] md:rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <header className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Nova Tarefa</h3>
                            <button onClick={() => setActiveModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-white"><Plus className="rotate-45" size={20} /></button>
                        </header>
                        <div className="p-6 md:p-8">
                            <form onSubmit={addTask} className="space-y-6">
                                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-zinc-600 ml-1">O que precisa ser feito?</label><input name="title" className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 outline-none focus:border-red-600 text-white" placeholder="Ex: Escolher vestido" required autoFocus /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><label className="text-[10px] font-black uppercase text-zinc-600 ml-1">Categoria</label><select name="category" className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 outline-none focus:border-red-600 text-white"><option>Geral</option><option>Cerimônia</option><option>Festa</option><option>Lua de Mel</option></select></div>
                                    <div className="space-y-2"><label className="text-[10px] font-black uppercase text-zinc-600 ml-1">Prazo</label><input type="date" name="dueDate" className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 outline-none focus:border-red-600 text-white" /></div>
                                </div>
                                <button type="submit" className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all shadow-xl">Adicionar Tarefa</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
