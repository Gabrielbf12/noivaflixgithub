import React, { useState } from 'react';
import { Briefcase, MapPin, Building2, ArrowRight, Store, Camera, X, Plus } from 'lucide-react';

import { supabase } from '../supabaseClient';

interface VendorOnboardingProps {
    userId: string;
    onComplete: () => void;
}

export const VendorOnboarding: React.FC<VendorOnboardingProps> = ({ userId, onComplete }) => {
    const [step, setStep] = useState(1);
    const [businessName, setBusinessName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [experienceYears, setExperienceYears] = useState('1');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [phone, setPhone] = useState('');
    const [instagram, setInstagram] = useState('');
    const [website, setWebsite] = useState('');
    const [portfolio, setPortfolio] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadingPortfolio, setUploadingPortfolio] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'portfolio') => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (type === 'avatar') setUploading(true);
        else setUploadingPortfolio(true);

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${userId}-${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('wedding-images')
                    .upload(`${type === 'avatar' ? 'vendors/avatars/' : 'vendors/portfolio/'}${fileName}`, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('wedding-images')
                    .getPublicUrl(`${type === 'avatar' ? 'vendors/avatars/' : 'vendors/portfolio/'}${fileName}`);

                if (type === 'avatar') {
                    setAvatarUrl(publicUrl);
                    break;
                } else {
                    setPortfolio(prev => [...prev, publicUrl]);
                }
            }
        } catch (err: any) {
            console.error(`Error uploading ${type}:`, err);
            alert('Erro ao carregar imagem: ' + err.message);
        } finally {
            setUploading(false);
            setUploadingPortfolio(false);
        }
    };

    const handleComplete = async () => {
        setLoading(true);
        try {
            const updateData = {
                business_name: businessName,
                category: category,
                description: description,
                experience_years: parseInt(experienceYears),
                city: city,
                state: state,
                phone: phone || null,
                instagram: instagram || null,
                website: website || null,
                portfolio: portfolio,
                avatar_url: avatarUrl,
                onboarding_completed: true
            };

            const { error } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', userId);

            if (error) throw error;
            onComplete();
        } catch (err: any) {
            console.error('❌ Error finishing onboarding:', err);
            alert('Erro ao salvar perfil: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        'Acessórios', 'Aluguel de Carros', 'Bartender', 'Beleza e Dia da Noiva', 'Bem Casados',
        'Bolo e Doces', 'Buffet', 'Cerimonialista', 'Convites e Papelaria', 'Coreografia',
        'Decoração', 'Dia do Noivo', 'Espaço', 'Filmagem', 'Fotografia', 'Gastronomia',
        'Joias', 'Lembrancinhas', 'Lista de Presentes', 'Lua de Mel', 'Música (Bandas/DJs)',
        'Música para Cerimônia', 'Noite de Núpcias', 'Open Bar', 'Recreação Infantil',
        'Sapato da Noiva', 'Segurança e Limpeza', 'Terno do Noivo', 'Valet', 'Vestido de Noiva'
    ].sort();

    const states = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
        'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    return (
        <div className="min-h-screen w-full flex bg-black text-white font-sans overflow-hidden">
            <div className="hidden lg:flex flex-1 relative items-center justify-center p-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 via-transparent to-black z-10"></div>
                <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Wedding Business" />
                <div className="relative z-20 space-y-8 max-w-lg">
                    <div className="p-6 bg-emerald-600 text-white w-fit rounded-[32px] shadow-2xl shadow-emerald-600/20">
                        <Store size={48} />
                    </div>
                    <h1 className="text-6xl font-black font-serif text-white leading-tight">Chegou a sua vez de <br /><span className="text-emerald-500">brilhar.</span></h1>
                    <p className="text-zinc-400 text-xl leading-relaxed font-light">
                        Milhares de noivas buscam o fornecedor perfeito todos os dias. Vamos deixar o seu perfil irresistível.
                    </p>
                </div>
            </div>

            <div className="w-full lg:w-[700px] bg-zinc-950 flex flex-col justify-center p-8 md:p-16 border-l border-white/5 relative overflow-y-auto">
                <div className="max-w-md mx-auto w-full space-y-12 py-10">
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(s => (
                                <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-emerald-600' : 'bg-zinc-800'}`}></div>
                            ))}
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 text-center">Passo {step} de 5</p>
                    </div>

                    {step === 1 && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right duration-500">
                            <div className="space-y-3">
                                <h2 className="text-4xl font-serif text-white">Sua Marca</h2>
                                <p className="text-zinc-500">A primeira impressão é a que fica. Suba sua melhor logo.</p>
                            </div>
                            <div className="flex flex-col items-center gap-8">
                                <div className="relative group">
                                    <div className={`w-48 h-48 rounded-[48px] border-2 border-dashed flex items-center justify-center overflow-hidden transition-all duration-500 ${avatarUrl ? 'border-emerald-600 shadow-2xl shadow-emerald-600/10' : 'border-white/10 bg-zinc-900 group-hover:border-emerald-500/50'}`}>
                                        {avatarUrl ? (
                                            <img src={avatarUrl} className="w-full h-full object-cover" alt="Logo" />
                                        ) : (
                                            <Camera className="w-16 h-16 text-zinc-700 group-hover:text-emerald-500 transition-colors" />
                                        )}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                                <div className="w-10 h-10 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <label className="w-full">
                                    <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'avatar')} className="hidden" disabled={uploading} />
                                    <div className="w-full py-6 bg-zinc-900 border border-white/5 hover:border-emerald-600/30 rounded-3xl font-black flex items-center justify-center gap-3 cursor-pointer transition-all uppercase text-[10px] tracking-[0.2em] text-zinc-400 hover:text-white">
                                        {avatarUrl ? 'Trocar Imagem' : 'Selecionar Imagem'}
                                    </div>
                                </label>
                            </div>
                            <button onClick={() => setStep(2)} className="w-full py-6 bg-emerald-600 hover:bg-emerald-700 rounded-3xl font-black flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-emerald-600/20 transition-all active:scale-95">
                                Próximo Passo <ArrowRight size={18} />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
                            <div className="space-y-3">
                                <h2 className="text-4xl font-serif text-white">O Negócio</h2>
                                <p className="text-zinc-500">Conte para as noivas o que torna seu serviço único.</p>
                            </div>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Nome da Empresa</label>
                                    <input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Ex: Boutique de Eventos" className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 outline-none focus:border-emerald-600 text-white placeholder:text-zinc-700 transition-all" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Categoria Principal</label>
                                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 outline-none focus:border-emerald-600 text-white appearance-none transition-all">
                                            <option value="">Selecione...</option>
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Anos de Experiência</label>
                                        <input type="number" value={experienceYears} onChange={e => setExperienceYears(e.target.value)} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 outline-none focus:border-emerald-600 text-white transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Descrição / Biografia</label>
                                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Conte sua história, estilo de trabalho e diferenciais..." rows={4} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 outline-none focus:border-emerald-600 text-white transition-all resize-none placeholder:text-zinc-700" />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setStep(1)} className="flex-1 py-6 bg-zinc-900 text-zinc-500 rounded-3xl font-black uppercase text-[10px] tracking-widest">Voltar</button>
                                <button onClick={() => setStep(3)} disabled={!businessName || !category} className="flex-[2] py-6 bg-emerald-600 hover:bg-emerald-700 rounded-3xl font-black flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[11px] disabled:opacity-50 transition-all">Próximo</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
                            <div className="space-y-3">
                                <h2 className="text-4xl font-serif text-white">Local e Contato</h2>
                                <p className="text-zinc-500">Ajude as noivas da sua região a te encontrarem.</p>
                            </div>
                            <div className="space-y-5">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Cidade Sede</label>
                                        <input value={city} onChange={e => setCity(e.target.value)} placeholder="Ex: São Paulo" className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 outline-none focus:border-emerald-600 text-white transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">UF</label>
                                        <select value={state} onChange={e => setState(e.target.value)} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 outline-none focus:border-emerald-600 text-white transition-all">
                                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">WhatsApp de Vendas</label>
                                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(11) 99999-9999" className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 outline-none focus:border-emerald-600 text-white transition-all" />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setStep(2)} className="flex-1 py-6 bg-zinc-900 text-zinc-500 rounded-3xl font-black uppercase text-[10px] tracking-widest">Voltar</button>
                                <button onClick={() => setStep(4)} disabled={!city} className="flex-[2] py-6 bg-emerald-600 hover:bg-emerald-700 rounded-3xl font-black flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[11px] disabled:opacity-50 transition-all">Próximo</button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
                            <div className="space-y-3">
                                <h2 className="text-4xl font-serif text-white">Presença Digital</h2>
                                <p className="text-zinc-500">Onde mais as noivas podem te seguir e conhecer seu trabalho?</p>
                            </div>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Instagram (@)</label>
                                    <input value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="@seunegocio" className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 outline-none focus:border-emerald-600 text-white transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Site Oficial</label>
                                    <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="www.seusite.com.br" className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 outline-none focus:border-emerald-600 text-white transition-all" />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setStep(3)} className="flex-1 py-6 bg-zinc-900 text-zinc-500 rounded-3xl font-black uppercase text-[10px] tracking-widest">Voltar</button>
                                <button onClick={() => setStep(5)} className="flex-[2] py-6 bg-emerald-600 hover:bg-emerald-700 rounded-3xl font-black flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[11px] transition-all">Próximo</button>
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
                            <div className="space-y-3">
                                <h2 className="text-4xl font-serif text-white">Seu Portfólio</h2>
                                <p className="text-zinc-500">Suba até 6 fotos exclusivas dos seus melhores projetos.</p>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {portfolio.map((img, i) => (
                                    <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden border border-white/10">
                                        <img src={img} className="w-full h-full object-cover" />
                                        <button onClick={() => setPortfolio(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-red-500"><X size={14} /></button>
                                    </div>
                                ))}
                                {portfolio.length < 6 && (
                                    <label className="aspect-square rounded-2xl border-2 border-dashed border-white/5 bg-zinc-900/50 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/50 transition-all group">
                                        <input type="file" multiple accept="image/*" onChange={e => handleFileUpload(e, 'portfolio')} className="hidden" disabled={uploadingPortfolio} />
                                        {uploadingPortfolio ? <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div> : <Plus className="text-zinc-700 group-hover:text-emerald-500 transition-colors" />}
                                    </label>
                                )}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button onClick={() => setStep(4)} className="flex-1 py-6 bg-zinc-900 text-zinc-500 rounded-3xl font-black uppercase text-[10px] tracking-widest">Voltar</button>
                                <button onClick={handleComplete} disabled={loading} className="flex-[2] py-6 bg-emerald-600 hover:bg-emerald-700 rounded-3xl font-black flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-emerald-600/30 transition-all active:scale-95">
                                    {loading ? 'Finalizando...' : 'Concluir Cadastro'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
