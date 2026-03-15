
import React from 'react';
import { 
  ArrowRight, CheckCircle2, Heart, Users, Store, Zap, 
  MessageCircle, Smartphone, Globe, ShieldCheck, ChevronDown, Plus,
  LayoutDashboard, Video as VideoIcon, ListTodo, Wallet, Search, Star
} from 'lucide-react';
import { Logo } from '../App';

interface LandingPageProps {
  onAction: (mode: 'login' | 'signup', role?: 'noiva' | 'fornecedor') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onAction }) => {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-red-500 overflow-x-hidden">
      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 w-full z-[100] bg-black/60 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo className="w-32 md:w-36" />
          </div>
          <nav className="flex items-center gap-6">
            <button 
              onClick={() => onAction('login')} 
              className="hidden md:block text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
            >
              Entrar
            </button>
            <button 
              onClick={() => onAction('signup', 'noiva')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-900/40 active:scale-95 flex items-center gap-2"
            >
              Começar Agora <ArrowRight size={14} />
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
        {/* Subtly different background - cleaner than purely Netflix */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(229,9,20,0.05),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-black"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-4">
            <Heart size={14} className="text-red-600 fill-current" /> Transformando o planejamento do seu grande dia
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.05] tracking-tight">
            Organize seu casamento de ponta a ponta e encontre os <span className="text-red-600 italic">melhores fornecedores</span>.
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto font-light leading-relaxed">
            A plataforma completa que elimina o caos das planilhas e mensagens perdidas, centralizando tudo entre noivas e profissionais em um só lugar.
          </p>

          <p className="text-emerald-500 text-xs font-black uppercase tracking-[0.2em] animate-pulse">
            Segurança e praticidade para o dia mais importante da sua vida.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => onAction('signup', 'noiva')}
              className="w-full md:w-auto px-10 py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-600/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              Criar conta gratuita
            </button>
            <button 
              onClick={() => onAction('signup', 'fornecedor')}
              className="w-full md:w-auto px-10 py-5 bg-zinc-900 hover:bg-zinc-800 text-white border border-white/5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
            >
              Sou fornecedor
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30 animate-bounce">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* Social Proof / Stats Bar */}
      <section className="relative z-20 -mt-10 mb-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-1 bg-zinc-900 border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
          <div className="p-10 text-center space-y-2 bg-zinc-950/50">
            <h3 className="text-4xl font-serif text-white">Noivas</h3>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-none">Utilizando a plataforma</p>
          </div>
          <div className="p-10 text-center space-y-2 bg-zinc-950/50 md:border-x border-white/5">
            <h3 className="text-4xl font-serif text-white">Fornecedores</h3>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-none">Cadastrados e Verificados</p>
          </div>
          <div className="p-10 text-center space-y-2 bg-zinc-950/50">
            <h3 className="text-4xl font-serif text-white">Pedidos</h3>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-none">De orçamento enviados hoje</p>
          </div>
        </div>
      </section>

      {/* Platform Dashboard Demo Section */}
      <section className="py-20 px-6 bg-black relative overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-serif">Veja como funciona por dentro</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">Uma interface pensada para ser tão fáci de usar quanto seu streaming favorito.</p>
          </div>

          {/* Dashboard Mockup Container */}
          <div className="relative group animate-in fade-in duration-1000">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-zinc-800/20 rounded-[40px] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-zinc-950 border border-white/10 rounded-[32px] overflow-hidden shadow-[0_0_50px_-12px_rgba(229,9,20,0.15)]">
              {/* Browser Header */}
              <div className="bg-zinc-900/80 border-b border-white/5 p-4 flex items-center gap-3">
                <div className="flex gap-1.5 ml-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                </div>
                <div className="flex-1 max-w-md mx-auto h-7 bg-black/40 rounded-lg border border-white/5 flex items-center px-4">
                  <span className="text-[10px] text-zinc-600 font-mono tracking-tight">app.noivaflix.com/dashboard</span>
                </div>
              </div>

              {/* Dashboard Content Mockup */}
              <div className="flex h-[400px] md:h-[600px]">
                {/* Sidebar Mockup */}
                <div className="w-16 md:w-56 bg-black border-r border-white/5 p-4 md:p-6 space-y-8 hidden sm:block">
                  <div className="w-8 md:w-32 h-6 bg-red-600/20 rounded-lg"></div>
                  <div className="space-y-4">
                    {[LayoutDashboard, VideoIcon, ListTodo, Users, Wallet, Store, Globe].map((Icon, i) => (
                      <div key={i} className={`flex items-center gap-3 p-2 rounded-xl ${i === 0 ? 'bg-red-600/10 text-red-500' : 'text-zinc-600'}`}>
                        <Icon size={20} />
                        <div className="h-2 w-20 bg-current/20 rounded-full hidden md:block"></div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Main Content Mockup */}
                <div className="flex-1 bg-[#080808] p-6 md:p-10 space-y-8 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="h-8 w-48 bg-white/5 rounded-xl"></div>
                      <div className="h-3 w-32 bg-zinc-800 rounded-full"></div>
                    </div>
                    <div className="h-10 w-10 bg-zinc-900 rounded-full"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 space-y-4 h-32">
                        <div className="h-2 w-16 bg-zinc-800 rounded-full"></div>
                        <div className="h-6 w-10 bg-white/10 rounded-lg"></div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-8 h-64 space-y-4">
                      <div className="h-4 w-32 bg-white/5 rounded-lg"></div>
                      <div className="space-y-3 pt-4">
                        {[1, 2, 3, 4].map(j => (
                          <div key={j} className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded bg-red-600/20"></div>
                            <div className="h-2 flex-1 bg-zinc-800 rounded-full"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-8 h-64 space-y-4">
                      <div className="h-4 w-32 bg-white/5 rounded-lg"></div>
                      <div className="grid grid-cols-2 gap-3 pt-4">
                        {[1, 2, 3, 4].map(k => (
                          <div key={k} className="aspect-video bg-zinc-800 rounded-2xl"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona - Refined */}
      <section className="py-32 px-6 bg-zinc-950 relative">
        <div className="max-w-7xl mx-auto space-y-20">
          <header className="max-w-2xl mx-auto text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif">O seu planejamento em 4 etapas inteligentes</h2>
            <div className="w-16 h-1 bg-red-600 mx-auto rounded-full"></div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { num: '01', title: 'Crie seu Perfil', desc: 'Acesse instantaneamente ferramentas de gestão gratuitas.' },
              { num: '02', title: 'Curadoria de Fornecedores', desc: 'Encontre profissionais verificados por categoria e localização.' },
              { num: '03', title: 'Central de Orçamentos', desc: 'Envie pedidos e receba propostas organizadas no seu painel.' },
              { num: '04', title: 'Casamento sem Caos', desc: 'Tome decisões baseadas em dados e checklists precisos.' }
            ].map((step, i) => (
              <div key={i} className="group p-8 bg-zinc-900/30 border border-white/5 rounded-[32px] hover:bg-black hover:border-red-600/40 transition-all duration-300">
                <span className="text-xs font-black text-red-600 tracking-[0.3em] block mb-6">{step.num}</span>
                <h3 className="text-xl font-bold mb-3 tracking-tight">{step.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Purpose / Institutional */}
      <section className="py-20 px-6 border-y border-white/5 bg-black">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Logo className="w-24 mx-auto opacity-50 grayscale" />
          <h2 className="text-2xl md:text-3xl font-serif italic text-zinc-300 px-4">
            "Nossa missão é devolver a leveza ao planejamento do casamento, unindo tecnologia e os melhores profissionais para que cada casal viva intensamente sua própria história."
          </h2>
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="h-px w-8 bg-zinc-800"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Noivaflix Institutional</span>
            <div className="h-px w-8 bg-zinc-800"></div>
          </div>
        </div>
      </section>

      {/* Para Noivas Section with CTA */}
      <section id="noivas" className="py-32 px-6 bg-black relative">
        <div className="max-w-7xl mx-auto space-y-32">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 space-y-10">
              <span className="px-4 py-2 bg-red-600/10 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/10">Para as Noivas</span>
              <h2 className="text-4xl md:text-7xl font-serif leading-[1.1]">Controle absoluto do seu orçamento e checklist.</h2>
              <p className="text-xl text-zinc-400 font-light leading-relaxed">
                Deixe de lado as dezenas de mensagens no WhatsApp e planilhas confusas. Tenha uma visão clara de cada centavo gasto e de cada tarefa pendente.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: 'Orçamento Inteligente', desc: 'Controle de gastos por categoria.' },
                  { title: 'Checklist Dinâmico', desc: 'Saiba exatamente o próximo passo.' },
                  { title: 'Gestão de Convidados', desc: 'RSVP integrado ao seu site.' },
                  { title: 'Portfólio de Referências', desc: 'Salve o que mais te inspira.' }
                ].map((f, i) => (
                  <div key={i} className="flex gap-4">
                    <CheckCircle2 size={18} className="text-red-600 shrink-0 mt-1" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold">{f.title}</h4>
                      <p className="text-xs text-zinc-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-6">
                <button 
                  onClick={() => onAction('signup', 'noiva')}
                  className="px-10 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-2xl"
                >
                  Começar meu planejamento grátis
                </button>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute -inset-4 bg-red-600/10 blur-3xl opacity-30 rounded-full"></div>
              <img 
                src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200" 
                className="relative z-10 rounded-[48px] shadow-2xl border border-white/5"
                alt="Noiva planejando"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Para Fornecedores Section with CTA */}
      <section id="fornecedores" className="py-32 px-6 bg-zinc-950 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-emerald-600/10 blur-3xl opacity-30 rounded-full"></div>
              <img 
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200" 
                className="relative z-10 rounded-[48px] shadow-2xl border border-white/5"
                alt="Fornecedores em evento"
              />
            </div>
            <div className="flex-1 space-y-10 order-1 lg:order-2">
              <span className="px-4 py-2 bg-emerald-600/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/10">Para Fornecedores</span>
              <h2 className="text-4xl md:text-7xl font-serif leading-[1.1]">Transforme visibilidade em contratos fechados.</h2>
              <p className="text-xl text-zinc-400 font-light leading-relaxed">
                Receba pedidos de orçamentos qualificados de noivas que já estão organizando o casamento na plataforma. Mostre seu portfólio para quem realmente decide.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: 'Perfil Profissional', desc: 'Sua vitrine no mercado de luxo.' },
                  { title: 'Recebimento de Leads', desc: 'Notificações de novos pedidos.' },
                  { title: 'Selo de Verificação', desc: 'Ganhe mais autoridade e confiança.' },
                  { title: 'Métricas de Alcance', desc: 'Saiba quantas noivas te viram.' }
                ].map((f, i) => (
                  <div key={i} className="flex gap-4">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-1" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold">{f.title}</h4>
                      <p className="text-xs text-zinc-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-6">
                <button 
                  onClick={() => onAction('signup', 'fornecedor')}
                  className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/40"
                >
                  Cadastrar meu serviço agora
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais Section - More "Branding" focused */}
      <section className="py-32 px-6 bg-black">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-serif">O que nos torna únicos</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">Tecnologia de ponta a serviço de um dos momentos mais importantes da sua vida.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: <Zap size={24} />, title: 'Intuitivo e Rápido', desc: 'Tudo o que você precisa a apenas um clique, sem menus complexos.' },
              { icon: <ShieldCheck size={24} />, title: 'Ambiente Seguro', desc: 'Dados protegidos e fornecedores verificados criteriosamente.' },
              { icon: <MessageCircle size={24} />, title: 'Comunicação Facilitada', desc: 'Centralize orçamentos e conversas com profissionais.' },
              { icon: <Star size={24} />, title: 'Experiência Premium', desc: 'Design focado em clareza, beleza e eficiência operacional.' }
            ].map((card, i) => (
              <div key={i} className="bg-zinc-900/40 p-10 rounded-[40px] border border-white/5 flex gap-8">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-red-600 shrink-0">
                  {card.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold">{card.title}</h3>
                  <p className="text-zinc-500 leading-relaxed font-light">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section with cleaner accordion */}
      <section className="py-32 px-6 bg-zinc-950">
        <div className="max-w-3xl mx-auto space-y-16">
          <h2 className="text-4xl md:text-5xl font-serif text-center">Tire suas dúvidas</h2>
          <div className="space-y-2">
            {[
              { q: 'Quanto custa usar a Noivaflix?', a: 'O cadastro básico para noivas e fornecedores é gratuito. Oferecemos planos premium com recursos avançados de gestão e visibilidade.' },
              { q: 'Como fornecedores são verificados?', a: 'Nossa equipe analisa portfólio, tempo de mercado e referências antes de conceder selos de verificação premium.' },
              { q: 'Consigo gerenciar vários orçamentos?', a: 'Sim! Noivaflix centraliza todos os seus pedidos de orçamento em um dashboard organizado por categoria.' },
              { q: 'A plataforma é segura?', a: 'Sim. Utilizamos criptografia e padrões de segurança de alto nível para proteger todos os seus dados e arquivos.' }
            ].map((faq, i) => (
              <details key={i} className="group bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between p-6 hover:bg-zinc-800/50 transition-colors">
                  <h3 className="text-base font-bold text-zinc-200">{faq.q}</h3>
                  <div className="text-zinc-500 group-open:rotate-180 transition-transform"><ChevronDown size={20} /></div>
                </summary>
                <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final - Very Strong */}
      <section className="py-40 px-6 text-center space-y-12 relative overflow-hidden bg-black">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[120px] rounded-full"></div>
        <div className="relative z-10 space-y-10">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif max-w-4xl mx-auto leading-[1.1]">
            Pronta para transformar seu planejamento?
          </h2>
          <p className="text-zinc-500 text-xl font-light max-w-2xl mx-auto">Junte-se a milhares de noivas e fornecedores na plataforma que está redefinindo o mercado de casamentos.</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => onAction('signup', 'noiva')}
              className="w-full md:w-auto px-16 py-8 bg-red-600 hover:bg-red-700 text-white rounded-[32px] font-black text-lg uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              Criar Conta Gratuita
            </button>
          </div>
          <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em]">Sem cartão de crédito. Sem compromisso.</p>
        </div>
      </section>

      {/* Footer - Refined and focused */}
      <footer className="bg-zinc-950 border-t border-white/5 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="space-y-8">
            <Logo className="w-40" />
            <p className="text-zinc-500 text-sm leading-relaxed font-light">
              A inteligência que seu casamento merece. Conectando sonhos aos melhores realizadores do Brasil.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2.5 bg-zinc-900 rounded-xl text-zinc-500 hover:text-white transition-all"><Globe size={18} /></a>
              <a href="#" className="p-2.5 bg-zinc-900 rounded-xl text-zinc-500 hover:text-white transition-all"><Smartphone size={18} /></a>
              <a href="#" className="p-2.5 bg-zinc-900 rounded-xl text-zinc-500 hover:text-white transition-all"><MessageCircle size={18} /></a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Plataforma</h4>
            <ul className="space-y-3">
              {['Vantagens para Noivas', 'Para Fornecedores', 'Como Funciona', 'FAQ'].map((item) => (
                <li key={item}><a href="#" className="text-zinc-500 hover:text-red-500 transition-all text-xs">{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Links Úteis</h4>
            <ul className="space-y-3">
              {['Termos de Uso', 'Privacidade', 'Trabalhe Conosco', 'Central de Ajuda'].map((item) => (
                <li key={item}><a href="#" className="text-zinc-500 hover:text-red-500 transition-all text-xs">{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Atendimento</h4>
            <div className="space-y-4">
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Segunda a Sexta - 09h às 18h</p>
              <button className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all">
                Suporte WhatsApp
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest">© 2026 NOIVAFLIX. Inteligência e Gestão para Eventos.</p>
          <div className="flex gap-6 items-center opacity-40">
            <ShieldCheck size={16} />
            <div className="w-px h-4 bg-zinc-800"></div>
            <Zap size={16} className="text-red-600" />
            <div className="w-px h-4 bg-zinc-800"></div>
            <span className="text-[8px] font-black uppercase tracking-widest">SSL Secure Connection</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
