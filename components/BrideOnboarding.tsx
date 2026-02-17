import React, { useState } from 'react';
import { Calendar, DollarSign, Users, ArrowRight, Heart, Camera, X } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { PlanningPhase } from '../types';

interface BrideOnboardingProps {
    userId: string;
    onComplete: () => void;
    onLogout?: () => void;
}

export const BrideOnboarding: React.FC<BrideOnboardingProps> = ({ userId, onComplete, onLogout }) => {
    const [step, setStep] = useState(1);
    const [weddingDate, setWeddingDate] = useState('');
    const [phase, setPhase] = useState<PlanningPhase>('estou_perdida');
    const [budget, setBudget] = useState('');
    const [guestCount, setGuestCount] = useState('');
    const [loading, setLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setAvatarUrl(publicUrl);
        } catch (err: any) {
            console.error('Error uploading avatar:', err);
            alert('Erro ao carregar imagem: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleComplete = async () => {
        setLoading(true);
        try {
            console.log('Finalizing bride onboarding for user:', userId);
            const updateData = {
                wedding_date: weddingDate || null,
                phase: phase,
                budget: budget ? parseFloat(budget) : null,
                guest_count: guestCount || null,
                avatar_url: avatarUrl,
                onboarding_completed: true
            };
            console.log('Update payload:', updateData);

            const { error } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', userId);

            if (error) {
                console.error('❌ Supabase error updating profile:', error);
                alert(`Erro ao salvar (DB): ${error.message} [${error.code}]`);
                throw error;
            }
            onComplete();
        } catch (err: any) {
            console.error('❌ Error in handleComplete:', err);
            if (!err.message?.includes('DB')) {
                alert(`Erro ao processar: ${err.message || 'Tente novamente.'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const phases: { value: PlanningPhase; label: string; emoji: string }[] = [
        { value: 'acabei_noivar', label: 'Acabei de noivar! 💍', emoji: '💍' },
        { value: 'estou_perdida', label: 'Estou perdida, preciso de ajuda', emoji: '😰' },
        { value: 'fechei_fornecedores', label: 'Já fechei os fornecedores', emoji: '✅' },
        { value: 'falta_pouco', label: 'Falta pouco! Últimos ajustes', emoji: '🎉' }
    ];

    return (
        <div className="min-h-screen w-full flex bg-black text-white font-sans">
            <div className="hidden lg:flex flex-1 relative items-center justify-center p-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-black z-10"></div>
                <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-30" alt="Wedding" />
                <div className="relative z-20 space-y-8">
                    <Heart className="w-32 h-32 text-red-600" />
                    <h1 className="text-6xl font-serif text-white">Bem-vinda!<br /><span className="text-zinc-500 text-4xl">Sua jornada começa aqui.</span></h1>
                </div>
            </div>

            <div className="w-full lg:w-[600px] bg-zinc-950 flex flex-col justify-center p-8 md:p-16 border-l border-white/5">
                <div className="max-w-md mx-auto w-full space-y-10">
                    {/* Progress */}
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map(s => (
                            <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-red-600' : 'bg-zinc-800'}`}></div>
                        ))}
                    </div>

                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right duration-300">
                            <div className="space-y-4">
                                <div className="p-4 bg-red-600/10 text-red-500 w-fit rounded-2xl">
                                    <Camera size={28} />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-serif">Sua Identidade</h2>
                                    <p className="text-zinc-500">Suba uma foto para personalizar seu perfil.</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-6">
                                <div className="relative group">
                                    <div className={`w-40 h-40 rounded-[40px] border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${avatarUrl ? 'border-red-600' : 'border-white/10 bg-zinc-900'}`}>
                                        {avatarUrl ? (
                                            <img src={avatarUrl} className="w-full h-full object-cover" alt="Profile preview" />
                                        ) : (
                                            <Camera className="w-12 h-12 text-zinc-700 group-hover:text-red-500 transition-colors" />
                                        )}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                                <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </div>
                                    {avatarUrl && (
                                        <button
                                            onClick={() => setAvatarUrl(null)}
                                            className="absolute -top-2 -right-2 bg-red-600 text-white p-2 rounded-xl shadow-lg hover:bg-red-700 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>

                                <label className="w-full">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                    <div className="w-full py-5 bg-zinc-900 border border-white/5 hover:border-red-600/50 rounded-2xl font-bold flex items-center justify-center gap-3 cursor-pointer transition-all uppercase text-xs tracking-widest">
                                        {uploading ? 'Carregando...' : (avatarUrl ? 'Trocar Foto' : 'Selecionar Foto')}
                                    </div>
                                </label>
                            </div>

                            <button onClick={() => setStep(2)} className="w-full py-5 bg-red-600 hover:bg-red-700 rounded-2xl font-bold flex items-center justify-center gap-2 uppercase tracking-widest text-sm shadow-2xl shadow-red-600/20">
                                Continuar <ArrowRight className="w-5 h-5" />
                            </button>
                            {onLogout && (
                                <button
                                    onClick={onLogout}
                                    className="w-full py-5 bg-zinc-900 border border-white/5 hover:bg-zinc-800 rounded-2xl font-bold uppercase text-xs tracking-widest text-zinc-500 hover:text-white transition-colors"
                                >
                                    Sair / Cancelar
                                </button>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                            <div className="space-y-2">
                                <Calendar className="w-12 h-12 text-red-600" />
                                <h2 className="text-4xl font-serif">Quando é o grande dia?</h2>
                                <p className="text-zinc-500">Isso nos ajuda a personalizar suas recomendações</p>
                            </div>
                            <input
                                type="date"
                                value={weddingDate}
                                onChange={e => setWeddingDate(e.target.value)}
                                className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 outline-none focus:border-red-600 text-white text-lg"
                            />
                            <div className="flex gap-3">
                                <button onClick={() => setStep(1)} className="flex-1 py-5 bg-zinc-900 border border-white/5 hover:bg-zinc-800 rounded-2xl font-bold uppercase text-xs tracking-widest">
                                    Voltar
                                </button>
                                <button onClick={() => setStep(3)} className="flex-1 py-5 bg-red-600 hover:bg-red-700 rounded-2xl font-bold flex items-center justify-center gap-2 uppercase text-xs tracking-widest">
                                    Continuar <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                            <div className="space-y-2">
                                <Heart className="w-12 h-12 text-red-600" />
                                <h2 className="text-4xl font-serif">Em que fase você está?</h2>
                                <p className="text-zinc-500">Vamos te ajudar de acordo com seu momento</p>
                            </div>
                            <div className="space-y-3">
                                {phases.map(p => (
                                    <button
                                        key={p.value}
                                        onClick={() => setPhase(p.value)}
                                        className={`w-full p-6 rounded-[25px] border transition-all text-left flex items-center gap-4 ${phase === p.value
                                            ? 'border-red-600 bg-red-600/5'
                                            : 'border-white/5 bg-zinc-900/50 hover:border-white/20'
                                            }`}
                                    >
                                        <div className={`p-3 rounded-xl ${phase === p.value ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                                            <span className="text-xl">{p.emoji}</span>
                                        </div>
                                        <span className="font-bold text-lg">{p.label}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setStep(2)} className="flex-1 py-5 bg-zinc-900 border border-white/5 hover:bg-zinc-800 rounded-2xl font-bold uppercase text-xs tracking-widest">
                                    Voltar
                                </button>
                                <button onClick={() => setStep(4)} className="flex-1 py-5 bg-red-600 hover:bg-red-700 rounded-2xl font-bold flex items-center justify-center gap-2 uppercase text-xs tracking-widest">
                                    Continuar <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                            <div className="space-y-2">
                                <DollarSign className="w-12 h-12 text-red-600" />
                                <h2 className="text-4xl font-serif">Informações finais</h2>
                                <p className="text-zinc-500">Opcional, mas nos ajuda a personalizar ainda mais</p>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Orçamento Total (R$)</label>
                                    <input
                                        type="number"
                                        placeholder="Ex: 50000"
                                        value={budget}
                                        onChange={e => setBudget(e.target.value)}
                                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 outline-none focus:border-red-600 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Número de Convidados</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: 150"
                                        value={guestCount}
                                        onChange={e => setGuestCount(e.target.value)}
                                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 outline-none focus:border-red-600 text-white"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setStep(3)} className="flex-1 py-5 bg-zinc-900 border border-white/5 hover:bg-zinc-800 rounded-2xl font-bold uppercase text-xs tracking-widest">
                                    Voltar
                                </button>
                                <button
                                    onClick={handleComplete}
                                    disabled={loading}
                                    className="flex-1 py-5 bg-red-600 hover:bg-red-700 rounded-2xl font-bold disabled:opacity-50 uppercase tracking-widest"
                                >
                                    {loading ? 'Salvando...' : 'Finalizar!'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
