
import React from 'react';
import { 
  ArrowRight, CheckCircle2, Heart, Users, Store, Zap, 
  MessageCircle, Smartphone, Globe, ShieldCheck, ChevronDown, Plus,
  LayoutDashboard, Video as VideoIcon, ListTodo, Wallet, Search, Star,
  Calendar, MapPin, Share2, ClipboardCheck, BarChart3
} from 'lucide-react';
import { Logo } from '../App';

interface LandingPageProps {
  onAction: (mode: 'login' | 'signup', role?: 'noiva' | 'fornecedor') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onAction }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-500 overflow-x-hidden">
      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 w-full z-[100] bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo className="w-32 md:w-36" />
          </div>
          <nav className="flex items-center gap-6">
            <button 
              onClick={() => onAction('login')} 
              className="hidden md:block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
            >
              Entrar
            </button>
            <button 
              onClick={() => onAction('signup', 'noiva')}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-red-900/20 active:scale-95 flex items-center gap-2"
            >
              Começar Agora <ArrowRight size={14} />
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 px-6 overflow-hidden">
        {/* Background - Elegant Gradient Mesh */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_40%,rgba(229,9,20,0.08),transparent_60%)]"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="inline-flex items-center gap-3 bg-zinc-900/50 border border-white/10 px-6 py-2.5 rounded-full backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
            <span className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">A inteligência que seu casamento merece</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-serif leading-[1.05] tracking-tight">
            A plataforma completa que <span className="text-red-600 italic">conecta noivas</span> e fornecedores em um único lugar.
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto font-light leading-relaxed">
            Organize seu planejamento, controle seu orçamento e encontre os melhores profissionais. Elimine o caos das mensagens perdidas com uma gestão inteligente e centralizada.
          </p>

          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">
              A escolha favorita dos noivos mais organizados do Brasil
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
              <button 
                onClick={() => onAction('signup', 'noiva')}
                className="w-full md:w-auto px-12 py-6 bg-red-600 hover:bg-red-700 text-white rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-red-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
              >
                Criar conta gratuita <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => onAction('signup', 'fornecedor')}
                className="w-full md:w-auto px-12 py-6 bg-zinc-900/50 hover:bg-zinc-800 text-white border border-white/10 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] backdrop-blur-md transition-all hover:scale-105 active:scale-95"
              >
                Sou fornecedor
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20 animate-bounce">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* Social Proof / Trust Bar */}
      <section className="relative z-20 px-6 -mt-12 md:-mt-20 scale-y-105">
        <div className="max-w-6xl mx-auto bg-zinc-900 border border-white/5 rounded-[40px] p-10 md:p-14 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-center text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-serif text-white flex items-center justify-center gap-1">---</div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Fornecedores Cadastrados</p>
            </div>
            <div className="space-y-2 md:border-x border-white/10">
              <div className="text-4xl md:text-5xl font-serif text-white flex items-center justify-center gap-1">---</div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Noivas Planejando</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-serif text-white flex items-center justify-center gap-1">---</div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Pedidos Enviados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Dashboard Demo Section - "The Product" */}
      <section className="py-32 px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
          <div className="text-center space-y-4 max-w-3xl">
            <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">Experiência Premium</span>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight">Veja como funciona por dentro</h2>
            <p className="text-zinc-500 text-lg font-light leading-relaxed">
              Uma interface limpa, intuitiva e feita para quem valoriza cada segundo do seu tempo. Tenha o controle total do seu grande dia em um painel inteligente.
            </p>
          </div>

          {/* High-Fidelity Mockup Container */}
          <div className="w-full max-w-6xl relative group">
            <div className="absolute -inset-4 bg-red-600/5 blur-[100px] rounded-full opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            
            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl">
              {/* Browser/Window Chrome */}
              <div className="bg-zinc-900/60 border-b border-white/5 p-4 flex items-center">
                <div className="flex gap-2 ml-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                  <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                </div>
                <div className="flex-1 max-w-sm mx-auto h-8 bg-black/40 rounded-xl border border-white/5 flex items-center px-4">
                  <span className="text-[10px] text-zinc-600 font-mono tracking-tight">app.noivaflix.com/admin/dashboard</span>
                </div>
              </div>

              {/* Main App Layout Mockup */}
              <div className="flex h-[400px] md:h-[700px] bg-[#0a0a0a]">
                {/* Refined Sidebar */}
                <div className="hidden md:flex w-64 border-r border-white/5 p-8 flex-col gap-10">
                  <div className="w-32 h-6 bg-red-600/10 rounded-lg animate-pulse"></div>
                  <div className="space-y-4">
                    {[
                      { icon: LayoutDashboard, label: "Dashboard", active: true },
                      { icon: ListTodo, label: "Checklist", active: false },
                      { icon: Users, label: "Convidados", active: false },
                      { icon: Wallet, label: "Financeiro", active: false },
                      { icon: Store, label: "Fornecedores", active: false },
                      { icon: Globe, label: "Meu Site", active: false }
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center gap-4 p-3 rounded-2xl ${item.active ? 'bg-red-600/10 text-red-500 border border-red-500/10' : 'text-zinc-600'}`}>
                        <item.icon size={20} />
                        <div className="h-2 w-24 bg-current/20 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto p-4 bg-zinc-900/50 rounded-2xl border border-white/5 space-y-3">
                    <div className="h-2 w-full bg-zinc-800 rounded-full"></div>
                    <div className="h-10 w-full bg-red-600/20 rounded-xl"></div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6 md:p-12 space-y-10 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="h-4 w-20 bg-zinc-800 rounded-full"></div>
                      <div className="h-8 w-64 bg-white/5 rounded-2xl"></div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-zinc-900 rounded-2xl border border-white/5"></div>
                      <div className="w-12 h-12 bg-zinc-900 rounded-2xl border border-white/5"></div>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: "Checklist", val: "75%", color: "text-red-500" },
                      { label: "Orçamento", val: "R$ 42k", color: "text-emerald-500" },
                      { label: "Convidados", val: "240", color: "text-blue-500" }
                    ].map((s, i) => (
                      <div key={i} className="bg-zinc-900/40 p-6 rounded-[24px] border border-white/5 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{s.label}</span>
                          <div className={`p-2 bg-black/40 rounded-lg ${s.color}`}><Zap size={14} /></div>
                        </div>
                        <div className="text-3xl font-serif">{s.val}</div>
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div className={`h-full bg-current ${s.color}`} style={{ width: '60%' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Complex Widgets */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-zinc-900/20 border border-white/5 rounded-[32px] p-8 space-y-6">
                      <div className="flex justify-between items-center">
                        <div className="h-4 w-40 bg-white/5 rounded-full"></div>
                        <Plus size={20} className="text-zinc-600" />
                      </div>
                      <div className="space-y-4 pt-2">
                        {[1, 2, 3, 4].map(j => (
                          <div key={j} className="flex items-center gap-4 group/item">
                            <div className="w-6 h-6 rounded-lg bg-zinc-900 border border-white/10 group-hover/item:border-red-600 transition-colors"></div>
                            <div className="h-2 flex-1 bg-zinc-900 rounded-full"></div>
                            <div className="h-4 w-12 bg-white/5 rounded-full"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-zinc-900/20 border border-white/5 rounded-[32px] p-8 space-y-6">
                      <div className="h-4 w-40 bg-white/5 rounded-full"></div>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        {[1, 2, 3, 4].map(k => (
                          <div key={k} className="aspect-video bg-zinc-900/60 rounded-2xl border border-white/5 flex items-center justify-center">
                             <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA after Demo */}
          <div className="pt-8">
            <button 
              onClick={() => onAction('signup', 'noiva')}
              className="px-12 py-6 bg-white text-black rounded-[24px] font-black text-sm uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all shadow-2xl active:scale-95"
            >
              Começar agora gratuitamente
            </button>
          </div>
        </div>
      </section>

      {/* Como Funciona - Clean Step Guide */}
      <section className="py-32 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto space-y-20 text-center">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight">Menos caos, mais celebração.</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">Transforme seu planejamento com um fluxo de trabalho profissional.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <UserPlus />, title: 'Crie seu perfil', desc: 'Sua central de controle em poucos cliques.' },
              { icon: <Search />, title: 'Curadoria Única', desc: 'Filtre e selecione profissionais verificados.' },
              { icon: <MessageCircle />, title: 'Comunicação', desc: 'Centralize orçamentos e conversas.' },
              { icon: <ClipboardCheck />, title: 'Decisão Ágil', desc: 'Feche contratos com total segurança.' }
            ].map((step, i) => (
              <div key={i} className="group p-10 bg-zinc-950 border border-white/5 rounded-[40px] hover:border-red-600/30 transition-all duration-300">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-8 group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para Noivas Section */}
      <section id="noivas" className="py-32 px-6 bg-[#080808] relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-24">
          <div className="flex-1 space-y-12">
            <div className="space-y-4">
              <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">Área da Noiva</span>
              <h2 className="text-4xl md:text-7xl font-serif leading-[1.05]">Tudo o que você precisa em uma só aba.</h2>
            </div>
            <p className="text-xl text-zinc-400 font-light leading-relaxed">
              Deixe de perder tempo procurando planilhas ou subindo conversas no WhatsApp. A Noivaflix organiza cada detalhe para você.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { title: 'Checklist Dinâmico', desc: 'Tarefas sugeridas por data.' },
                { icon: <PieChart />, title: 'Controle Financeiro', desc: 'Gerencie cada centavo gasto.' },
                { title: 'Painel de Convidados', desc: 'RSVP automático e listas.' },
                { title: 'Busca Inteligente', desc: 'Filtre por categoria e região.' }
              ].map((f, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1"><CheckCircle2 size={18} className="text-red-600 shrink-0" /></div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold uppercase tracking-wider">{f.title}</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => onAction('signup', 'noiva')}
              className="px-12 py-6 bg-red-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-95 flex items-center gap-3"
            >
              Criar meu planejamento <ArrowRight size={18} />
            </button>
          </div>
          <div className="flex-1 relative">
            <div className="absolute -inset-10 bg-red-600/5 blur-[120px] rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200" 
              className="relative z-10 rounded-[64px] shadow-2xl border border-white/5"
              alt="Noiva Planejando"
            />
          </div>
        </div>
      </section>

      {/* Para Fornecedores Section */}
      <section id="fornecedores" className="py-32 px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-24">
          <div className="flex-1 relative order-2 lg:order-1">
            <div className="absolute -inset-10 bg-emerald-600/5 blur-[120px] rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200" 
              className="relative z-10 rounded-[64px] shadow-2xl border border-white/5 opacity-90"
              alt="Evento de Casamento"
            />
          </div>
          <div className="flex-1 space-y-12 order-1 lg:order-2">
            <div className="space-y-4">
              <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">Área do Fornecedor</span>
              <h2 className="text-4xl md:text-7xl font-serif leading-[1.05]">Novos pedidos direto no seu painel.</h2>
            </div>
            <p className="text-xl text-zinc-400 font-light leading-relaxed">
              Amplie sua visibilidade e receba leads qualificados. Mostre seu trabalho para noivas que já estão prontas para contratar.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { title: 'Vitrine Premium', desc: 'Portfólio de alta conversão.' },
                { title: 'CRM Integrado', desc: 'Gerencie leads e status.' },
                { title: 'Pedidos de Orçamento', desc: 'Receba RFPs detalhadas.' },
                { title: 'Selo de Confiança', desc: 'Ganhe autoridade no mercado.' }
              ].map((f, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1"><CheckCircle2 size={18} className="text-emerald-500 shrink-0" /></div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold uppercase tracking-wider">{f.title}</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => onAction('signup', 'fornecedor')}
              className="px-12 py-6 bg-emerald-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/40"
            >
              Quero cadastrar meu serviço
            </button>
          </div>
        </div>
      </section>

      {/* Institutional Purpose */}
      <section className="py-24 px-6 border-y border-white/5 bg-[#050505] text-center">
        <div className="max-w-4xl mx-auto space-y-8">
           <Logo className="w-24 mx-auto opacity-30 grayscale mb-4" />
           <h2 className="text-2xl md:text-3xl font-serif italic text-zinc-400">
             "Acreditamos que todo casamento de sucesso começa com organização e confiança. Nossa missão é unir tecnologia e os melhores profissionais para tornar o planejamento tão emocionante quanto a própria cerimônia."
           </h2>
           <div className="h-0.5 w-12 bg-red-600/30 mx-auto rounded-full"></div>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">Propósito Noivaflix</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 bg-black">
        <div className="max-w-3xl mx-auto space-y-16">
          <header className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif">Ainda tem dúvidas?</h2>
            <p className="text-zinc-500 font-light">Tudo o que você precisa saber para começar agora.</p>
          </header>
          <div className="space-y-2">
            {[
              { q: 'O que é a Noivaflix?', a: 'A Noivaflix é a primeira plataforma centralizada do Brasil focada em conectar noivas e fornecedores e oferecer ferramentas de gestão integradas via dashboard.' },
              { q: 'Como fornecedores são verificados?', a: 'Realizamos uma análise cuidadosa de portfólio, tempo de atuação e referências de mercado antes de conceder selos de verificação premium.' },
              { q: 'É gratuito para noivas?', a: 'O cadastro e as ferramentas básicas de gestão são gratuitos. Oferecemos planos premium para recursos de automação e sites personalizados.' },
              { q: 'Posso usar no celular?', a: 'Sim! A Noivaflix é totalmente otimizada para navegadores mobile, permitindo que você planeje de qualquer lugar.' }
            ].map((faq, i) => (
              <details key={i} className="group bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between p-8 hover:bg-zinc-800/40 transition-colors">
                  <h3 className="text-base font-black uppercase tracking-wider text-zinc-200">{faq.q}</h3>
                  <div className="text-zinc-600 group-open:rotate-180 transition-transform duration-300"><ChevronDown size={20} /></div>
                </summary>
                <div className="px-8 pb-8 text-zinc-400 text-sm leading-relaxed border-t border-white/5 pt-6 font-light">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-40 px-6 text-center space-y-12 relative overflow-hidden bg-[#050505]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(229,9,20,0.06),transparent_60%)]"></div>
        <div className="relative z-10 space-y-12 animate-in fade-in duration-1000">
          <h2 className="text-5xl md:text-8xl font-serif max-w-5xl mx-auto leading-[1.1] tracking-tight">
            Seu casamento sem caos <br /> <span className="text-red-600 italic">começa aqui</span>.
          </h2>
          <p className="text-zinc-500 text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Abandone a bagunça. Junte-se a milhares de casais e profissionais na plataforma que está transformando o mercado de eventos.
          </p>
          <div className="space-y-8">
            <button 
              onClick={() => onAction('signup', 'noiva')}
              className="px-16 py-8 bg-red-600 hover:bg-red-700 text-white rounded-[32px] font-black text-xl uppercase tracking-[0.2em] shadow-2xl shadow-red-600/40 transition-all hover:scale-105 active:scale-95"
            >
              Começar Agora
            </button>
            <div className="flex items-center justify-center gap-2 text-zinc-700 text-[10px] font-black uppercase tracking-[0.4em]">
              <ShieldCheck size={14} /> 100% Gratuito para Começar
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/5 pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-24">
          <div className="space-y-10">
            <Logo className="w-48" />
            <p className="text-zinc-500 text-sm leading-relaxed font-light">
              Redefinindo o planejamento de casamentos através da tecnologia e conexão qualificada entre noivas e profissionais.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-3 bg-zinc-900/50 rounded-2xl text-zinc-600 hover:text-white transition-all"><Globe size={20} /></a>
              <a href="#" className="p-3 bg-zinc-900/50 rounded-2xl text-zinc-600 hover:text-white transition-all"><Smartphone size={20} /></a>
              <a href="#" className="p-3 bg-zinc-900/50 rounded-2xl text-zinc-600 hover:text-white transition-all"><MessageCircle size={20} /></a>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">Plataforma</h4>
            <ul className="space-y-4">
              {['Vantagens Noiva', 'Ferramentas de Gestão', 'Área do Fornecedor', 'Como Funciona', 'FAQ'].map((item) => (
                <li key={item}><a href="#" className="text-zinc-500 hover:text-red-500 transition-all text-xs font-light">{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">Legal</h4>
            <ul className="space-y-4">
              {['Termos de Uso', 'Privacidade', 'Cookies', 'Segurança'].map((item) => (
                <li key={item}><a href="#" className="text-zinc-500 hover:text-red-500 transition-all text-xs font-light">{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">Suporte Premium</h4>
            <div className="p-8 bg-zinc-900/30 rounded-[32px] border border-white/5 space-y-4">
              <p className="text-xs text-zinc-600 leading-relaxed font-light">Dúvidas sobre o funcionamento da plataforma?</p>
              <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5">
                Falar com Suporte
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.3em]">© 2026 NOIVAFLIX. Inteligência em Eventos.</p>
          <div className="flex gap-8 items-center grayscale opacity-30 hover:opacity-100 transition-all duration-500">
            <ShieldCheck size={18} />
            <Globe2 size={18} />
            <Zap size={18} className="text-red-600" />
            <div className="text-[9px] font-black uppercase tracking-widest">SSL secure</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
