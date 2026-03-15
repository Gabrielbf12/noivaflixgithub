
import React from 'react';
import { 
  ArrowRight, CheckCircle2, Heart, Users, Store, Zap, 
  MessageCircle, Smartphone, Globe, ShieldCheck, ChevronDown, Plus
} from 'lucide-react';
import { Logo } from '../App';

interface LandingPageProps {
  onAction: (mode: 'login' | 'signup', role?: 'noiva' | 'fornecedor') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onAction }) => {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-red-500 overflow-x-hidden">
      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 w-full z-[100] bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Logo className="w-32 md:w-40" />
          <nav className="flex items-center gap-4 md:gap-8">
            <button 
              onClick={() => onAction('login')} 
              className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
            >
              Entrar
            </button>
            <button 
              onClick={() => onAction('signup', 'noiva')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-red-900/20 active:scale-95"
            >
              Começar
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000" 
            className="w-full h-full object-cover opacity-40 scale-105"
            alt="Wedding Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-500/20 px-4 py-2 rounded-full text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            <Heart size={14} className="fill-current" /> A plataforma nº 1 para organização de casamentos
          </div>
          <h1 className="text-5xl md:text-8xl font-serif leading-[1.1] tracking-tight">
            Organize seu casamento sem <span className="text-red-500 italic">caos</span>, planilhas ou mensagens perdidas.
          </h1>
          <p className="text-lg md:text-2xl text-zinc-400 max-w-3xl mx-auto font-light leading-relaxed">
            A Noivaflix conecta noivas e fornecedores em um só lugar. Compare opções, organize seu planejamento e encontre os melhores profissionais para o seu grande dia.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
            <button 
              onClick={() => onAction('signup', 'noiva')}
              className="w-full md:w-auto px-12 py-6 bg-red-600 hover:bg-red-700 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-red-600/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              Começar grátis <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => onAction('signup', 'fornecedor')}
              className="w-full md:w-auto px-12 py-6 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-3xl font-black text-sm uppercase tracking-[0.2em] backdrop-blur-md transition-all hover:scale-105 active:scale-95"
            >
              Sou fornecedor
            </button>
          </div>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
            Cadastro gratuito. Sem compromisso.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-32 px-6 bg-black relative">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-serif">Planejar um casamento pode ser simples.</h2>
            <div className="w-20 h-1.5 bg-red-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '1', title: 'Crie seu perfil', desc: 'Cadastre-se gratuitamente e comece a organizar seu casamento ou seu negócio.' },
              { num: '2', title: 'Encontre ou receba pedidos', desc: 'Noivas encontram fornecedores. Fornecedores recebem pedidos de orçamento.' },
              { num: '3', title: 'Compare e organize tudo', desc: 'Centralize contatos, propostas e planejamento em um só lugar.' },
              { num: '4', title: 'Tome decisões com mais segurança', desc: 'Escolha fornecedores com mais clareza e menos estresse.' }
            ].map((step, i) => (
              <div key={i} className="group p-10 bg-zinc-900/40 border border-white/5 rounded-[40px] hover:border-red-600/30 transition-all duration-500 hover:translate-y-[-8px]">
                <div className="text-6xl font-serif text-red-600/20 group-hover:text-red-600/40 transition-colors mb-6">{step.num}</div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para Noivas */}
      <section className="py-32 px-6 bg-zinc-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-red-600/5 blur-[120px] rounded-full"></div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 space-y-10 order-2 lg:order-1">
            <h2 className="text-4xl md:text-7xl font-serif leading-tight">Planeje seu casamento com mais tranquilidade</h2>
            <ul className="space-y-6">
              {[
                'Encontre fornecedores mais rápido',
                'Compare propostas com mais clareza',
                'Organize contatos e pedidos',
                'Tenha tudo centralizado',
                'Evite perder informações no WhatsApp'
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-4 text-zinc-400">
                  <div className="w-6 h-6 rounded-full bg-red-600/10 flex items-center justify-center text-red-500 shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
            <p className="text-xl text-zinc-500 italic max-w-lg">
              "Planejar o casamento não precisa ser confuso. A Noivaflix ajuda você a ter mais controle em cada etapa."
            </p>
            <button 
              onClick={() => onAction('signup', 'noiva')}
              className="px-12 py-6 bg-white text-black rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all shadow-xl active:scale-95"
            >
              Criar conta gratuita
            </button>
          </div>
          <div className="flex-1 relative order-1 lg:order-2">
            <img 
              src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200" 
              className="rounded-[60px] shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 border border-white/5"
              alt="Brides"
            />
          </div>
        </div>
      </section>

      {/* Para Fornecedores */}
      <section className="py-32 px-6 bg-black relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-emerald-600/5 blur-[120px] rounded-full"></div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 relative">
            <img 
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200" 
              className="rounded-[60px] shadow-2xl border border-white/5 opacity-80"
              alt="Vendors"
            />
          </div>
          <div className="flex-1 space-y-10">
            <h2 className="text-4xl md:text-7xl font-serif leading-tight">Receba pedidos de orçamento mais qualificados</h2>
            <ul className="space-y-6">
              {[
                'Apresente seu trabalho para novas noivas',
                'Receba pedidos de orçamento diretamente',
                'Mostre seu portfólio',
                'Ganhe visibilidade no mercado de casamentos',
                'Organize contatos e oportunidades'
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-4 text-zinc-400">
                  <div className="w-6 h-6 rounded-full bg-emerald-600/10 flex items-center justify-center text-emerald-500 shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
            <p className="text-xl text-zinc-500 italic max-w-lg">
              Em vez de depender apenas do Instagram, esteja em uma plataforma criada para conectar você a quem realmente está organizando um casamento.
            </p>
            <button 
              onClick={() => onAction('signup', 'fornecedor')}
              className="px-12 py-6 bg-emerald-600 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20 active:scale-95"
            >
              Quero cadastrar meu serviço
            </button>
          </div>
        </div>
      </section>

      {/* Diferenciais Section */}
      <section className="py-32 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-serif">Por que usar a Noivaflix</h2>
            <div className="w-20 h-1.5 bg-red-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: <Zap size={32} />, title: 'Tudo em um só lugar', desc: 'Contatos, fornecedores, pedidos e planejamento centralizados.' },
              { icon: <Smartphone size={32} />, title: 'Menos estresse', desc: 'Evite perder mensagens, informações ou prazos importantes.' },
              { icon: <CheckCircle2 size={32} />, title: 'Mais organização', desc: 'Planeje cada etapa do casamento com mais clareza.' },
              { icon: <Store size={32} />, title: 'Mais oportunidades', desc: 'Fornecedores recebem novos pedidos e ampliam sua presença.' }
            ].map((card, i) => (
              <div key={i} className="bg-zinc-900/40 p-12 rounded-[50px] border border-white/5 hover:border-white/10 transition-all flex items-start gap-8">
                <div className="p-5 bg-red-600/10 text-red-500 rounded-3xl shrink-0">
                  {card.icon}
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">{card.title}</h3>
                  <p className="text-zinc-500 text-lg leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cadastro Gratuito */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-red-600 to-red-900 rounded-[60px] p-12 md:p-20 text-center space-y-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30"></div>
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-6xl font-serif text-white">Comece gratuitamente</h2>
            <p className="text-red-100 text-xl md:text-2xl font-light max-w-2xl mx-auto">
              Crie sua conta na Noivaflix e descubra como organizar seu casamento ou ampliar suas oportunidades no mercado de eventos.
            </p>
            <div className="space-y-8 pt-4">
              <button 
                onClick={() => onAction('signup', 'noiva')}
                className="px-12 py-6 bg-white text-black rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-zinc-100 transition-all shadow-2xl active:scale-95"
              >
                Criar conta grátis
              </button>
              <p className="text-red-200 text-xs font-bold uppercase tracking-widest">Cadastro simples e rápido.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 bg-black">
        <div className="max-w-3xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-serif">Perguntas frequentes</h2>
            <div className="w-20 h-1.5 bg-red-600 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-4">
            {[
              { q: 'O que é a Noivaflix?', a: 'A Noivaflix é uma plataforma que conecta noivas e fornecedores de casamento em um único lugar, facilitando organização, contatos e pedidos de orçamento.' },
              { q: 'A plataforma é para noivas ou fornecedores?', a: 'Para os dois. Noivas podem encontrar fornecedores e organizar seu casamento. Fornecedores podem divulgar seus serviços e receber pedidos.' },
              { q: 'O cadastro é gratuito?', a: 'Sim. Você pode criar sua conta gratuitamente e começar a usar a plataforma.' },
              { q: 'Preciso baixar aplicativo?', a: 'Não. A Noivaflix funciona diretamente no navegador.' },
              { q: 'Posso cancelar quando quiser?', a: 'Sim. Você pode parar de usar a plataforma a qualquer momento.' },
              { q: 'A Noivaflix substitui o contato direto com fornecedores?', a: 'Não. Ela facilita o encontro e organização entre noivas e fornecedores.' }
            ].map((faq, i) => (
              <details key={i} className="group bg-zinc-900 shadow-sm border-white/5 border rounded-3xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between p-8 text-white transition-colors hover:bg-zinc-800">
                  <h3 className="text-lg font-bold">{faq.q}</h3>
                  <div className="bg-white/5 p-2 rounded-full text-zinc-500 group-open:rotate-45 transition-transform">
                    <Plus size={20} />
                  </div>
                </summary>
                <div className="px-8 pb-8 pt-0 text-zinc-400 leading-relaxed border-t border-white/5">
                  <p className="pt-6">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-40 px-6 text-center space-y-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 blur-[150px] rounded-full"></div>
        <div className="relative z-10 space-y-8">
          <h2 className="text-5xl md:text-8xl font-serif max-w-4xl mx-auto leading-tight">
            Seu casamento merece mais organização e menos estresse.
          </h2>
          <p className="text-zinc-500 text-xl font-light">Comece agora e descubra uma nova forma de planejar seu grande dia.</p>
          <button 
            onClick={() => onAction('signup', 'noiva')}
            className="px-16 py-8 bg-red-600 hover:bg-red-700 text-white rounded-[40px] font-black text-lg uppercase tracking-[0.2em] shadow-2xl shadow-red-600/30 transition-all hover:scale-105 active:scale-95"
          >
            Criar conta grátis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-white/5 pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
          <div className="space-y-8">
            <Logo className="w-48" />
            <p className="text-zinc-500 leading-relaxed font-light">
              Plataforma para organização de casamentos e conexão com fornecedores.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-3 bg-zinc-900 rounded-xl text-zinc-500 hover:text-white transition-all"><Globe size={20} /></a>
              <a href="#" className="p-3 bg-zinc-900 rounded-xl text-zinc-500 hover:text-white transition-all"><Smartphone size={20} /></a>
              <a href="#" className="p-3 bg-zinc-900 rounded-xl text-zinc-500 hover:text-white transition-all"><MessageCircle size={20} /></a>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Navegação</h4>
            <ul className="space-y-4">
              {['Início', 'Como funciona', 'Para noivas', 'Para fornecedores', 'Perguntas frequentes'].map((item) => (
                <li key={item}><a href="#" className="text-zinc-400 hover:text-white transition-all text-sm">{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Legal</h4>
            <ul className="space-y-4">
              {['Termos de uso', 'Política de privacidade', 'Contato'].map((item) => (
                <li key={item}><a href="#" className="text-zinc-400 hover:text-white transition-all text-sm">{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Suporte</h4>
            <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5 space-y-4">
              <p className="text-xs text-zinc-500 leading-relaxed font-light">Precisa de ajuda com a plataforma?</p>
              <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                Falar com Suporte
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">© 2026 NOIVAFLIX. Todos os direitos reservados.</p>
          <div className="flex gap-8">
            <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-black uppercase tracking-widest">
              <ShieldCheck size={14} /> 100% Seguro
            </div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-black uppercase tracking-widest">
              <Zap size={14} className="text-red-600" /> Infraestrutura Premium
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
