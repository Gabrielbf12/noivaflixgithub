
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, XCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Guest } from '../types';

interface GuestsScreenProps {
    userId: string;
}

export const GuestsScreen: React.FC<GuestsScreenProps> = ({ userId }) => {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeModal, setActiveModal] = useState(false);

    useEffect(() => {
        fetchGuests();
    }, [userId]);

    const fetchGuests = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('guests')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const mappedGuests: Guest[] = (data || []).map((g: any) => ({
                id: g.id,
                name: g.name,
                // Map DB types to frontend types
                confirmed: g.confirmed === null ? 'pending' : g.confirmed,
                plusOnes: g.plus_ones || 0,
                category: g.category as 'família' | 'amigos' | 'trabalho'
            }));

            setGuests(mappedGuests);
        } catch (error) {
            console.error('Error fetching guests:', error);
        } finally {
            setLoading(false);
        }
    };

    const addGuest = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const category = formData.get('category') as string;
        const status = formData.get('status') as string;

        if (!name) return;

        try {
            // Map frontend status to DB boolean|null
            let confirmedValue: boolean | null = null;
            if (status === 'confirmed') confirmedValue = true;
            else if (status === 'declined') confirmedValue = false; // Assuming declined exists conceptually

            const newGuest = {
                name,
                category,
                confirmed: confirmedValue,
                user_id: userId,
                plus_ones: 0
            };

            const { data, error } = await supabase
                .from('guests')
                .insert([newGuest])
                .select()
                .single();

            if (error) throw error;

            // Optimistic update
            const addedGuest: Guest = {
                id: data.id,
                name: data.name,
                category: data.category,
                plusOnes: data.plus_ones || 0,
                confirmed: data.confirmed === null ? 'pending' : data.confirmed
            };

            setGuests([addedGuest, ...guests]);
            setActiveModal(false);
        } catch (error) {
            console.error('Error adding guest:', error);
            alert('Erro ao adicionar convidado.');
        }
    };

    const updateGuestStatus = async (guest: Guest, newStatus: boolean | 'pending') => {
        try {
            // Optimistic update
            const updatedGuests = guests.map(g =>
                g.id === guest.id ? { ...g, confirmed: newStatus } : g
            );
            setGuests(updatedGuests);

            // Map back to DB value
            const dbValue = newStatus === 'pending' ? null : newStatus;

            const { error } = await supabase
                .from('guests')
                .update({ confirmed: dbValue })
                .eq('id', guest.id);

            if (error) {
                setGuests(guests); // Revert
                throw error;
            }
        } catch (error) {
            console.error('Error updating guest:', error);
        }
    };

    const removeGuest = async (guestId: string) => {
        if (!confirm('Remover este convidado?')) return;

        try {
            const { error } = await supabase
                .from('guests')
                .delete()
                .eq('id', guestId);

            if (error) throw error;

            setGuests(guests.filter(g => g.id !== guestId));
        } catch (error) {
            console.error('Error deleting guest:', error);
        }
    };

    const stats = {
        total: guests.length,
        confirmed: guests.filter(g => g.confirmed === true).length,
        pending: guests.filter(g => g.confirmed === 'pending' || g.confirmed === null).length
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
            <header className="flex justify-between items-end">
                <div className="space-y-2">
                    <h2 className="text-5xl font-serif">Lista de Convidados</h2>
                    <div className="flex gap-4 text-sm font-bold uppercase tracking-widest text-zinc-500">
                        <span>Total: <span className="text-white">{stats.total}</span></span>
                        <span>Confirmados: <span className="text-emerald-500">{stats.confirmed}</span></span>
                        <span>Pendentes: <span className="text-amber-500">{stats.pending}</span></span>
                    </div>
                </div>
                <button onClick={() => setActiveModal(true)} className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-xl">
                    <Plus size={18} /> Novo Convidado
                </button>
            </header>

            {loading ? (
                <div className="text-center py-20 text-zinc-500">Carregando convidados...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {guests.length === 0 ? (
                        <div className="col-span-full text-center py-10 text-zinc-500">Nenhum convidado ainda. Comece a lista!</div>
                    ) : (
                        guests.map(guest => (
                            <div key={guest.id} className="bg-zinc-900/50 border border-white/5 p-6 rounded-3xl flex items-center justify-between group hover:border-white/10 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold 
                    ${guest.confirmed === true ? 'bg-emerald-500/20 text-emerald-500' :
                                            guest.confirmed === false ? 'bg-red-500/20 text-red-500' :
                                                'bg-amber-500/20 text-amber-500'}`}>
                                        {guest.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{guest.name}</h4>
                                        <span className="text-[10px] uppercase font-black tracking-widest text-zinc-600 block">{guest.category}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <select
                                        value={guest.confirmed === 'pending' ? 'pending' : guest.confirmed ? 'confirmed' : 'declined'}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === 'confirmed') updateGuestStatus(guest, true);
                                            else if (val === 'declined') updateGuestStatus(guest, false);
                                            else updateGuestStatus(guest, 'pending');
                                        }}
                                        className={`bg-black/20 border border-white/5 rounded-lg text-[10px] font-bold uppercase tracking-widest p-2 outline-none cursor-pointer
                      ${guest.confirmed === true ? 'text-emerald-500' :
                                                guest.confirmed === false ? 'text-red-500' :
                                                    'text-amber-500'}`}
                                    >
                                        <option value="pending">Pendente</option>
                                        <option value="confirmed">Confirmado</option>
                                        <option value="declined">Recusado</option>
                                    </select>

                                    <button onClick={() => removeGuest(guest.id)} className="p-2 text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Guest Modal */}
            {activeModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setActiveModal(false)}></div>
                    <div className="bg-zinc-950 border border-white/10 w-full max-w-lg rounded-[32px] md:rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <header className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Novo Convidado</h3>
                            <button onClick={() => setActiveModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-white"><Plus className="rotate-45" size={20} /></button>
                        </header>
                        <div className="p-6 md:p-8">
                            <form onSubmit={addGuest} className="space-y-6">
                                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-zinc-600 ml-1">Nome Completo</label><input name="name" className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 outline-none focus:border-red-600 text-white" placeholder="Ex: Tio João" required autoFocus /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><label className="text-[10px] font-black uppercase text-zinc-600 ml-1">Categoria</label><select name="category" className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 outline-none focus:border-red-600 text-white"><option value="família">Família</option><option value="amigos">Amigos</option><option value="trabalho">Trabalho</option></select></div>
                                    <div className="space-y-2"><label className="text-[10px] font-black uppercase text-zinc-600 ml-1">Status Inicial</label><select name="status" className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 outline-none focus:border-red-600 text-white"><option value="pending">Pendente</option><option value="confirmed">Confirmado</option></select></div>
                                </div>
                                <button type="submit" className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all shadow-xl">Adicionar Convidado</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
