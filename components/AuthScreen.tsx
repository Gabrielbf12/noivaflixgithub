
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { UserRole } from '../types';
import { Logo } from '../App';

interface AuthScreenProps {
    onAuthSuccess: (userId: string, role: UserRole, onboardingCompleted?: boolean) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<UserRole>('noiva');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async () => {
        setLoading(true);
        setError(null);

        try {
            if (authMode === 'signup') {
                // Step 1: Create auth user
                const { data: authData, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            name: name,
                            role: role,
                        },
                    },
                });

                if (signUpError) {
                    console.error('Signup error:', signUpError);
                    throw signUpError;
                }

                if (!authData.user) {
                    throw new Error('Falha ao criar usuário');
                }

                console.log('✅ User created in auth.users:', authData.user.id);

                // Step 2: Wait a bit for trigger if exists
                await new Promise(resolve => setTimeout(resolve, 500));

                // Step 3: Check/Create profile with correct data
                const { data: existingProfile } = await supabase
                    .from('profiles')
                    .select('id, role')
                    .eq('id', authData.user.id)
                    .single();

                if (existingProfile) {
                    // Profile exists (maybe via trigger), but let's make sure role is correct
                    if (existingProfile.role !== role) {
                        await supabase.from('profiles').update({ name, role }).eq('id', authData.user.id);
                    }
                    console.log('✅ Profile found and verified');
                } else {
                    // Create profile manually with all data
                    console.log('⚠️ Profile not found, creating manually with role:', role);

                    const trialEndsAt = new Date();
                    trialEndsAt.setDate(trialEndsAt.getDate() + 7);

                    const profileData = {
                        id: authData.user.id,
                        name: name || '',
                        role: role,
                        subscription_status: 'trialing',
                        trial_ends_at: trialEndsAt.toISOString(),
                        created_at: new Date().toISOString()
                    };

                    const { error: profileError } = await supabase
                        .from('profiles')
                        .insert(profileData);

                    if (profileError && profileError.code !== '23505') {
                        throw new Error(`Erro ao criar perfil: ${profileError.message}`);
                    }
                }

                // Signup successful - fetch profile to check onboarding status
                console.log('✅ Signup successful:', authData.user);
                const { data: signupProfile } = await supabase
                    .from('profiles')
                    .select('role, onboarding_completed')
                    .eq('id', authData.user.id)
                    .single();

                onAuthSuccess(
                    authData.user.id,
                    signupProfile?.role || role,
                    signupProfile?.onboarding_completed || false
                );

            } else {
                // Login
                const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
                if (signInError) {
                    console.error('Login error:', signInError);
                    throw signInError;
                }

                if (!data.user) {
                    throw new Error('Falha ao fazer login');
                }

                // Login successful - fetch profile to check onboarding status
                console.log('✅ Login successful:', data.user);
                const { data: loginProfile } = await supabase
                    .from('profiles')
                    .select('role, onboarding_completed')
                    .eq('id', data.user.id)
                    .single();

                onAuthSuccess(
                    data.user.id,
                    loginProfile?.role || 'noiva', // Default to 'noiva' if role not found
                    loginProfile?.onboarding_completed || false
                );
            }
        } catch (err: any) {
            console.error('Auth error:', err);
            setError(err.message || 'Ocorreu um erro ao criar a conta.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-black text-white font-sans selection:bg-red-500">
            <div className="hidden lg:flex flex-1 relative items-center justify-center p-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-black z-10"></div>
                <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-30" alt="Wedding" />
                <div className="relative z-20 space-y-8"><Logo className="w-96" /><h1 className="text-7xl font-serif">Respira.<br /><span className="text-zinc-500 text-5xl">A melhor temporada da sua vida vai começar.</span></h1></div>
            </div>
            <div className="w-full lg:w-[500px] bg-zinc-950 flex flex-col justify-center p-8 md:p-16 border-l border-white/5">
                <div className="max-w-md mx-auto w-full space-y-10">
                    <div className="lg:hidden flex justify-center mb-8"><Logo className="w-48" /></div>
                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold">{authMode === 'login' ? 'Bem-vinda' : 'Crie sua conta'}</h2>
                        {authMode === 'signup' && (
                            <div className="flex bg-zinc-900 p-1 rounded-2xl border border-white/5">
                                <button onClick={() => setRole('noiva')} className={`flex-1 py-3 px-4 rounded-xl font-bold text-[10px] uppercase transition-all ${role === 'noiva' ? 'bg-red-600 shadow-lg' : 'text-zinc-500'}`}>Sou Noiva</button>
                                <button onClick={() => setRole('fornecedor')} className={`flex-1 py-3 px-4 rounded-xl font-bold text-[10px] uppercase transition-all ${role === 'fornecedor' ? 'bg-emerald-600 shadow-lg' : 'text-zinc-500'}`}>Sou Fornecedor</button>
                            </div>
                        )}
                    </div>

                    {error && <div className="p-4 bg-red-900/50 border border-red-500 rounded-xl text-red-200 text-sm">{error}</div>}

                    <div className="space-y-5">
                        {authMode === 'signup' && (
                            <div className="space-y-2"><label className="text-xs font-black uppercase text-zinc-600">Nome Completo</label><input type="text" placeholder="Seu nome" className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 outline-none focus:border-red-600 text-white" value={name} onChange={e => setName(e.target.value)} /></div>
                        )}
                        <div className="space-y-2"><label className="text-xs font-black uppercase text-zinc-600">E-mail</label><input type="email" placeholder="nome@exemplo.com" className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 outline-none focus:border-red-600 text-white" value={email} onChange={e => setEmail(e.target.value)} /></div>
                        <div className="space-y-2"><label className="text-xs font-black uppercase text-zinc-600">Senha</label><input type="password" placeholder="••••••••" className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 outline-none focus:border-red-600 text-white" value={password} onChange={e => setPassword(e.target.value)} /></div>
                    </div>

                    <button disabled={loading} onClick={handleAuth} className={`w-full py-6 rounded-2xl font-black text-lg shadow-xl uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed ${role === 'fornecedor' && authMode === 'signup' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>
                        {loading ? 'Carregando...' : (authMode === 'login' ? 'Entrar Agora' : 'Criar minha conta')}
                    </button>

                    <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="w-full text-zinc-500 text-sm hover:text-white text-center">{authMode === 'login' ? 'Cadastre-se grátis' : 'Já tem conta? Faça login'}</button>
                    <div className="pt-4 border-t border-white/5 text-center"><p className="text-zinc-700 text-[10px] uppercase font-black tracking-widest">Acesso Restrito: admin@noivaflix.com</p></div>
                </div>
            </div>
        </div>
    );
};
