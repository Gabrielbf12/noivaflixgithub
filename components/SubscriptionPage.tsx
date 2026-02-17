
import React, { useState } from 'react';
import { CheckCircle2, Star, ShieldCheck, CreditCard, Lock, QrCode, Copy, Check } from 'lucide-react';
import { User } from '../types';

interface SubscriptionPageProps {
    user: User;
    onSubscribe: () => void;
    onBack?: () => void;
    showBack?: boolean;
}

export const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ user, onSubscribe, onBack, showBack }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState<'pricing' | 'initial' | 'pix' | 'card'>('pricing');
    const [copied, setCopied] = useState(false);

    const handleStartCheckout = () => {
        setCheckoutStep('initial');
    };

    const handleConfirmPayment = () => {
        setIsLoading(true);
        // Simular verificação de pagamento
        setTimeout(() => {
            setIsLoading(false);
            onSubscribe();
        }, 3000);
    };

    const copyPixKey = () => {
        navigator.clipboard.writeText("pagamentos@noivaflix.com.br");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200')] bg-cover bg-center opacity-20 blur-sm pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left Column: Value Proposition */}
                <div className="space-y-8">
                    <h1 className="text-5xl md:text-6xl font-serif">
                        Sua jornada <br />
                        <span className="text-red-600">continua aqui.</span>
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        O período de testes acabou, mas o planejamento do seu sonho não pode parar.
                        Garanta acesso ilimitado a todas as ferramentas do Noivaflix.
                    </p>

                    <div className="space-y-4">
                        {[
                            "Checklist Inteligente Completo",
                            "Gestão de Orçamento Ilimitada",
                            "Site dos Noivos Personalizável",
                            "Chat com a Madrinha IA 24h",
                            "Clube de Descontos Exclusivos"
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 text-zinc-300">
                                <CheckCircle2 className="text-emerald-500" size={20} />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Checkout Card */}
                <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] shadow-2xl relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black uppercase text-xs tracking-widest py-2 px-6 rounded-full shadow-lg flex items-center gap-2">
                        <Star size={14} fill="black" /> Recomendado
                    </div>

                    {checkoutStep === 'pricing' ? (
                        <div className="space-y-8 animate-in fade-in zoom-in duration-300">
                            <div className="text-center space-y-2 mt-4">
                                <p className="text-zinc-400 uppercase tracking-widest text-xs font-bold">Acesso Vitalício</p>
                                <div className="flex items-end justify-center gap-1">
                                    <span className="text-5xl font-black text-white">R$ 29,99</span>
                                    <span className="text-zinc-500 mb-2">/único</span>
                                </div>
                                <p className="text-emerald-500 text-sm font-bold italic">Sem mensalidades, pague uma vez.</p>
                            </div>

                            <button
                                onClick={handleStartCheckout}
                                className="w-full py-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-red-600/30 transition-all flex justify-center items-center gap-3 border border-red-500/20"
                            >
                                Contratar Agora
                            </button>

                            <div className="space-y-3 pt-4">
                                <div className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase font-bold tracking-widest justify-center">
                                    <ShieldCheck size={14} className="text-emerald-500" />
                                    Garantia de 7 dias ou seu dinheiro de volta
                                </div>
                            </div>
                        </div>
                    ) : checkoutStep === 'initial' ? (
                        <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                            <div className="text-center space-y-2 mt-4">
                                <h3 className="text-xl font-bold">Escolha como pagar</h3>
                                <p className="text-zinc-500 text-sm">Selecione seu método preferido</p>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={() => setCheckoutStep('card')}
                                    className="w-full py-5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase tracking-widest shadow-xl transition-all flex justify-center items-center gap-3 border border-white/5 group"
                                >
                                    <CreditCard size={20} className="group-hover:text-red-500 transition-colors" /> Cartão de Crédito
                                </button>

                                <button
                                    onClick={() => setCheckoutStep('pix')}
                                    className="w-full py-5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase tracking-widest shadow-xl transition-all flex justify-center items-center gap-3 border border-white/5 group"
                                >
                                    <QrCode size={20} className="group-hover:text-emerald-500 transition-colors" /> Pagar via PIX
                                </button>
                            </div>

                            <button
                                onClick={() => setCheckoutStep('pricing')}
                                className="w-full text-zinc-500 text-xs hover:text-white transition-all uppercase font-black tracking-widest"
                            >
                                Voltar
                            </button>
                        </div>
                    ) : checkoutStep === 'pix' ? (
                        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
                            <div className="text-center space-y-4">
                                <div className="flex justify-center">
                                    <div className="p-4 bg-white rounded-3xl shadow-2xl">
                                        <img
                                            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020126580014br.gov.bcb.pix0136pagamentos@noivaflix.com.br520400005303986540529.995802BR5913NOIVAFLIX%20LTDA6009SAO%20PAULO62070503***6304E2D2"
                                            alt="QR Code Pix"
                                            className="w-48 h-48"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold">Pague com PIX</h3>
                                    <p className="text-zinc-500 text-sm">Escaneie o código ou copie a chave abaixo</p>
                                </div>
                            </div>

                            <div className="bg-black/40 rounded-2xl p-4 border border-white/5 space-y-2">
                                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Chave PIX (E-mail)</label>
                                <div className="flex gap-2">
                                    <input
                                        readOnly
                                        value="pagamentos@noivaflix.com.br"
                                        className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-300 font-mono"
                                    />
                                    <button
                                        onClick={copyPixKey}
                                        className="p-2 hover:bg-white/5 rounded-lg transition-all text-red-500"
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleConfirmPayment}
                                disabled={isLoading}
                                className="w-full py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                            >
                                {isLoading ? (
                                    <>Verificando Pagamento...</>
                                ) : (
                                    <>Confirmar Pagamento</>
                                )}
                            </button>

                            <button
                                onClick={() => setCheckoutStep('initial')}
                                className="w-full text-zinc-500 text-xs hover:text-white transition-all uppercase font-black tracking-widest"
                            >
                                Alterar Método
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold flex items-center gap-3">
                                    <CreditCard size={24} className="text-red-500" /> Cartão de Crédito
                                </h3>
                                <p className="text-zinc-500 text-sm">Insira os dados do seu cartao para finalizar.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Número do Cartão</label>
                                    <input placeholder="0000 0000 0000 0000" className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-red-600 text-white" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Nome no Cartão</label>
                                    <input placeholder="Como está no cartão" className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-red-600 text-white capitalize" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Validade</label>
                                        <input placeholder="MM/AA" className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-red-600 text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">CVV</label>
                                        <input placeholder="123" className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-red-600 text-white" />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleConfirmPayment}
                                disabled={isLoading}
                                className="w-full py-5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                            >
                                {isLoading ? (
                                    <>Processando...</>
                                ) : (
                                    <>Finalizar Pagamento</>
                                )}
                            </button>

                            <button
                                onClick={() => setCheckoutStep('initial')}
                                className="w-full text-zinc-500 text-xs hover:text-white transition-all uppercase font-black tracking-widest"
                            >
                                Escolher outro Método
                            </button>
                        </div>
                    )}

                    <p className="text-center text-zinc-600 text-[10px] mt-6 flex items-center justify-center gap-2">
                        <Lock size={12} /> Pagamento 100% Seguro via Stripe
                    </p>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-zinc-500 text-sm">"O melhor investimento do meu casamento!"</p>
                        <div className="flex justify-center gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} className="text-amber-500" fill="currentColor" />)}
                        </div>
                        <p className="text-zinc-600 text-xs mt-1">Julia M., Noivaflix desde 2024</p>
                    </div>

                    {showBack && (
                        <button
                            onClick={onBack}
                            className="w-full mt-4 py-3 text-zinc-500 hover:text-white text-xs font-black uppercase tracking-widest transition-all"
                        >
                            Voltar para o Dashboard
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};
