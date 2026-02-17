
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, DollarSign, CreditCard, PieChart, Briefcase, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Expense } from '../types';

interface ExpensesScreenProps {
    userId: string;
}

export const ExpensesScreen: React.FC<ExpensesScreenProps> = ({ userId }) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeModal, setActiveModal] = useState(false);
    const [totalBudgetGoal, setTotalBudgetGoal] = useState(50000); // Exemplo, poderia vir do perfil

    useEffect(() => {
        // Fetch budget from profile if available, otherwise default
        fetchExpenses();
    }, [userId]);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('expenses')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setExpenses(data || []);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    const addExpense = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const newExpense = {
            user_id: userId,
            supplier: formData.get('supplier') as string,
            category: formData.get('category') as string,
            value: parseFloat(formData.get('value') as string),
            status: formData.get('status') as string,
            observation: ''
        };

        try {
            const { data, error } = await supabase
                .from('expenses')
                .insert([newExpense])
                .select()
                .single();

            if (error) throw error;
            setExpenses([data, ...expenses]);
            setActiveModal(false);
        } catch (error) {
            console.error('Error adding expense:', error);
            alert('Erro ao salvar despesa');
        }
    };

    const removeExpense = async (id: string) => {
        if (!confirm('Tem certeza que deseja remover este gasto?')) return;
        try {
            const { error } = await supabase.from('expenses').delete().eq('id', id);
            if (error) throw error;
            setExpenses(expenses.filter(e => e.id !== id));
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const totalSpent = useMemo(() => expenses.reduce((acc, curr) => acc + Number(curr.value), 0), [expenses]);
    const budgetProgress = useMemo(() => Math.min((totalSpent / totalBudgetGoal) * 100, 100), [totalSpent, totalBudgetGoal]);
    const balance = totalBudgetGoal - totalSpent;

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
            <header className="flex justify-between items-end">
                <div className="space-y-2"><h2 className="text-5xl font-serif">Orçamento</h2><p className="text-zinc-500">Mantenha as finanças sob controle.</p></div>
                <button onClick={() => setActiveModal(true)} className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-xl"><Plus size={18} /> Novo Gasto</button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-zinc-900/50 p-10 rounded-[40px] border border-white/5 space-y-4">
                    <div className="p-4 bg-blue-600/10 text-blue-500 w-fit rounded-2xl"><DollarSign size={24} /></div>
                    <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Planejado</p>
                    <h3 className="text-4xl font-black">R$ {totalBudgetGoal.toLocaleString()}</h3>
                </div>
                <div className="bg-zinc-900/50 p-10 rounded-[40px] border border-white/5 space-y-4">
                    <div className="p-4 bg-red-600/10 text-red-500 w-fit rounded-2xl"><CreditCard size={24} /></div>
                    <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Gasto Total</p>
                    <h3 className="text-4xl font-black">R$ {totalSpent.toLocaleString()}</h3>
                </div>
                <div className="bg-zinc-900/50 p-10 rounded-[40px] border border-white/5 space-y-4">
                    <div className="p-4 bg-emerald-600/10 text-emerald-500 w-fit rounded-2xl"><PieChart size={24} /></div>
                    <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Saldo</p>
                    <h3 className={`text-4xl font-black ${balance < 0 ? 'text-red-500' : 'text-white'}`}>R$ {balance.toLocaleString()}</h3>
                </div>
            </div>

            <div className="bg-zinc-950 p-10 rounded-[40px] border border-white/5 space-y-10">
                <div className="space-y-4">
                    <div className="flex justify-between items-end text-sm"><span className="text-zinc-400 font-bold uppercase text-xs tracking-widest">Utilização do Orçamento</span><span className="text-white font-black">{budgetProgress.toFixed(1)}%</span></div>
                    <div className="h-4 bg-zinc-900 rounded-full overflow-hidden border border-white/5 p-1"><div className="h-full bg-gradient-to-r from-blue-600 to-red-600 rounded-full transition-all duration-1000" style={{ width: `${budgetProgress}%` }}></div></div>
                </div>

                <div className="space-y-6">
                    <h4 className="text-xl font-bold">Lançamentos Recentes</h4>
                    <div className="space-y-4">
                        {loading ? <p className="text-center text-zinc-500">Carregando...</p> : expenses.length === 0 ? (
                            <div className="py-20 text-center text-zinc-600 italic">Nenhum gasto lançado ainda.</div>
                        ) : (
                            expenses.map(exp => (
                                <div key={exp.id} className="flex justify-between items-center p-6 bg-zinc-900 rounded-3xl border border-white/5 hover:border-red-600/30 transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className="p-4 bg-white/5 rounded-2xl text-zinc-400"><Briefcase size={20} /></div>
                                        <div><h5 className="font-bold text-lg">{exp.supplier}</h5><p className="text-zinc-500 text-xs uppercase font-black tracking-widest">{exp.category}</p></div>
                                    </div>
                                    <div className="flex items-center gap-4 text-right">
                                        <div>
                                            <p className="text-xl font-black">R$ {Number(exp.value).toLocaleString()}</p>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${exp.status === 'pago' ? 'text-emerald-500' : 'text-amber-500'}`}>{exp.status}</span>
                                        </div>
                                        <button onClick={() => removeExpense(exp.id)} className="p-2 text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {activeModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setActiveModal(false)}></div>
                    <div className="bg-zinc-950 border border-white/10 w-full max-w-lg rounded-[32px] md:rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <header className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Novo Gasto</h3>
                            <button onClick={() => setActiveModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-white"><Plus className="rotate-45" size={20} /></button>
                        </header>
                        <div className="p-6 md:p-8">
                            <form onSubmit={addExpense} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-zinc-600 ml-1">Fornecedor / Item</label>
                                    <input name="supplier" required placeholder="Ex: Buffet do Castelo..." className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 outline-none focus:border-red-600 text-white" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-zinc-600 ml-1">Valor (R$)</label>
                                        <input name="value" type="number" step="0.01" required placeholder="0,00" className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 outline-none focus:border-red-600 text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-zinc-600 ml-1">Categoria</label>
                                        <input list="common-categories" name="category" required placeholder="Digite..." className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 outline-none focus:border-red-600 text-white" />
                                        <datalist id="common-categories">
                                            <option value="Espaço" />
                                            <option value="Buffet" />
                                            <option value="Decoração" />
                                            <option value="Fotografia" />
                                            <option value="Música" />
                                        </datalist>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-zinc-600 ml-1">Status</label>
                                    <select name="status" required className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 outline-none focus:border-red-600 text-white">
                                        <option value="pendente">Pendente ⏳</option>
                                        <option value="pago">Pago ✅</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full bg-red-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-red-700 transition-all">Lançar Despesa</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
