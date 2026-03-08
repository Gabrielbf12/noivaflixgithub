import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

import {
    Heart, CalendarDays, MapPin, Users, Wallet, Zap, Target, TicketCheck,
    CheckCircle, Save, Loader2, Sparkles, Clock
} from 'lucide-react';

interface WeddingProfileProps {
    userId: string;
    initialData?: {
        budget?: number;
        weddingDate?: string;
        city?: string;
        guestCount?: string;
        weddingStyle?: string;
        urgencyLevel?: string;
        decisionStage?: string;
        vendorTicket?: number;
    };
    onSave?: () => void;
}

const STYLES = [
    { value: 'classico', label: 'Clássico', emoji: '🤍', desc: 'Elegância atemporal e sofisticação' },
    { value: 'moderno', label: 'Moderno', emoji: '🖤', desc: 'Linhas limpas e minimalismo contemporâneo' },
    { value: 'rustico', label: 'Rústico', emoji: '🌿', desc: 'Natureza, madeira e aconchego' },
    { value: 'minimalista', label: 'Minimalista', emoji: '⬜', desc: 'Menos é mais — foco no essencial' },
    { value: 'boho', label: 'Boho', emoji: '🌸', desc: 'Livre, artístico e cheio de personalidade' },
    { value: 'industrial', label: 'Industrial', emoji: '🏭', desc: 'Tijolos, metal e espaços urbanos' },
];

const URGENCY = [
    { value: 'baixo', label: 'Sem pressa', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30', icon: '🌱' },
    { value: 'medio', label: 'Médio', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30', icon: '📅' },
    { value: 'alto', label: 'Alto', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30', icon: '⚡' },
    { value: 'urgente', label: 'Urgente', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30', icon: '🔥' },
];

const STAGES = [
    {
        value: 'pesquisando',
        label: 'Pesquisando',
        desc: 'Ainda estou explorando opções e conhecendo os fornecedores disponíveis.',
        icon: <Target size={24} />,
        color: 'text-blue-400',
        bg: 'bg-blue-400/10 border-blue-400/30',
    },
    {
        value: 'comparando',
        label: 'Comparando',
        desc: 'Já tenho algumas opções em mente e estou avaliando propostas.',
        icon: <Zap size={24} />,
        color: 'text-amber-400',
        bg: 'bg-amber-400/10 border-amber-400/30',
    },
    {
        value: 'pronto',
        label: 'Pronto para contratar',
        desc: 'Já sei o que quero e estou pronta para fechar contrato.',
        icon: <CheckCircle size={24} />,
        color: 'text-emerald-400',
        bg: 'bg-emerald-400/10 border-emerald-400/30',
    },
];

const formatCurrency = (value: string): string => {
    const num = value.replace(/\D/g, '');
    if (!num) return '';
    return Number(num).toLocaleString('pt-BR');
};

export const WeddingProfile: React.FC<WeddingProfileProps> = ({ userId, initialData, onSave }) => {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [budget, setBudget] = useState(initialData?.budget?.toString() || '');
    const [weddingDate, setWeddingDate] = useState(initialData?.weddingDate || '');
    const [city, setCity] = useState(initialData?.city || '');
    const [guestCount, setGuestCount] = useState(initialData?.guestCount || '');
    const [weddingStyle, setWeddingStyle] = useState(initialData?.weddingStyle || '');
    const [urgencyLevel, setUrgencyLevel] = useState(initialData?.urgencyLevel || '');
    const [decisionStage, setDecisionStage] = useState(initialData?.decisionStage || '');
    const [vendorTicket, setVendorTicket] = useState(initialData?.vendorTicket?.toString() || '');

    // Auto-calculate vendor ticket when budget or guest count change
    useEffect(() => {
        const b = parseFloat(budget.replace(/\./g, '').replace(',', '.')) || 0;
        if (b > 0) {
            const estimated = Math.round(b / 6); // spread across ~6 key vendors
            setVendorTicket(estimated.toLocaleString('pt-BR'));
        }
    }, [budget]);

    const getCompletionScore = () => {
        const fields = [budget, weddingDate, city, guestCount, weddingStyle, urgencyLevel, decisionStage, vendorTicket];
        return fields.filter(Boolean).length;
    };

    const completionPct = Math.round((getCompletionScore() / 8) * 100);

    const handleSave = async () => {
        setSaving(true);
        try {
            const budgetNum = parseFloat(budget.replace(/\./g, '').replace(',', '.')) || null;
            const ticketNum = parseFloat(vendorTicket.replace(/\./g, '').replace(',', '.')) || null;

            const { error } = await supabase
                .from('profiles')
                .update({
                    budget: budgetNum,
                    wedding_date: weddingDate || null,
                    city: city || null,
                    guest_count: guestCount || null,
                    wedding_style: weddingStyle || null,
                    urgency_level: urgencyLevel || null,
                    decision_stage: decisionStage || null,
                    vendor_ticket: ticketNum,
                    wedding_profile_completed: getCompletionScore() >= 6,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', userId);

            if (error) throw error;

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            onSave?.();
        } catch (err: any) {
            alert('Erro ao salvar: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <header className="space-y-4 border-b border-white/5 pb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-600/15 rounded-2xl">
                        <Heart size={24} className="text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-serif text-white">Perfil do Casamento</h1>
                        <p className="text-zinc-500 text-sm mt-1">Essas informações qualificam seu pedido para os fornecedores</p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-zinc-500 font-bold uppercase tracking-widest">
                        <span>{getCompletionScore()} de 8 campos preenchidos</span>
                        <span className={completionPct >= 75 ? 'text-emerald-400' : completionPct >= 40 ? 'text-amber-400' : 'text-zinc-500'}>{completionPct}% completo</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-700 ${completionPct >= 75 ? 'bg-emerald-500' : completionPct >= 40 ? 'bg-amber-500' : 'bg-red-600'}`}
                            style={{ width: `${completionPct}%` }}
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Orçamento total */}
                <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center gap-3 text-white">
                        <Wallet size={20} className="text-red-500" />
                        <h3 className="font-bold">Orçamento Total</h3>
                    </div>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-bold">R$</span>
                        <input
                            type="text"
                            placeholder="0"
                            value={budget}
                            onChange={e => setBudget(formatCurrency(e.target.value))}
                            className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-10 pr-4 py-4 text-white outline-none focus:border-red-600 text-lg font-bold placeholder:text-zinc-700 transition-colors"
                        />
                    </div>
                    <p className="text-xs text-zinc-600">Valor total disponível para o casamento completo</p>
                </div>

                {/* Ticket por fornecedor */}
                <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center gap-3 text-white">
                        <TicketCheck size={20} className="text-amber-500" />
                        <h3 className="font-bold">Ticket por Fornecedor</h3>
                        <span className="ml-auto text-[10px] bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-lg font-black uppercase tracking-wider">Auto</span>
                    </div>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-bold">R$</span>
                        <input
                            type="text"
                            placeholder="0"
                            value={vendorTicket}
                            onChange={e => setVendorTicket(formatCurrency(e.target.value))}
                            className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-10 pr-4 py-4 text-white outline-none focus:border-amber-500 text-lg font-bold placeholder:text-zinc-700 transition-colors"
                        />
                    </div>
                    <p className="text-xs text-zinc-600">Calculado automaticamente com base no orçamento total ÷ 6 fornecedores principais</p>
                </div>

                {/* Data do Casamento */}
                <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center gap-3 text-white">
                        <CalendarDays size={20} className="text-purple-500" />
                        <h3 className="font-bold">Data do Casamento</h3>
                    </div>
                    <input
                        type="date"
                        value={weddingDate}
                        onChange={e => setWeddingDate(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-4 py-4 text-white outline-none focus:border-purple-500 transition-colors [color-scheme:dark]"
                    />
                </div>

                {/* Cidade */}
                <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center gap-3 text-white">
                        <MapPin size={20} className="text-blue-500" />
                        <h3 className="font-bold">Cidade do Casamento</h3>
                    </div>
                    <input
                        type="text"
                        placeholder="Ex: São Paulo, SP"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-4 py-4 text-white outline-none focus:border-blue-500 placeholder:text-zinc-700 transition-colors"
                    />
                </div>

                {/* Número de Convidados */}
                <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 space-y-4 md:col-span-2">
                    <div className="flex items-center gap-3 text-white">
                        <Users size={20} className="text-emerald-500" />
                        <h3 className="font-bold">Número de Convidados</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['Até 50', '50 a 100', '100 a 200', 'Acima de 200'].map(opt => (
                            <button
                                key={opt}
                                onClick={() => setGuestCount(opt)}
                                className={`py-4 rounded-2xl border text-sm font-bold transition-all ${guestCount === opt ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-900/30' : 'bg-zinc-900 border-white/5 text-zinc-400 hover:border-emerald-600/50 hover:text-white'}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Estilo do Casamento */}
            <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 space-y-5">
                <div className="flex items-center gap-3 text-white">
                    <Sparkles size={20} className="text-pink-500" />
                    <h3 className="font-bold">Estilo do Casamento</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {STYLES.map(s => (
                        <button
                            key={s.value}
                            onClick={() => setWeddingStyle(s.value)}
                            className={`p-4 rounded-2xl border text-left transition-all group ${weddingStyle === s.value ? 'bg-red-600/20 border-red-600/60 text-white' : 'bg-zinc-900 border-white/5 text-zinc-400 hover:border-white/20 hover:text-white'}`}
                        >
                            <div className="text-2xl mb-2">{s.emoji}</div>
                            <div className="font-bold text-sm">{s.label}</div>
                            <div className="text-[11px] text-zinc-500 mt-0.5 leading-snug">{s.desc}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Nível de Urgência */}
            <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 space-y-5">
                <div className="flex items-center gap-3 text-white">
                    <Clock size={20} className="text-amber-500" />
                    <h3 className="font-bold">Nível de Urgência</h3>
                    <span className="text-xs text-zinc-500 ml-1">Quão urgente é encontrar seus fornecedores?</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {URGENCY.map(u => (
                        <button
                            key={u.value}
                            onClick={() => setUrgencyLevel(u.value)}
                            className={`p-4 rounded-2xl border transition-all ${urgencyLevel === u.value ? `${u.bg} ${u.color} border-current` : 'bg-zinc-900 border-white/5 text-zinc-400 hover:border-white/20'}`}
                        >
                            <div className="text-2xl mb-2">{u.icon}</div>
                            <div className="font-bold text-sm">{u.label}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Estágio de Decisão */}
            <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 space-y-5">
                <div className="flex items-center gap-3 text-white">
                    <Target size={20} className="text-violet-500" />
                    <h3 className="font-bold">Estágio de Decisão</h3>
                    <span className="text-xs text-zinc-500 ml-1">Onde você está no processo de contratação?</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {STAGES.map(st => (
                        <button
                            key={st.value}
                            onClick={() => setDecisionStage(st.value)}
                            className={`p-5 rounded-2xl border text-left transition-all ${decisionStage === st.value ? `${st.bg} ${st.color}` : 'bg-zinc-900 border-white/5 text-zinc-400 hover:border-white/20 hover:text-white'}`}
                        >
                            <div className="mb-3">{st.icon}</div>
                            <div className="font-bold mb-1">{st.label}</div>
                            <div className="text-xs opacity-75 leading-relaxed">{st.desc}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/5">
                {saved && (
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold animate-in fade-in duration-300">
                        <CheckCircle size={16} />
                        Perfil salvo com sucesso!
                    </div>
                )}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-red-900/30 hover:shadow-red-900/50"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {saving ? 'Salvando...' : 'Salvar Perfil'}
                </button>
            </div>
        </div>
    );
};
