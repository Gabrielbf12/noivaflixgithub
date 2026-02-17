import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play, CheckCircle2, LayoutDashboard, Video as VideoIcon, ListTodo, Wallet, Users,
  Globe, Store, MessageSquare, Search, ChevronRight, Plus, Settings, X, Send,
  Heart, Calendar, MapPin, Share2, Filter, AlertCircle, Clock, Trophy, Sparkles,
  UserPlus, ImageIcon, Trash2, LogOut, User as UserIcon, Lock, Mail, Camera,
  Banknote, Info, ExternalLink, AlertTriangle, Eye, MessageCircle, BadgeCheck, Check,
  CreditCard, Smartphone, Briefcase, ChevronDown, ArrowRight, ArrowLeft, Building2,
  CheckCircle, ShieldCheck, Database, Download, Ban, CheckCircle as CheckCircleIcon,
  UserCheck, UserX, FileSpreadsheet, ShieldAlert, TrendingUp, History, FilterX, Copy,
  Type, Palette, Layout, Save, Wand2, QrCode, Instagram, Globe2, PieChart, DollarSign,
  Trash, Zap, Compass, Upload
} from 'lucide-react';
import { AppView, Video, Task, Expense, Guest, Vendor, WeddingSiteData, User, UserRole, PlanningPhase, ApprovalStatus, AccountStatus, AdminLog, BudgetCategory } from './types';
import { MOCK_VIDEOS, MOCK_TASKS, MOCK_GUESTS, MOCK_VENDORS, MOCK_BUDGET } from './constants';
import { getAIResponse } from './geminiService';
import { SubscriptionPage } from './components/SubscriptionPage';
import { ImageCropper } from './components/ImageCropper';

const PREMIUM_PRICE_NOIVA = 47; // Exemplo de valor mensal
const PREMIUM_PRICE_FORNECEDOR = 97;

export const Logo: React.FC<{ className?: string }> = ({ className = "w-48" }) => (
  <div className={`relative ${className} select-none flex justify-center`}>
    <svg viewBox="0 0 300 60" xmlns="http://www.w3.org/2000/svg">
      <text
        x="50%"
        y="45"
        textAnchor="middle"
        fill="#E50914"
        style={{
          fontFamily: "'Inter', 'Impact', 'Arial Black', sans-serif",
          fontWeight: 900,
          fontSize: '52px',
          letterSpacing: '-2px',
          transform: 'scaleY(1.1)'
        }}
      >
        NOIVAFLIX
      </text>
    </svg>
  </div>
);

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-zinc-950 border border-white/10 w-full max-w-4xl rounded-[32px] md:rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
        <header className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-white"><X size={20} /></button>
        </header>
        <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto no-scrollbar">{children}</div>
      </div>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 w-full px-2 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-300 ${active ? 'bg-red-600 text-white shadow-lg shadow-red-900/30' : 'text-zinc-500 hover:text-white'
      }`}
  >
    <div className={`${active ? 'scale-110' : 'scale-100'} transition-transform`}>{icon}</div>
    <span className="text-[10px] md:text-sm font-medium">{label}</span>
  </button>
);

const OnboardingWizard: React.FC<{ userName: string, onComplete: (data: Partial<User>) => void }> = ({ userName, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<User>>({
    weddingDate: '2025-10-10',
    phase: 'acabei_noivar',
    budget: 60000,
    guestCount: '150',
    city: 'São Paulo',
    state: 'SP'
  });

  const nextStep = () => setStep(s => s + 1);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-1000">
      <div className="absolute top-12"><Logo className="w-48 opacity-50" /></div>
      <div className="max-w-2xl w-full space-y-12">
        <div className="space-y-4 text-center">
          <div className="flex justify-center gap-2">
            {[1, 2].map((i) => (
              <div key={i} className={`h-1.5 w-16 rounded-full transition-all duration-500 ${i <= step ? 'bg-red-600' : 'bg-zinc-800'}`} />
            ))}
          </div>
          <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Onboarding • Passo {step} de 2</p>
        </div>
        <div className="min-h-[400px] flex flex-col justify-center">
          {step === 1 ? (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="text-center space-y-2"><h2 className="text-4xl font-serif text-white">Olá, {userName}!</h2><p className="text-zinc-500">Quando será o grande dia?</p></div>
              <input type="date" className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-6 outline-none focus:border-red-600 transition-all text-white" value={formData.weddingDate} onChange={e => setFormData({ ...formData, weddingDate: e.target.value })} />
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="text-center space-y-2"><h2 className="text-4xl font-serif text-white">Como você está?</h2><p className="text-zinc-500">Em que fase do planejamento você se encontra?</p></div>
              <div className="grid grid-cols-1 gap-4">
                {[{ id: 'acabei_noivar', label: 'Acabei de noivar' }, { id: 'fechei_fornecedores', label: 'Já fechei fornecedores' }, { id: 'falta_pouco', label: 'Falta pouco tempo' }, { id: 'estou_perdida', label: 'Estou perdida!' }].map(p => (
                  <button key={p.id} onClick={() => setFormData({ ...formData, phase: p.id as PlanningPhase })} className={`w-full p-6 rounded-3xl border transition-all text-left ${formData.phase === p.id ? 'bg-red-600 border-red-600 text-white' : 'bg-zinc-900 border-white/5 text-zinc-400'}`}>{p.label}</button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-4 pt-8"><button onClick={step === 2 ? () => onComplete(formData) : nextStep} className="w-full bg-white text-black py-6 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-2xl">{step === 2 ? 'Começar Planejamento' : 'Próximo Passo'}<ArrowRight size={18} /></button></div>
      </div>
    </div>
  );
};

const SupplierOnboardingWizard: React.FC<{ onComplete: (data: Partial<Vendor>) => void, responsibleName: string, initialEmail: string }> = ({ onComplete, responsibleName, initialEmail }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Vendor>>({
    responsibleName, email: initialEmail, name: '', category: 'Fotografia', location: '', state: 'SP', region: 'Capital', whatsapp: '', description: '', experienceYears: 1, image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=400', instagram: '', website: '', portfolio: [], plan: 'Básico', status: 'pending'
  });
  const stepsCount = 4;
  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-1000">
      <div className="absolute top-12"><Logo className="w-48 opacity-50" /></div>
      <div className="max-w-2xl w-full space-y-12">
        <div className="space-y-4 text-center">
          <div className="flex justify-center gap-2">{Array.from({ length: stepsCount }).map((_, i) => (<div key={i} className={`h-1.5 w-16 rounded-full transition-all duration-500 ${i + 1 <= step ? 'bg-emerald-600' : 'bg-zinc-800'}`} />))}</div>
          <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Cadastro Fornecedor • Passo {step} de {stepsCount}</p>
        </div>
        <div className="min-h-[450px] flex flex-col justify-center animate-in slide-in-from-right-8 duration-500">
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center space-y-2"><h2 className="text-4xl font-serif text-white">Dados Pessoais</h2><p className="text-zinc-500">Quem é o responsável pela empresa?</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-zinc-600 ml-1">Seu Nome</label><input className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-5 outline-none focus:border-emerald-600 text-white" value={formData.responsibleName} onChange={e => setFormData({ ...formData, responsibleName: e.target.value })} /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-zinc-600 ml-1">WhatsApp</label><input placeholder="(00) 00000-0000" className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-5 outline-none focus:border-emerald-600 text-white" value={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} /></div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center space-y-2"><h2 className="text-4xl font-serif text-white">A Empresa</h2><p className="text-zinc-500">Detalhes para as noivas.</p></div>
              <input placeholder="Nome Fantasia" className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-6 outline-none focus:border-emerald-600 text-white" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <select className="bg-zinc-900 border border-white/10 rounded-2xl p-6 outline-none text-white" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}><option>Fotografia</option><option>Espaço</option><option>Buffet</option><option>Música</option><option>Decoração</option></select>
                <input placeholder="Cidade" className="bg-zinc-900 border border-white/10 rounded-2xl p-6 text-white" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center space-y-2"><h2 className="text-4xl font-serif text-white">Portfólio e Logo</h2><p className="text-zinc-500">Sua vitrine visual.</p></div>
              <input placeholder="Link da Logo (URL)" className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-6 outline-none text-white" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
              <input placeholder="Instagram (@)" className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-6 outline-none text-white" value={formData.instagram} onChange={e => setFormData({ ...formData, instagram: e.target.value })} />
            </div>
          )}
          {step === 4 && (
            <div className="space-y-8">
              <div className="text-center space-y-2"><h2 className="text-4xl font-serif text-white">Seu Plano</h2><p className="text-zinc-500">Aumente sua visibilidade.</p></div>
              <div className="grid grid-cols-1 gap-4">
                {[{ id: 'Básico', label: 'Básico', price: 'Grátis' }, { id: 'Premium', label: 'Premium 🚀', price: 'R$ 97/mês' }].map(p => (
                  <button key={p.id} onClick={() => setFormData({ ...formData, plan: p.id as any, isPremium: p.id === 'Premium' })} className={`w-full p-8 rounded-3xl border transition-all flex justify-between items-center ${formData.plan === p.id ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-zinc-900 border-white/5 text-zinc-400'}`}>
                    <span className="text-xl font-black">{p.label}</span><span className="font-bold">{p.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-4 pt-8">{step > 1 && (<button onClick={prevStep} className="flex-1 bg-zinc-900 py-6 rounded-3xl text-zinc-500">Voltar</button>)}<button onClick={step === stepsCount ? () => onComplete(formData) : nextStep} className="flex-[2] bg-white text-black py-6 rounded-3xl font-black uppercase shadow-2xl">{step === stepsCount ? 'Finalizar' : 'Continuar'}</button></div>
      </div>
    </div>
  );
};

import { supabase } from './supabaseClient';
import { AuthScreen } from './components/AuthScreen';
import { ChecklistScreen } from './components/ChecklistScreen';
import { GuestsScreen } from './components/GuestsScreen';
import { ExpensesScreen } from './components/ExpensesScreen';
import { BrideOnboarding } from './components/BrideOnboarding';
import { VendorOnboarding } from './components/VendorOnboarding';

// Sub-componentes auxiliares para icones não definidos
const ArrowUpRight = ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg>;

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [user, setUser] = useState<User | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Database simulator (Initial State)
  const [allUsers, setAllUsers] = useState<User[]>([
    { id: '1', name: 'Juliana Silva', email: 'juliana@email.com', role: 'noiva', plan: 'Premium', avatar: 'https://i.pravatar.cc/150?u=1', weddingDate: '2025-12-20', accountStatus: 'active', dateRegistered: '2023-11-01' },
    { id: '2', name: 'Mariana Costa', email: 'mariana@email.com', role: 'noiva', plan: 'Básico', avatar: 'https://i.pravatar.cc/150?u=2', weddingDate: '2025-05-15', accountStatus: 'active', dateRegistered: '2024-02-10' },
  ]);

  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [mySupplierProfile, setMySupplierProfile] = useState<Vendor | null>(null);

  const [siteData, setSiteData] = useState<WeddingSiteData>({
    slug: 'ana-e-joao', theme: 'Classic', brideName: 'Ana', groomName: 'João', date: '2025-05-15', time: '18:00', locationName: 'Villa dos Lagos', locationAddress: 'Rua das Flores, 123', headline: 'Nossa Contagem Regressiva', story: 'Nossa história começou há 5 anos...', heroImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200', album: ['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600'], rsvpEnabled: true
  });

  const [activeModal, setActiveModal] = useState<'task' | 'expense' | 'supplier_details' | 'guest' | 'admin_details' | 'admin_vendor_details' | 'logs' | 'gallery_add' | 'gallery_add_supplier' | 'cover_crop' | null>(null);
  const [siteEditorTab, setSiteEditorTab] = useState<'content' | 'appearance' | 'gallery'>('content');
  const [tempCropImage, setTempCropImage] = useState<string | null>(null);
  const [supplierTab, setSupplierTab] = useState<'stats' | 'profile' | 'portfolio' | 'plan'>('stats');
  const [adminTab, setAdminTab] = useState<'overview' | 'brides' | 'vendors' | 'finances'>('overview');
  const [showCheckout, setShowCheckout] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState<Partial<Vendor>>({});

  const [vendorSearch, setVendorSearch] = useState({ query: '', category: '', city: '', state: '' });
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [loadingSite, setLoadingSite] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isSlugSaved, setIsSlugSaved] = useState(true);
  const [rsvpResponses, setRsvpResponses] = useState<any[]>([]);

  // New Save/Load logic for Wedding Site
  const fetchWeddingSite = async (userId: string) => {
    setLoadingSite(true);
    try {
      const { data, error } = await supabase
        .from('wedding_sites')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data) {
        setSiteData({
          slug: data.slug,
          theme: data.theme as any,
          brideName: data.bride_name || '',
          groomName: data.groom_name || '',
          date: data.wedding_date || '',
          time: data.wedding_time || '',
          locationName: data.location_name || '',
          locationAddress: data.location_address || '',
          locationUrl: data.location_url || '',
          headline: data.headline || '',
          story: data.story || '',
          heroImage: data.hero_image || '',
          album: data.album || [],
          rsvpEnabled: data.rsvp_enabled
        });
        fetchRSVPs(data.id);
      }
    } catch (err) {
      console.log('No wedding site found for this user yet.');
    } finally {
      setLoadingSite(false);
    }
  };

  const fetchRSVPs = async (siteId: string) => {
    const { data } = await supabase
      .from('rsvp_responses')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false });
    if (data) setRsvpResponses(data);
  };

  const saveWeddingSite = async () => {
    if (!user) return;
    setLoadingSite(true);
    try {
      const payload = {
        user_id: user.id,
        slug: siteData.slug || `${siteData.brideName.toLowerCase()}-e-${siteData.groomName.toLowerCase()}`,
        theme: siteData.theme,
        bride_name: siteData.brideName,
        groom_name: siteData.groomName,
        wedding_date: siteData.date || null,
        wedding_time: siteData.time || null,
        location_name: siteData.locationName,
        location_address: siteData.locationAddress,
        location_url: siteData.locationUrl,
        headline: siteData.headline,
        story: siteData.story,
        hero_image: siteData.heroImage,
        album: siteData.album,
        rsvp_enabled: siteData.rsvpEnabled
      };

      const { data, error } = await supabase
        .from('wedding_sites')
        .upsert(payload, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;

      setIsSlugSaved(true);
      alert('✅ Site salvo com sucesso!');
      if (data) fetchRSVPs(data.id);
    } catch (err: any) {
      console.error('Error saving site:', err);
      alert('Erro ao salvar site: ' + err.message);
    } finally {
      setLoadingSite(false);
    }
  };

  const submitRSVP = async (siteSlug: string, formData: any) => {
    try {
      // First find the site ID from slug
      const { data: site } = await supabase
        .from('wedding_sites')
        .select('id')
        .eq('slug', siteSlug)
        .single();

      if (!site) throw new Error('Site não encontrado');

      // Insert into rsvp_responses - The DB Trigger will handle sync with guests table
      const { error } = await supabase
        .from('rsvp_responses')
        .insert({
          site_id: site.id,
          guest_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          confirmed: formData.confirmed,
          message: formData.message
        });

      if (error) throw error;

      alert('✅ Presença confirmada! Seu nome já está na lista de convidados.');
      setActiveModal(null);
    } catch (err: any) {
      alert('Erro ao confirmar presença: ' + err.message);
    }
  };

  // AI Chat States
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([{ role: 'ai', text: 'Oi! Sou sua Madrinha IA. Respira, estou aqui para te ajudar.' }]);
  const [chatInput, setChatInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAIChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAIChatOpen]);


  const brideFilteredVendors = useMemo(() => {
    return vendors.filter(v => {
      const matchName = v.name.toLowerCase().includes(vendorSearch.query.toLowerCase());
      const matchCategory = !vendorSearch.category || v.category.toLowerCase().includes(vendorSearch.category.toLowerCase());
      const matchCity = !vendorSearch.city || v.location.toLowerCase().includes(vendorSearch.city.toLowerCase());
      const matchState = !vendorSearch.state || v.state.toLowerCase() === vendorSearch.state.toLowerCase();

      return v.status === 'approved' && matchName && matchCategory && matchCity && matchState;
    });
  }, [vendors, vendorSearch]);

  useEffect(() => {
    // Check for shareable site link in URL
    const checkSiteRouting = async () => {
      const path = window.location.pathname;
      if (path.startsWith('/meusite/')) {
        const urlSlug = path.split('/meusite/')[1].split('/')[0];
        if (urlSlug) {
          try {
            const { data, error } = await supabase
              .from('wedding_sites')
              .select('*')
              .eq('slug', urlSlug)
              .single();

            if (data && !error) {
              setSiteData({
                slug: data.slug,
                theme: data.theme,
                brideName: data.bride_name,
                groomName: data.groom_name,
                date: data.wedding_date || '',
                time: data.wedding_time || '',
                locationName: data.location_name || '',
                locationAddress: data.location_address || '',
                locationUrl: data.location_url || '',
                headline: data.headline || '',
                story: data.story || '',
                heroImage: data.hero_image || '',
                album: data.album || [],
                rsvpEnabled: data.rsvp_enabled
              });
              setCurrentView(AppView.SITE_PUBLIC);
              return true;
            }
          } catch (err) {
            console.error('Error fetching site by slug:', err);
          }
        }
      }
      return false;
    };

    const init = async () => {
      setIsLoadingInitial(true);
      try {
        // Run site routing and session check in parallel
        const [isRouted, { data: { session } }] = await Promise.all([
          checkSiteRouting(),
          supabase.auth.getSession()
        ]);

        if (session) {
          await fetchUserProfile(session.user.id);
        }

        // If not routed and no session, we show login
        if (!isRouted && !session) {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoadingInitial(false);
        fetchVendors();
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        fetchUserProfile(session.user.id);
        fetchVendors();
        setIsLoggedIn(true);
      } else {
        const isRouted = await checkSiteRouting();
        if (!isRouted) {
          setIsLoggedIn(false);
          setUser(null);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'fornecedor')
        .eq('onboarding_completed', true);

      if (error) throw error;

      if (data) {
        const mappedVendors: Vendor[] = data.map(v => ({
          id: v.id,
          userId: v.id,
          name: v.business_name || v.name || 'Empresa sem nome',
          responsibleName: v.name || '',
          category: v.category || 'Outros',
          location: v.city || 'Não informada',
          state: v.state || '',
          region: '',
          image: v.avatar_url || `https://i.pravatar.cc/150?u=${v.id}`,
          description: v.description || 'Nenhuma descrição disponível.',
          experience_years: v.experience_years || 0,
          rating: 4.5, // Mock value for now
          portfolio: v.portfolio || [],
          instagram: v.instagram || '',
          website: v.website || '',
          whatsapp: v.phone || '',
          phone: v.phone || '',
          email: v.email || '',
          isPremium: v.subscription_status === 'active',
          status: 'approved',
          views: v.views || 0,
          leads: v.leads || 0,
          plan: v.subscription_status === 'active' ? 'Premium' : 'Básico'
        }));
        setVendors(mappedVendors);
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      console.log('👤 Profile Loaded:', {
        id: data.id,
        role: data.role,
        status: data.subscription_status,
        plan: data.subscription_status === 'active' ? 'Premium' : 'Básico/Trial'
      });
      setUser({
        id: data.id,
        name: data.name || 'Noiva',
        email: data.email || '',
        role: data.role as UserRole,
        plan: data.subscription_status === 'active' ? 'Premium' :
          (data.subscription_status === 'trialing' ? 'Degustação' : 'Básico'),
        avatar: data.avatar_url || `https://i.pravatar.cc/150?u=${data.id}`,
        weddingDate: data.wedding_date,
        onboardingCompleted: !!data.onboarding_completed,
        accountStatus: 'active',
        dateRegistered: data.created_at || new Date().toISOString(),
        subscriptionStatus: data.subscription_status,
        trialEndsAt: data.trial_ends_at,
        budget: data.budget,
        guestCount: data.guest_count,
        phase: data.phase,
        city: data.city,
        state: data.state,
        phone: data.phone
      });
      setIsLoggedIn(true);
      if (data.role === 'noiva') fetchWeddingSite(userId);
      if (data.role === 'fornecedor') {
        setMySupplierProfile({
          id: data.id,
          userId: data.id,
          name: data.business_name || 'Minha Empresa',
          responsibleName: data.name || '',
          category: data.category || '',
          location: data.city || '',
          state: data.state || '',
          region: '',
          image: data.avatar_url || `https://i.pravatar.cc/150?u=${data.id}`,
          description: data.description || '',
          experience_years: data.experience_years || 0,
          rating: 0,
          portfolio: data.portfolio || [],
          instagram: data.instagram || '',
          website: data.website || '',
          whatsapp: data.phone || '',
          phone: data.phone || '',
          email: data.email || '',
          isPremium: data.subscription_status === 'active',
          status: 'approved',
          views: data.views || 0,
          leads: data.leads || 0,
          plan: data.subscription_status === 'active' ? 'Premium' : 'Básico'
        });
        if (!!data.onboarding_completed) setCurrentView(AppView.SUPPLIER_DASHBOARD);
      }
      fetchChatMessages(userId);
    }
  };

  const fetchChatMessages = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setChatMessages(data.map(m => ({ role: m.role as 'user' | 'ai', text: m.content })));
      }
    } catch (err) {
      console.error('Error fetching chat messages:', err);
    }
  };

  const handleSitePhotoUpload = async (source: React.ChangeEvent<HTMLInputElement> | Blob, isGallery = true) => {
    let file: File | Blob | undefined;

    if (source instanceof Blob) {
      file = source;
    } else {
      file = (source as React.ChangeEvent<HTMLInputElement>).target.files?.[0];
    }

    if (!file || !user) return;

    // Show a small loader if we had state for it, but for now we'll just rely on the async nature
    try {
      const fileExt = file instanceof File ? file.name.split('.').pop() : 'jpg';
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('wedding-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('wedding-images')
        .getPublicUrl(filePath);

      const updatedData = isGallery
        ? { ...siteData, album: [...siteData.album, publicUrl] }
        : { ...siteData, heroImage: publicUrl };

      setSiteData(updatedData);

      // Auto-save to ensure persistence after upload
      if (user) {
        await supabase
          .from('wedding_sites')
          .upsert({
            user_id: user.id,
            slug: updatedData.slug,
            theme: updatedData.theme,
            bride_name: updatedData.brideName,
            groom_name: updatedData.groomName,
            wedding_date: updatedData.date,
            wedding_time: updatedData.time,
            location_name: updatedData.locationName,
            location_address: updatedData.locationAddress,
            location_url: updatedData.locationUrl,
            headline: updatedData.headline,
            story: updatedData.story,
            hero_image: updatedData.heroImage,
            album: updatedData.album,
            rsvp_enabled: updatedData.rsvpEnabled
          }, { onConflict: 'user_id' });
      }

      alert('✅ Foto adicionada e salva com sucesso!');
    } catch (err: any) {
      console.error('Error uploading site image:', err);
      alert('Erro ao carregar imagem: ' + err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView(AppView.DASHBOARD);
    window.location.reload();
  };

  const handleSupplierOnboardingComplete = (data: Partial<Vendor>) => {
    const newVendor: Vendor = { ...data, id: 'v' + Date.now(), rating: 0, views: 0, leads: 0, status: 'pending', portfolio: [] } as Vendor;
    setMySupplierProfile(newVendor);
    setVendors(prev => [...prev, newVendor]);
    setCurrentView(AppView.SUPPLIER_DASHBOARD);
  };

  const handleTrackView = async (vendor: Vendor) => {
    if (!vendor.id || vendor.id.startsWith('v')) return;
    try {
      await supabase.rpc('increment_views', { vendor_id: vendor.id });
    } catch (err) {
      console.error('Error tracking view:', err);
    }
  };

  const handleTrackLead = async (vendor: Vendor) => {
    if (!vendor.id || vendor.id.startsWith('v')) return;
    try {
      await supabase.rpc('increment_leads', { vendor_id: vendor.id });
    } catch (err) {
      console.error('Error tracking lead:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !user) return;
    const msg = chatInput; setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);

    // Save user message
    await supabase.from('chat_messages').insert({
      user_id: user.id,
      role: 'user',
      content: msg
    });

    setIsThinking(true);
    const response = await getAIResponse(msg, { name: user?.name || 'Noiva', date: user?.weddingDate || 'TBD' });
    setIsThinking(false);
    setChatMessages(prev => [...prev, { role: 'ai', text: response }]);

    // Save AI response
    await supabase.from('chat_messages').insert({
      user_id: user.id,
      role: 'ai',
      content: response
    });
  };

  const addPhotoToAlbum = (url: string) => {
    if (!url) return;
    setSiteData(prev => ({ ...prev, album: [...prev.album, url] }));
    setActiveModal(null);
  };

  const addPhotoToPortfolio = (url: string) => {
    if (!url || !mySupplierProfile) return;
    setMySupplierProfile({ ...mySupplierProfile, portfolio: [...mySupplierProfile.portfolio, url] });
    setActiveModal(null);
  };

  const handleUpdateSupplierProfile = async (data: Partial<Vendor>) => {
    if (!user || !mySupplierProfile) return;
    setLoadingSite(true);
    try {
      const updateData = {
        business_name: data.name,
        description: data.description,
        category: data.category,
        city: data.location,
        state: data.state,
        phone: data.phone || data.whatsapp,
        instagram: data.instagram,
        website: data.website,
        experience_years: data.experience_years
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      setMySupplierProfile({ ...mySupplierProfile, ...data });
      setIsEditingProfile(false);
      alert('✅ Perfil atualizado com sucesso!');
    } catch (err: any) {
      console.error('Error updating supplier profile:', err);
      alert('Erro ao atualizar perfil: ' + err.message);
    } finally {
      setLoadingSite(false);
    }
  };

  const handleSupplierPortfolioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !mySupplierProfile) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `vendors/portfolio/${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('wedding-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('wedding-images')
        .getPublicUrl(fileName);

      const newPortfolio = [...mySupplierProfile.portfolio, publicUrl];

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ portfolio: newPortfolio })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setMySupplierProfile({ ...mySupplierProfile, portfolio: newPortfolio });
      alert('✅ Foto adicionada ao portfólio!');
    } catch (err: any) {
      console.error('Error uploading portfolio photo:', err);
      alert('Erro ao carregar foto: ' + err.message);
    }
  };

  const handleDeletePortfolioImage = async (index: number) => {
    if (!user || !mySupplierProfile) return;
    if (!confirm('Deseja realmente remover esta foto do seu portfólio?')) return;

    try {
      const newPortfolio = mySupplierProfile.portfolio.filter((_, i) => i !== index);

      const { error } = await supabase
        .from('profiles')
        .update({ portfolio: newPortfolio })
        .eq('id', user.id);

      if (error) throw error;

      setMySupplierProfile({ ...mySupplierProfile, portfolio: newPortfolio });
    } catch (err: any) {
      console.error('Error deleting portfolio photo:', err);
      alert('Erro ao remover foto: ' + err.message);
    }
  };




  const approveVendor = (id: string) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, status: 'approved' } : v));
  };

  const rejectVendor = (id: string) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, status: 'rejected' } : v));
  };

  const adminStats = useMemo(() => {
    const brides = allUsers.filter(u => u.role === 'noiva');
    const premiumBrides = brides.filter(u => u.plan === 'Premium');
    const activeVendors = vendors.filter(v => v.status === 'approved');
    const premiumVendors = activeVendors.filter(v => v.plan === 'Premium');
    const pendingVendors = vendors.filter(v => v.status === 'pending');

    const monthlyRevenue = (premiumBrides.length * PREMIUM_PRICE_NOIVA) + (premiumVendors.length * PREMIUM_PRICE_FORNECEDOR);

    return {
      totalBrides: brides.length,
      totalVendors: vendors.length,
      pendingVendors: pendingVendors.length,
      monthlyRevenue
    };
  }, [allUsers, vendors]);

  const themeStyles = {
    Classic: { bg: 'bg-white', text: 'text-zinc-900', accent: 'bg-zinc-900 text-white', font: 'font-serif' },
    Boho: { bg: 'bg-[#FAF3E0]', text: 'text-[#5D4037]', accent: 'bg-[#D4A373] text-white', font: 'font-serif' },
    Modern: { bg: 'bg-zinc-950', text: 'text-white', accent: 'bg-red-600 text-white', font: 'font-sans' }
  };

  const daysRemaining = useMemo(() => {
    if (!user?.weddingDate) return null;
    const today = new Date();
    const wedding = new Date(user.weddingDate);
    const diffTime = wedding.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [user?.weddingDate]);

  const isSubscriptionValid = useMemo(() => {
    if (!user || user.role === 'admin') return true;
    if (user.subscriptionStatus === 'active') return true;
    if (user.subscriptionStatus === 'trialing' && user.trialEndsAt) {
      return new Date(user.trialEndsAt) > new Date();
    }
    return false;
  }, [user]);

  const handleSubscribe = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_status: 'active' })
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, subscriptionStatus: 'active', plan: 'Premium' });
      setShowCheckout(false);
      alert('✅ Assinatura vitalícia ativada com sucesso!');
    } catch (err: any) {
      alert('Erro ao ativar assinatura: ' + err.message);
    }
  };

  const handleResetTrial = async () => {
    if (!user) return;
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'trialing',
          trial_ends_at: trialEndsAt.toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      await fetchUserProfile(user.id);
      alert('Modo Teste: Período de degustação reiniciado por 7 dias!');
    } catch (err: any) {
      alert('Erro ao reiniciar trial: ' + err.message);
    }
  };

  if (currentView === AppView.SITE_PUBLIC) {
    const theme = themeStyles[siteData.theme];
    return (
      <div className={`min-h-screen ${theme.bg} ${theme.text} ${theme.font} animate-in fade-in duration-1000 overflow-x-hidden pb-20`}>
        {isLoggedIn && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200]">
            <button
              onClick={() => {
                window.history.pushState({}, '', '/');
                setCurrentView(AppView.SITE_BUILDER);
              }}
              className="bg-black/50 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center gap-2 border border-white/10 shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              <ArrowLeft size={18} /> Voltar ao Editor
            </button>
          </div>
        )}

        <div className="relative h-screen flex flex-col items-center justify-center text-center p-8">
          <img src={siteData.heroImage} className="absolute inset-0 w-full h-full object-cover opacity-40" />
          <div className="relative z-10 space-y-8 animate-in slide-in-from-bottom-8 duration-1000">
            <Heart className="mx-auto opacity-80" size={48} fill="currentColor" stroke="none" />
            <h1 className="text-7xl md:text-9xl font-serif">{siteData.brideName} & {siteData.groomName}</h1>
            <p className="text-xl md:text-2xl uppercase tracking-[0.3em] font-light">{siteData.headline}</p>
            <div className="space-y-2">
              <p className="text-lg md:text-xl font-bold">{new Date(siteData.date).toLocaleDateString('pt-BR')} às {siteData.time}</p>
              <p className="opacity-70">{siteData.locationName}</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={() => setActiveModal('rsvp' as any)}
                className={`px-10 py-5 rounded-full font-black uppercase text-sm tracking-widest shadow-2xl transition-all hover:scale-105 ${theme.accent}`}
              >
                Confirmar Presença
              </button>
              {siteData.locationUrl && (
                <a
                  href={siteData.locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-5 bg-white/10 backdrop-blur-md rounded-full font-black uppercase text-sm tracking-widest border border-white/10 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <MapPin size={18} /> Ver Mapa
                </a>
              )}
            </div>
          </div>
        </div>

        <section className="max-w-4xl mx-auto py-32 px-8 text-center space-y-20">
          <div className="space-y-12">
            <h2 className="text-5xl font-serif">Nossa História</h2>
            <div className="w-12 h-1 bg-red-600 mx-auto rounded-full"></div>
            <p className="text-xl leading-relaxed opacity-80 whitespace-pre-wrap">{siteData.story}</p>
          </div>

          {siteData.album.length > 0 && (
            <div className="space-y-16 pt-20">
              <h2 className="text-5xl font-serif">Galeria</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {siteData.album.map((pic, i) => (
                  <div key={i} className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl group border border-white/5">
                    <img src={pic} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-32 space-y-8">
            <h2 className="text-4xl font-serif italic">Esperamos por você!</h2>
            <button
              onClick={() => setActiveModal('rsvp' as any)}
              className={`px-12 py-6 rounded-full font-black uppercase text-base tracking-[0.2em] shadow-2xl hover:scale-110 transition-all ${theme.accent}`}
            >
              Confirmar Agora
            </button>
          </div>
        </section>

        <Modal isOpen={activeModal === ('rsvp' as any)} onClose={() => setActiveModal(null)} title="Confirmar Presença">
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            submitRSVP(siteData.slug, {
              name: formData.get('name'),
              phone: formData.get('phone'),
              confirmed: true
            });
          }} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-600 ml-1">Seu Nome Completo</label>
              <input name="name" required className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 text-sm" placeholder="Ex: Maria Souza" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-600 ml-1">Seu WhatsApp</label>
              <input name="phone" required className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 text-sm" placeholder="(11) 99999-9999" />
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
              <p className="text-emerald-500 font-bold mb-1">Deseja confirmar sua presença?</p>
              <p className="text-[10px] text-emerald-500/60 uppercase tracking-widest">Aguardamos você neste dia especial!</p>
            </div>
            <button type="submit" className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase shadow-xl hover:bg-zinc-200 transition-all">Confirmar Agora</button>
          </form>
        </Modal>
      </div>
    );
  }

  if (isLoadingInitial) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="space-y-6 text-center">
          <div className="w-20 h-20 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin mx-auto"></div>
          <div className="space-y-2">
            <h2 className="text-3xl font-serif text-white animate-pulse">NOIVAFLIX</h2>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em]">Carregando Sonhos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn && currentView !== AppView.SITE_PUBLIC) {
    return <AuthScreen onAuthSuccess={(userId) => {
      fetchUserProfile(userId);
    }} />;
  }

  // Show onboarding if user hasn't completed it
  if (user && user.onboardingCompleted === false) {
    if (user.role === 'noiva') {
      return <BrideOnboarding userId={user.id} onComplete={() => {
        fetchUserProfile(user.id);
      }} />;
    } else if (user.role === 'fornecedor') {
      return <VendorOnboarding userId={user.id} onComplete={() => {
        fetchUserProfile(user.id);
      }} />;
    }
  }




  if (currentView === AppView.ONBOARDING) return <OnboardingWizard userName={user?.name || ''} onComplete={(d) => { setUser({ ...user!, ...d, onboardingCompleted: true }); setCurrentView(AppView.DASHBOARD); }} />;
  if (currentView === AppView.SUPPLIER_ONBOARDING) return <SupplierOnboardingWizard responsibleName={user?.name || ''} initialEmail={user?.email || ''} onComplete={handleSupplierOnboardingComplete} />;

  if (isLoggedIn && (!isSubscriptionValid || showCheckout) && user) {
    return <SubscriptionPage user={user} onSubscribe={handleSubscribe} onBack={() => setShowCheckout(false)} showBack={showCheckout} />;
  }

  return (
    <div className="flex h-screen bg-[#080808] text-white selection:bg-red-500 overflow-hidden font-sans">
      <aside className="hidden lg:flex w-72 bg-black border-r border-white/5 p-8 flex-col gap-10">
        <div className="cursor-pointer" onClick={() => setCurrentView(user?.role === 'fornecedor' ? AppView.SUPPLIER_DASHBOARD : AppView.DASHBOARD)}><Logo className="w-full" /></div>
        <nav className="flex-1 space-y-1">
          {user?.role === 'noiva' && (
            <>
              <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={currentView === AppView.DASHBOARD} onClick={() => setCurrentView(AppView.DASHBOARD)} />
              <NavItem icon={<VideoIcon size={20} />} label="Noivaflix TV" active={currentView === AppView.STREAMING} onClick={() => setCurrentView(AppView.STREAMING)} />
              <NavItem icon={<ListTodo size={20} />} label="Checklist" active={currentView === AppView.CHECKLIST} onClick={() => setCurrentView(AppView.CHECKLIST)} />
              <NavItem icon={<Users size={20} />} label="Convidados" active={currentView === AppView.GUESTS} onClick={() => setCurrentView(AppView.GUESTS)} />
              <NavItem icon={<Wallet size={20} />} label="Orçamento" active={currentView === AppView.BUDGET} onClick={() => setCurrentView(AppView.BUDGET)} />
              <NavItem icon={<Store size={20} />} label="Fornecedores" active={currentView === AppView.VENDORS} onClick={() => setCurrentView(AppView.VENDORS)} />
              <NavItem icon={<Globe size={20} />} label="Meu Site" active={currentView === AppView.SITE_BUILDER} onClick={() => setCurrentView(AppView.SITE_BUILDER)} />
            </>
          )}
          {user?.role === 'fornecedor' && (<NavItem icon={<LayoutDashboard size={20} />} label="Meu Painel" active={currentView === AppView.SUPPLIER_DASHBOARD} onClick={() => setCurrentView(AppView.SUPPLIER_DASHBOARD)} />)}
          {user?.role === 'admin' && (<NavItem icon={<Database size={20} />} label="Admin" active={currentView === AppView.ADMIN_PANEL} onClick={() => setCurrentView(AppView.ADMIN_PANEL)} />)}
        </nav>

        {user?.role === 'noiva' && user?.subscriptionStatus !== 'active' && (
          <button
            onClick={() => setShowCheckout(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-600/20 transition-all flex items-center justify-center gap-2 group mb-2"
          >
            <Zap size={14} className="fill-current group-hover:scale-125 transition-transform" />
            Assinar Agora
          </button>
        )}
        <div className="p-4 bg-zinc-900/50 rounded-2xl border border-white/5 flex items-center gap-3">
          <img src={user?.avatar} className="w-10 h-10 rounded-xl" />
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold truncate">{user?.name}</p>
            <p className="text-[10px] text-zinc-500 truncate uppercase font-black tracking-widest">{user?.plan}</p>
          </div>
          {user?.subscriptionStatus === 'active' && (
            <button
              onClick={handleResetTrial}
              className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
              title="Reiniciar Trial (Modo Teste)"
            >
              <History size={16} />
            </button>
          )}
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 text-zinc-500 hover:text-red-500 transition-colors p-4"><LogOut size={20} /><span>Sair</span></button>
      </aside>

      <main className="flex-1 overflow-y-auto no-scrollbar relative p-6 lg:p-12 xl:p-20 pb-32">
        {currentView === AppView.DASHBOARD && (
          <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
            <header className="space-y-4">
              <h1 className="text-6xl font-serif text-white">Olá, {(user?.name?.trim() ? user.name.split(' ')[0] : 'Noiva')}.</h1>
              <p className="text-zinc-500 text-xl italic max-w-2xl">"O planejamento de um casamento é uma maratona. Respira."</p>
            </header>

            {user?.role === 'noiva' && user?.subscriptionStatus !== 'active' && (
              <div className="relative group overflow-hidden bg-zinc-900/40 border border-white/5 p-10 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="flex items-center gap-8 text-center md:text-left relative z-10">
                  <div className="p-6 bg-red-600 text-white rounded-3xl shadow-2xl shadow-red-600/20 animate-pulse">
                    <Zap size={32} fill="currentColor" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                      <h4 className="font-black text-white uppercase text-xs tracking-[0.3em]">
                        {user?.subscriptionStatus === 'trialing' ? 'Período de Degustação Ativo' : 'Plano Básico'}
                      </h4>
                      {user?.subscriptionStatus === 'trialing' && (
                        <span className="bg-red-600/20 text-red-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-red-600/20">
                          {Math.max(0, Math.ceil((new Date(user.trialEndsAt || '').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} dias restantes
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-400 max-w-md text-lg leading-relaxed">
                      {user?.subscriptionStatus === 'trialing'
                        ? 'Aproveite todas as ferramentas premium para planejar o seu grande dia sem limites.'
                        : 'Liberte todo o potencial do Noivaflix e garanta que cada detalhe do seu casamento seja perfeito.'}
                    </p>
                  </div>
                </div>

                <div className="relative z-10">
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="group/btn relative px-12 py-6 bg-white text-black rounded-3xl font-black text-sm tracking-[0.2em] hover:scale-105 active:scale-95 transition-all uppercase shadow-2xl flex items-center gap-4 overflow-hidden"
                  >
                    <span className="relative z-10">Garantir Acesso Vitalício</span>
                    <ArrowRight size={20} className="relative z-10 group-hover/btn:translate-x-2 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-100 to-white opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-zinc-900/40 p-10 rounded-[40px] border border-white/5 backdrop-blur-md">
                <div className="p-4 bg-red-600/10 text-red-500 w-fit rounded-2xl mb-6"><Calendar size={28} /></div>
                <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Data do Grande Dia</p>
                <h3 className="text-4xl font-black mt-2 text-white">
                  {user?.weddingDate ? new Date(user.weddingDate).toLocaleDateString('pt-BR') : 'TBD'}
                </h3>
              </div>

              <div className="bg-zinc-900/40 p-10 rounded-[40px] border border-white/5 backdrop-blur-md relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="p-4 bg-red-600/10 text-red-500 w-fit rounded-2xl mb-6 relative z-10">
                  <Heart size={28} className={daysRemaining !== null ? "animate-pulse" : ""} />
                </div>
                <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest relative z-10">Contagem Regressiva</p>
                <h3 className="text-4xl font-black mt-2 text-white relative z-10">
                  {daysRemaining !== null ? (
                    <>
                      {daysRemaining} <span className="text-xs text-zinc-500 uppercase tracking-widest">dias</span>
                    </>
                  ) : 'Definir'}
                </h3>
              </div>

              <div className="bg-zinc-900/40 p-10 rounded-[40px] border border-white/5 backdrop-blur-md">
                <div className="p-4 bg-blue-600/10 text-blue-500 w-fit rounded-2xl mb-6"><Compass size={28} /></div>
                <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Fase Atual</p>
                <h3 className="text-xl font-black mt-2 text-white capitalize">
                  {user?.phase?.replace(/_/g, ' ') || 'Planejando'}
                </h3>
              </div>

              <div className="bg-zinc-900/40 p-10 rounded-[40px] border border-white/5 backdrop-blur-md">
                <div className="p-4 bg-emerald-600/10 text-emerald-500 w-fit rounded-2xl mb-6"><Users size={28} /></div>
                <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Seus Convidados</p>
                <h3 className="text-4xl font-black mt-2 text-white">{user?.guestCount || 0}</h3>
              </div>
            </div>
          </div>
        )}

        {currentView === AppView.ADMIN_PANEL && (
          <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-2">
                <h2 className="text-5xl font-serif">Central Admin</h2>
                <p className="text-zinc-500">Gestão global do ecossistema Noivaflix.</p>
              </div>
              <div className="flex bg-zinc-950 p-2 rounded-2xl border border-white/5 gap-2 overflow-x-auto no-scrollbar">
                <button onClick={() => setAdminTab('overview')} className={`px-6 py-3 rounded-xl font-bold text-xs uppercase transition-all ${adminTab === 'overview' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-500'}`}>Visão Geral</button>
                <button onClick={() => setAdminTab('brides')} className={`px-6 py-3 rounded-xl font-bold text-xs uppercase transition-all ${adminTab === 'brides' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-500'}`}>Noivas</button>
                <button onClick={() => setAdminTab('vendors')} className={`px-6 py-3 rounded-xl font-bold text-xs uppercase transition-all ${adminTab === 'vendors' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-500'}`}>Fornecedores {adminStats.pendingVendors > 0 && <span className="ml-1 bg-red-600 text-white px-2 py-0.5 rounded-full text-[10px]">{adminStats.pendingVendors}</span>}</button>
                <button onClick={() => setAdminTab('finances')} className={`px-6 py-3 rounded-xl font-bold text-xs uppercase transition-all ${adminTab === 'finances' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-500'}`}>Financeiro</button>
              </div>
            </header>

            {adminTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-zinc-900/50 p-8 rounded-[32px] border border-white/5 space-y-4">
                    <div className="p-3 bg-red-600/10 text-red-500 w-fit rounded-xl"><Users size={20} /></div>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Total Noivas</p>
                    <h3 className="text-3xl font-black">{adminStats.totalBrides}</h3>
                  </div>
                  <div className="bg-zinc-900/50 p-8 rounded-[32px] border border-white/5 space-y-4">
                    <div className="p-3 bg-emerald-600/10 text-emerald-500 w-fit rounded-xl"><Building2 size={20} /></div>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Total Fornecedores</p>
                    <h3 className="text-3xl font-black">{adminStats.totalVendors}</h3>
                  </div>
                  <div className="bg-zinc-900/50 p-8 rounded-[32px] border border-white/5 space-y-4">
                    <div className="p-3 bg-amber-600/10 text-amber-500 w-fit rounded-xl"><Clock size={20} /></div>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Pendentes Aprovação</p>
                    <h3 className="text-3xl font-black">{adminStats.pendingVendors}</h3>
                  </div>
                  <div className="bg-zinc-900/50 p-8 rounded-[32px] border border-white/5 space-y-4">
                    <div className="p-3 bg-blue-600/10 text-blue-500 w-fit rounded-xl"><TrendingUp size={20} /></div>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Receita Mensal (Estimada)</p>
                    <h3 className="text-3xl font-black">R$ {adminStats.monthlyRevenue.toLocaleString()}</h3>
                  </div>
                </div>

                <div className="bg-zinc-950 p-10 rounded-[40px] border border-white/5">
                  <h3 className="text-xl font-bold mb-8">Atividades Recentes</h3>
                  <div className="space-y-6">
                    {vendors.filter(v => v.status === 'pending').map(v => (
                      <div key={v.id} className="flex justify-between items-center p-6 bg-zinc-900/40 rounded-3xl border border-white/5">
                        <div className="flex items-center gap-6">
                          <img src={v.image} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <h4 className="font-bold">{v.name}</h4>
                            <p className="text-zinc-500 text-xs uppercase tracking-widest">Solicitação de cadastro • {v.category}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => rejectVendor(v.id)} className="p-3 bg-red-600/10 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all"><X size={18} /></button>
                          <button onClick={() => approveVendor(v.id)} className="p-3 bg-emerald-600/10 text-emerald-500 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><Check size={18} /></button>
                        </div>
                      </div>
                    ))}
                    {adminStats.pendingVendors === 0 && <p className="text-center py-10 text-zinc-600 italic">Nenhuma atividade pendente no momento.</p>}
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'brides' && (
              <div className="bg-zinc-950 p-10 rounded-[40px] border border-white/5 overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left">
                    <thead className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      <tr>
                        <th className="pb-6 pl-4">Noiva</th>
                        <th className="pb-6">E-mail</th>
                        <th className="pb-6">Data Casamento</th>
                        <th className="pb-6">Plano</th>
                        <th className="pb-6">Status</th>
                        <th className="pb-6 text-right pr-4">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {allUsers.filter(u => u.role === 'noiva').map(bride => (
                        <tr key={bride.id} className="group hover:bg-white/[0.02] transition-all">
                          <td className="py-6 pl-4">
                            <div className="flex items-center gap-4">
                              <img src={bride.avatar} className="w-10 h-10 rounded-full" />
                              <span className="font-bold">{bride.name}</span>
                            </div>
                          </td>
                          <td className="py-6 text-sm text-zinc-400">{bride.email}</td>
                          <td className="py-6 text-sm text-zinc-400">{bride.weddingDate || 'Não informada'}</td>
                          <td className="py-6">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${bride.plan === 'Premium' ? 'bg-red-600/20 text-red-500' : 'bg-zinc-800 text-zinc-400'}`}>
                              {bride.plan}
                            </span>
                          </td>
                          <td className="py-6">
                            <span className="flex items-center gap-2 text-xs text-emerald-500 font-bold"><CheckCircle size={14} /> Ativo</span>
                          </td>
                          <td className="py-6 text-right pr-4">
                            <button className="p-2 text-zinc-600 hover:text-white transition-colors"><Search size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {adminTab === 'vendors' && (
              <div className="bg-zinc-950 p-10 rounded-[40px] border border-white/5 overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left">
                    <thead className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      <tr>
                        <th className="pb-6 pl-4">Fornecedor</th>
                        <th className="pb-6">Categoria</th>
                        <th className="pb-6">Cidade</th>
                        <th className="pb-6">Plano</th>
                        <th className="pb-6">Status</th>
                        <th className="pb-6 text-right pr-4">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {vendors.map(v => (
                        <tr key={v.id} className="group hover:bg-white/[0.02] transition-all">
                          <td className="py-6 pl-4">
                            <div className="flex items-center gap-4">
                              <img src={v.image} className="w-10 h-10 rounded-xl object-cover" />
                              <div className="flex flex-col">
                                <span className="font-bold">{v.name}</span>
                                <span className="text-[10px] text-zinc-500 truncate max-w-[150px]">{v.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 text-sm text-zinc-400">{v.category}</td>
                          <td className="py-6 text-sm text-zinc-400">{v.location}, {v.state}</td>
                          <td className="py-6">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${v.plan === 'Premium' ? 'bg-emerald-600/20 text-emerald-500' : 'bg-zinc-800 text-zinc-400'}`}>
                              {v.plan}
                            </span>
                          </td>
                          <td className="py-6">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${v.status === 'approved' ? 'bg-emerald-600/10 text-emerald-500' :
                              v.status === 'pending' ? 'bg-amber-600/10 text-amber-500' :
                                'bg-red-600/10 text-red-500'
                              }`}>
                              {v.status === 'approved' ? 'Aprovado' : v.status === 'pending' ? 'Pendente' : 'Rejeitado'}
                            </span>
                          </td>
                          <td className="py-6 text-right pr-4">
                            <div className="flex justify-end gap-2">
                              {v.status === 'pending' && (
                                <>
                                  <button onClick={() => approveVendor(v.id)} className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"><UserCheck size={18} /></button>
                                  <button onClick={() => rejectVendor(v.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><UserX size={18} /></button>
                                </>
                              )}
                              <button className="p-2 text-zinc-600 hover:text-white transition-colors"><Search size={18} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {adminTab === 'finances' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-zinc-950 p-10 rounded-[40px] border border-white/5 space-y-6">
                    <h4 className="text-xl font-bold flex items-center gap-3"><PieChart className="text-red-500" /> Origem da Receita</h4>
                    <div className="h-64 flex items-center justify-center border-b border-white/5">
                      <div className="relative w-48 h-48 rounded-full border-[20px] border-zinc-900 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-[20px] border-red-600 border-l-transparent border-b-transparent rotate-45"></div>
                        <div className="text-center">
                          <p className="text-[10px] font-black uppercase text-zinc-500">Faturamento</p>
                          <p className="text-2xl font-black">100%</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4 pt-4">
                      <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-sm text-zinc-400"><div className="w-3 h-3 bg-red-600 rounded-full"></div> Noivas Premium</span><span className="font-bold">R$ {(allUsers.filter(u => u.role === 'noiva' && u.plan === 'Premium').length * PREMIUM_PRICE_NOIVA).toLocaleString()}</span></div>
                      <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-sm text-zinc-400"><div className="w-3 h-3 bg-emerald-600 rounded-full"></div> Fornecedores Premium</span><span className="font-bold">R$ {(vendors.filter(v => v.plan === 'Premium' && v.status === 'approved').length * PREMIUM_PRICE_FORNECEDOR).toLocaleString()}</span></div>
                    </div>
                  </div>

                  <div className="bg-zinc-950 p-10 rounded-[40px] border border-white/5 space-y-8">
                    <h4 className="text-xl font-bold">Últimas Transações</h4>
                    <div className="space-y-4">
                      {[
                        { name: 'Ana Oliveira', val: PREMIUM_PRICE_NOIVA, date: 'Hoje', plan: 'Noiva Premium' },
                        { name: 'Foco Criativo', val: PREMIUM_PRICE_FORNECEDOR, date: 'Ontem', plan: 'Fornecedor Premium' },
                        { name: 'Juliana Silva', val: PREMIUM_PRICE_NOIVA, date: 'Há 2 dias', plan: 'Noiva Premium' },
                        { name: 'Banda Show', val: PREMIUM_PRICE_FORNECEDOR, date: 'Há 3 dias', plan: 'Fornecedor Premium' }
                      ].map((t, i) => (
                        <div key={i} className="flex justify-between items-center p-5 bg-zinc-900/50 rounded-2xl border border-white/5">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 text-emerald-500 rounded-xl"><ArrowUpRight size={16} /></div>
                            <div><p className="font-bold text-sm">{t.name}</p><p className="text-[10px] text-zinc-500 uppercase tracking-widest">{t.plan}</p></div>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-emerald-500">+ R$ {t.val.toLocaleString()}</p>
                            <p className="text-[10px] text-zinc-600 uppercase font-black">{t.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === AppView.BUDGET && user && (
          <ExpensesScreen userId={user.id} />
        )}

        {currentView === AppView.CHECKLIST && user && (
          <ChecklistScreen userId={user.id} />
        )}

        {currentView === AppView.GUESTS && user && (
          <GuestsScreen userId={user.id} />
        )}

        {currentView === AppView.SITE_BUILDER && (
          <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div><h2 className="text-5xl font-serif">Meu Site</h2><p className="text-zinc-500">O portal dos seus convidados.</p></div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    window.history.pushState({}, '', `/meusite/${siteData.slug}`);
                    setCurrentView(AppView.SITE_PUBLIC);
                  }}
                  className="bg-zinc-900 border border-white/10 px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-xl"
                >
                  Visualizar
                </button>
                <button
                  onClick={saveWeddingSite}
                  disabled={loadingSite}
                  className="bg-red-600 px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-xl disabled:opacity-50"
                >
                  {loadingSite ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </header>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
              <div className="xl:col-span-7 space-y-8">
                <div className="flex bg-zinc-950 p-2 rounded-2xl border border-white/5 gap-2 overflow-x-auto no-scrollbar">
                  <button onClick={() => setSiteEditorTab('content')} className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-xs uppercase transition-all ${siteEditorTab === 'content' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-500 hover:text-white'}`}>Conteúdo</button>
                  <button onClick={() => setSiteEditorTab('appearance')} className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-xs uppercase transition-all ${siteEditorTab === 'appearance' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-500 hover:text-white'}`}>Design</button>
                  <button onClick={() => setSiteEditorTab('gallery')} className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-xs uppercase transition-all ${siteEditorTab === 'gallery' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-500 hover:text-white'}`}>Galeria</button>
                  <button onClick={() => setSiteEditorTab('rsvp' as any)} className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-xs uppercase transition-all ${siteEditorTab === ('rsvp' as any) ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-500 hover:text-white'}`}>RSVPs</button>
                </div>
                <div className="bg-zinc-950 p-10 rounded-[40px] border border-white/5 space-y-10 min-h-[500px]">
                  {siteEditorTab === 'content' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2"><label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Noiva</label><input value={siteData.brideName} onChange={e => setSiteData({ ...siteData, brideName: e.target.value })} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-red-600 text-white" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Noivo</label><input value={siteData.groomName} onChange={e => setSiteData({ ...siteData, groomName: e.target.value })} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-red-600 text-white" /></div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1 flex justify-between items-center">
                          <span>Link do Site ({window.location.host}/meusite/)</span>
                          {!isSlugSaved && <span className="text-amber-500 lowercase font-normal italic">* Salve para atualizar o link</span>}
                        </label>
                        <div className="flex gap-2">
                          <input
                            value={siteData.slug}
                            onChange={e => {
                              setSiteData({ ...siteData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') });
                              setIsSlugSaved(false);
                            }}
                            className={`flex-1 bg-zinc-900 border ${!isSlugSaved ? 'border-amber-600/50' : 'border-white/5'} rounded-2xl p-5 text-sm outline-none focus:border-red-600 text-white`}
                          />
                          <button
                            onClick={() => {
                              const url = `${window.location.origin}/meusite/${siteData.slug}`;
                              navigator.clipboard.writeText(url);
                              alert(`✅ Link copiado!\n${url}`);
                            }}
                            className="bg-zinc-800 hover:bg-zinc-700 px-6 rounded-2xl text-white transition-all flex items-center gap-2 text-xs font-bold"
                          >
                            <Copy size={16} /> Copiar
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Data do Casamento</label>
                          <input type="date" value={siteData.date} onChange={e => setSiteData({ ...siteData, date: e.target.value })} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-red-600 text-white" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Horário</label>
                          <input type="time" value={siteData.time} onChange={e => setSiteData({ ...siteData, time: e.target.value })} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-red-600 text-white" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Local do Casamento (Nome do Espaço)</label>
                        <input value={siteData.locationName} onChange={e => setSiteData({ ...siteData, locationName: e.target.value })} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-red-600 text-white" placeholder="Ex: Espaço Villa Lobos" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Endereço Completo</label>
                        <input value={siteData.locationAddress} onChange={e => setSiteData({ ...siteData, locationAddress: e.target.value })} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-red-600 text-white" placeholder="Ex: Rua das Flores, 123 - São Paulo" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Link do Google Maps</label>
                        <input value={siteData.locationUrl} onChange={e => setSiteData({ ...siteData, locationUrl: e.target.value })} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-red-600 text-white" placeholder="https://maps.google.com/..." />
                      </div>

                      <div className="space-y-2"><label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Nossa História</label><textarea value={siteData.story} onChange={e => setSiteData({ ...siteData, story: e.target.value })} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 text-sm h-32 outline-none resize-none text-white" /></div>
                    </div>
                  )}
                  {siteEditorTab === 'appearance' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                      <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Selecione o Tema</label>
                      <div className="grid grid-cols-3 gap-4">
                        {(['Classic', 'Boho', 'Modern'] as const).map(t => (
                          <button key={t} onClick={() => setSiteData({ ...siteData, theme: t })} className={`p-6 rounded-2xl border transition-all ${siteData.theme === t ? 'bg-red-600 border-red-600 text-white' : 'bg-zinc-900 border-white/5 text-zinc-400'}`}>{t}</button>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-600 mt-6 block tracking-widest ml-1">Foto de Capa</label>
                        <div className="flex gap-4">
                          <input value={siteData.heroImage} onChange={e => setSiteData({ ...siteData, heroImage: e.target.value })} placeholder="URL da Foto" className="flex-1 bg-zinc-900 border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-red-600 text-white" />
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    setTempCropImage(reader.result as string);
                                    setActiveModal('cover_crop' as any);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="hidden"
                            />
                            <div className="bg-zinc-800 hover:bg-zinc-700 px-6 h-full flex items-center rounded-2xl text-white transition-all"><Upload size={20} /></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                  {siteEditorTab === 'gallery' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                      <div className="flex justify-between items-center"><h3 className="font-bold">Fotos ({siteData.album.length})</h3><button onClick={() => setActiveModal('gallery_add')} className="p-3 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-all border border-white/10"><Plus size={16} /></button></div>
                      <div className="grid grid-cols-3 gap-4">
                        {siteData.album.map((pic, i) => (<div key={i} className="aspect-square bg-zinc-900 rounded-xl overflow-hidden border border-white/5 shadow-lg group relative"><img src={pic} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /><button onClick={() => setSiteData({ ...siteData, album: siteData.album.filter((_, idx) => idx !== i) })} className="absolute top-2 right-2 p-2 bg-black/60 backdrop-blur-md rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={12} /></button></div>))}
                      </div>
                    </div>
                  )}
                  {(siteEditorTab as any) === 'rsvp' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold">Respostas de RSVP ({rsvpResponses.length})</h3>
                      </div>
                      <div className="bg-zinc-900/50 rounded-3xl border border-white/5 overflow-hidden">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Convidado</th>
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Data</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {rsvpResponses.length === 0 ? (
                              <tr><td colSpan={3} className="p-8 text-center text-zinc-500 italic">Nenhuma resposta ainda.</td></tr>
                            ) : (
                              rsvpResponses.map((r, i) => (
                                <tr key={i} className="hover:bg-white/[0.02]">
                                  <td className="p-4">
                                    <div className="flex flex-col">
                                      <span className="font-bold">{r.guest_name}</span>
                                      <span className="text-[10px] text-zinc-500">{r.phone || r.email}</span>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${r.confirmed ? 'bg-emerald-600/20 text-emerald-500' : 'bg-red-600/20 text-red-500'}`}>
                                      {r.confirmed ? 'Confirmado' : 'Não vai'}
                                    </span>
                                  </td>
                                  <td className="p-4 text-[10px] text-zinc-500">
                                    {new Date(r.created_at).toLocaleDateString('pt-BR')}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="xl:col-span-5 hidden xl:block animate-in slide-in-from-right-12 duration-700">
                <div className="sticky top-20 flex flex-col items-center">
                  <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-6">Preview em tempo real</p>
                  <div className="w-[320px] h-[650px] bg-zinc-900 rounded-[50px] border-[10px] border-zinc-800 shadow-2xl overflow-hidden relative">
                    <div className={`w-full h-full overflow-y-auto no-scrollbar ${themeStyles[siteData.theme].bg} ${themeStyles[siteData.theme].text} ${themeStyles[siteData.theme].font} p-6 text-center space-y-6`}>
                      <img src={siteData.heroImage} className="h-40 w-full object-cover rounded-2xl mb-4" />
                      <h4 className="text-2xl font-serif">{siteData.brideName} & {siteData.groomName}</h4>
                      <p className="text-[10px] opacity-60 uppercase">{siteData.date} • {siteData.time}</p>
                      <div className="h-px bg-zinc-200 w-12 mx-auto"></div>
                      <p className="text-[10px] font-bold">{siteData.locationName}</p>
                      {siteData.locationUrl && (
                        <a href={siteData.locationUrl} target="_blank" rel="noopener noreferrer" className="text-[9px] uppercase font-black text-red-600 flex items-center justify-center gap-1 hover:underline">
                          <MapPin size={10} /> Ver Mapa
                        </a>
                      )}
                      <p className="text-[9px] line-clamp-3 leading-relaxed opacity-80">{siteData.story}</p>
                      <button
                        onClick={() => setActiveModal('rsvp' as any)}
                        className={`w-full py-3 rounded-full text-[10px] font-black uppercase shadow-xl transition-all ${themeStyles[siteData.theme].accent}`}
                      >
                        Confirmar Presença
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === AppView.SUPPLIER_DASHBOARD && mySupplierProfile && (
          <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div><h2 className="text-5xl font-serif">Olá, {mySupplierProfile.responsibleName}.</h2><p className="text-zinc-500 text-lg">Gerenciando <span className="text-emerald-500 font-bold">{mySupplierProfile.name}</span></p></div>
              <div className="flex bg-zinc-950 p-2 rounded-2xl border border-white/5 gap-2 overflow-x-auto no-scrollbar">
                <button onClick={() => setSupplierTab('stats')} className={`px-6 py-4 rounded-xl font-bold text-xs uppercase transition-all ${supplierTab === 'stats' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-500'}`}>Stats</button>
                <button onClick={() => setSupplierTab('profile')} className={`px-6 py-4 rounded-xl font-bold text-xs uppercase transition-all ${supplierTab === 'profile' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-500'}`}>Perfil</button>
                <button onClick={() => setSupplierTab('portfolio')} className={`px-6 py-4 rounded-xl font-bold text-xs uppercase transition-all ${supplierTab === 'portfolio' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-500'}`}>Portfolio</button>
              </div>
            </header>
            {supplierTab === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-500">
                {[{ label: 'Visualizações', value: mySupplierProfile.views, icon: <Eye />, color: 'text-blue-500' }, { label: 'WhatsApp Leads', value: mySupplierProfile.leads, icon: <MessageCircle />, color: 'text-emerald-500' }, { label: 'Selo Ativo', value: 'Verificado', icon: <BadgeCheck />, color: 'text-red-500' }].map((k, i) => (
                  <div key={i} className="bg-zinc-900/50 p-10 rounded-[40px] border border-white/5 space-y-4">
                    <div className={`p-4 bg-white/5 w-fit rounded-2xl ${k.color}`}>{k.icon}</div>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{k.label}</p><h3 className="text-5xl font-black">{k.value}</h3>
                  </div>
                ))}
              </div>
            )}
            {supplierTab === 'profile' && (
              <div className="bg-zinc-900/50 p-12 rounded-[40px] border border-white/5 animate-in fade-in duration-500">
                <div className="flex justify-between items-start mb-12">
                  <div className="flex gap-8 items-center">
                    <img src={mySupplierProfile.image} className="w-32 h-32 rounded-3xl object-cover border-2 border-white/10" />
                    <div>
                      <h3 className="text-3xl font-serif">{mySupplierProfile.name}</h3>
                      <p className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">{mySupplierProfile.category}</p>
                    </div>
                  </div>
                  {!isEditingProfile && (
                    <button
                      onClick={() => {
                        setEditProfileForm(mySupplierProfile);
                        setIsEditingProfile(true);
                      }}
                      className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all"
                    >
                      Editar Perfil
                    </button>
                  )}
                </div>

                {!isEditingProfile ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Sobre o Negócio</label>
                        <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">{mySupplierProfile.description || 'Nenhuma descrição adicionada.'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Experiência</label>
                          <p className="text-lg font-bold">{mySupplierProfile.experience_years} anos</p>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Localização</label>
                          <p className="text-lg font-bold">{mySupplierProfile.location}, {mySupplierProfile.state}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Contato e Social</label>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-zinc-400">
                            <MessageCircle size={18} className="text-emerald-500" />
                            <span>{mySupplierProfile.whatsapp || mySupplierProfile.phone}</span>
                          </div>
                          {mySupplierProfile.instagram && (
                            <div className="flex items-center gap-3 text-zinc-400">
                              <span className="text-emerald-500 font-bold">@</span>
                              <span>{mySupplierProfile.instagram}</span>
                            </div>
                          )}
                          {mySupplierProfile.website && (
                            <div className="flex items-center gap-3 text-zinc-400">
                              <Globe size={18} className="text-emerald-500" />
                              <span>{mySupplierProfile.website}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Nome da Empresa</label>
                        <input
                          value={editProfileForm.name}
                          onChange={e => setEditProfileForm({ ...editProfileForm, name: e.target.value })}
                          className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-5 outline-none focus:border-emerald-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Categoria</label>
                        <select
                          value={editProfileForm.category}
                          onChange={e => setEditProfileForm({ ...editProfileForm, category: e.target.value })}
                          className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-5 outline-none focus:border-emerald-600"
                        >
                          <option value="Acessórios">Acessórios</option>
                          <option value="Aluguel de Carros">Aluguel de Carros</option>
                          <option value="Bartender">Bartender</option>
                          <option value="Beleza e Dia da Noiva">Beleza e Dia da Noiva</option>
                          <option value="Bem Casados">Bem Casados</option>
                          <option value="Bolo e Doces">Bolo e Doces</option>
                          <option value="Buffet">Buffet</option>
                          <option value="Cerimonialista">Cerimonialista</option>
                          <option value="Convites e Papelaria">Convites e Papelaria</option>
                          <option value="Coreografia">Coreografia</option>
                          <option value="Decoração">Decoração</option>
                          <option value="Dia do Noivo">Dia do Noivo</option>
                          <option value="Espaço">Espaço</option>
                          <option value="Filmagem">Filmagem</option>
                          <option value="Fotografia">Fotografia</option>
                          <option value="Gastronomia">Gastronomia</option>
                          <option value="Joias">Joias</option>
                          <option value="Lembrancinhas">Lembrancinhas</option>
                          <option value="Lista de Presentes">Lista de Presentes</option>
                          <option value="Lua de Mel">Lua de Mel</option>
                          <option value="Música (Bandas/DJs)">Música (Bandas/DJs)</option>
                          <option value="Música para Cerimônia">Música para Cerimônia</option>
                          <option value="Noite de Núpcias">Noite de Núpcias</option>
                          <option value="Open Bar">Open Bar</option>
                          <option value="Recreação Infantil">Recreação Infantil</option>
                          <option value="Sapato da Noiva">Sapato da Noiva</option>
                          <option value="Segurança e Limpeza">Segurança e Limpeza</option>
                          <option value="Terno do Noivo">Terno do Noivo</option>
                          <option value="Valet">Valet</option>
                          <option value="Vestido de Noiva">Vestido de Noiva</option>
                        </select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Descrição / Bio</label>
                        <textarea
                          value={editProfileForm.description}
                          onChange={e => setEditProfileForm({ ...editProfileForm, description: e.target.value })}
                          rows={4}
                          className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-5 outline-none focus:border-emerald-600 resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">WhatsApp</label>
                        <input
                          value={editProfileForm.whatsapp || editProfileForm.phone}
                          onChange={e => setEditProfileForm({ ...editProfileForm, whatsapp: e.target.value, phone: e.target.value })}
                          className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-5 outline-none focus:border-emerald-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Instagram (@)</label>
                        <input
                          value={editProfileForm.instagram}
                          onChange={e => setEditProfileForm({ ...editProfileForm, instagram: e.target.value })}
                          className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-5 outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setIsEditingProfile(false)} className="px-8 py-4 bg-zinc-950 border border-white/5 rounded-2xl font-black uppercase text-xs text-zinc-500 hover:text-white transition-all">Cancelar</button>
                      <button
                        onClick={() => handleUpdateSupplierProfile(editProfileForm)}
                        className="flex-1 bg-emerald-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/10"
                      >
                        Salvar Alterações
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {supplierTab === 'portfolio' && (
              <div className="bg-zinc-950 p-12 rounded-[40px] border border-white/5 space-y-10 animate-in fade-in duration-500">
                <div className="flex justify-between items-center"><h3 className="text-xl font-bold">Galeria ({mySupplierProfile.portfolio.length}/10)</h3><button onClick={() => setActiveModal('gallery_add_supplier')} className="p-3 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-all border border-white/10"><Plus size={20} /></button></div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  <img src={mySupplierProfile.image} className="aspect-square object-cover rounded-3xl border border-white/10" title="Logo" />
                  {mySupplierProfile.portfolio.map((img, i) => (
                    <div key={i} className="aspect-square bg-zinc-900 rounded-3xl overflow-hidden border border-white/5 shadow-xl group relative">
                      <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <button
                        onClick={() => handleDeletePortfolioImage(i)}
                        className="absolute top-2 right-2 p-2 bg-black/60 backdrop-blur-md rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === AppView.STREAMING && (
          <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
            <h2 className="text-5xl font-serif">Original Noivaflix</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {MOCK_VIDEOS.map(v => (
                <div key={v.id} className="group cursor-pointer space-y-4">
                  <div className="relative aspect-video rounded-[32px] overflow-hidden"><img src={v.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><Play fill="white" size={32} /></div></div>
                  <div className="px-2"><span className="text-red-500 font-black text-[10px] uppercase tracking-widest">{v.category}</span><h4 className="text-xl font-bold mt-1 text-white">{v.title}</h4></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === AppView.VENDORS && (
          <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
            <header className="space-y-8">
              <h2 className="text-5xl font-serif">Time dos Sonhos</h2>
              <div className="bg-zinc-900/50 p-8 rounded-[40px] border border-white/5 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <input
                      value={vendorSearch.query}
                      onChange={e => setVendorSearch({ ...vendorSearch, query: e.target.value })}
                      placeholder="Nome do fornecedor..."
                      className="w-full bg-zinc-800 border border-white/5 rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-1 ring-red-600 text-sm text-white"
                    />
                  </div>
                  <div className="relative">
                    <input
                      list="vendor-categories-list"
                      value={vendorSearch.category}
                      onChange={e => setVendorSearch({ ...vendorSearch, category: e.target.value })}
                      placeholder="Categoria (ex: Buffet...)"
                      className="w-full bg-zinc-800 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:ring-1 ring-red-600 text-sm text-white"
                    />
                    <datalist id="vendor-categories-list">
                      <option value="Espaço" />
                      <option value="Fotografia" />
                      <option value="Decoração" />
                      <option value="Música" />
                      <option value="Buffet" />
                      <option value="Assessoria" />
                    </datalist>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <input
                      value={vendorSearch.city}
                      onChange={e => setVendorSearch({ ...vendorSearch, city: e.target.value })}
                      placeholder="Cidade"
                      className="w-full bg-zinc-800 border border-white/5 rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-1 ring-red-600 text-sm text-white"
                    />
                  </div>
                  <div className="relative">
                    <input
                      maxLength={2}
                      value={vendorSearch.state}
                      onChange={e => setVendorSearch({ ...vendorSearch, state: e.target.value.toUpperCase() })}
                      placeholder="Estado (UF)"
                      className="w-full bg-zinc-800 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:ring-1 ring-red-600 text-sm text-white"
                    />
                  </div>
                </div>
              </div>
            </header>

            {brideFilteredVendors.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-zinc-600">
                  <FilterX size={32} />
                </div>
                <h3 className="text-2xl font-bold">Nenhum fornecedor encontrado</h3>
                <p className="text-zinc-500">Tente ajustar seus filtros ou buscar por outros termos.</p>
                <button
                  onClick={() => setVendorSearch({ query: '', category: '', city: '', state: '' })}
                  className="text-red-500 font-bold hover:underline"
                >
                  Limpar todos os filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {brideFilteredVendors.map(vendor => (
                  <div
                    key={vendor.id}
                    onClick={() => {
                      setSelectedVendor(vendor);
                      setActiveModal('supplier_details');
                      handleTrackView(vendor);
                    }}
                    className="bg-zinc-900 rounded-[40px] overflow-hidden border border-white/5 group hover:border-red-600/40 transition-all cursor-pointer"
                  >
                    <div className="h-60 relative">
                      <img src={vendor.image} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                      <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded-full text-xs font-bold text-amber-500 flex items-center gap-1">
                        <Sparkles size={12} /> {vendor.rating}
                      </div>
                    </div>
                    <div className="p-8 space-y-3">
                      <h4 className="text-2xl font-bold">{vendor.name}</h4>
                      <p className="text-zinc-500 text-sm line-clamp-2">{vendor.description}</p>
                      <div className="flex flex-wrap items-center gap-2 text-zinc-600 text-[10px] font-black uppercase pt-4 tracking-widest">
                        <span className="bg-zinc-800 px-3 py-1 rounded-lg text-white/80">{vendor.category}</span>
                        <span className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-lg">
                          <MapPin size={12} /> {vendor.location}, {vendor.state}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- Modals --- */}

      <Modal isOpen={activeModal === 'supplier_details' && !!selectedVendor} onClose={() => { setActiveModal(null); setSelectedVendor(null); }} title={selectedVendor?.name || 'Detalhes do Fornecedor'}>
        {selectedVendor && (
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <img src={selectedVendor.image} className="w-40 h-40 rounded-3xl object-cover border-4 border-white/5" />
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-red-600 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest">{selectedVendor.plan}</span>
                  <span className="bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest flex items-center gap-2">
                    <Sparkles size={12} className="text-amber-500" /> {selectedVendor.rating} Avaliação
                  </span>
                  <span className="bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest">
                    {selectedVendor.experience_years} Anos de Exp.
                  </span>
                </div>
                <h3 className="text-4xl font-serif">{selectedVendor.name}</h3>
                <div className="flex items-center gap-2 text-zinc-500 text-sm">
                  <MapPin size={16} /> <span>{selectedVendor.location}, {selectedVendor.state}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Sobre a Empresa</h4>
              <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-3xl">
                <p className="text-zinc-400 leading-relaxed italic">"{selectedVendor.description}"</p>
              </div>
            </div>

            {selectedVendor.portfolio && selectedVendor.portfolio.length > 0 && (
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Portfólio em Destaque</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedVendor.portfolio.map((img, idx) => (
                    <img key={idx} src={img} className="w-full aspect-square object-cover rounded-2xl border border-white/5 hover:scale-105 transition-all cursor-zoom-in" />
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {selectedVendor.whatsapp && (
                <a
                  href={`https://wa.me/55${selectedVendor.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleTrackLead(selectedVendor)}
                  className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white py-6 rounded-2xl font-black uppercase transition-all shadow-xl shadow-emerald-600/10"
                >
                  <MessageCircle size={20} /> Orçamento via WhatsApp
                </a>
              )}
              {selectedVendor.instagram && (
                <a
                  href={`https://instagram.com/${selectedVendor.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-white py-6 rounded-2xl font-black uppercase transition-all"
                >
                  <Instagram size={20} /> Ver Instagram
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>





      <Modal isOpen={activeModal === 'gallery_add'} onClose={() => setActiveModal(null)} title="Adicionar Foto">
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Upload do Dispositivo</label>
            <label className="block w-full">
              <input type="file" accept="image/*" onChange={(e) => { handleSitePhotoUpload(e, true); setActiveModal(null); }} className="hidden" />
              <div className="w-full bg-zinc-900 border border-dashed border-white/10 hover:border-red-600/50 rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all group">
                <div className="p-4 bg-red-600/10 text-red-500 rounded-full group-hover:scale-110 transition-all"><Upload size={24} /></div>
                <span className="text-zinc-500 font-bold">Selecionar arquivo do PC ou Celular</span>
              </div>
            </label>
          </div>
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-zinc-700 text-[10px] font-black uppercase tracking-widest">ou use uma URL</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>
          <div className="space-y-4">
            <input id="photo-input-noiva" placeholder="https://exemplo.com/foto.jpg" className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 outline-none focus:border-red-600 text-white text-sm" />
            <button onClick={() => { addPhotoToAlbum((document.getElementById('photo-input-noiva') as HTMLInputElement).value); }} className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase shadow-xl hover:bg-zinc-200 transition-all">Adicionar via URL</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'gallery_add_supplier'} onClose={() => setActiveModal(null)} title="Foto do Portfólio">
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-1">Upload do Dispositivo</label>
            <label className="block w-full">
              <input type="file" accept="image/*" onChange={(e) => { handleSupplierPortfolioUpload(e); setActiveModal(null); }} className="hidden" />
              <div className="w-full bg-zinc-900 border border-dashed border-white/10 hover:border-emerald-600/50 rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all group">
                <div className="p-4 bg-emerald-600/10 text-emerald-500 rounded-full group-hover:scale-110 transition-all"><Upload size={24} /></div>
                <span className="text-zinc-500 font-bold">Selecionar arquivo</span>
              </div>
            </label>
          </div>
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-zinc-700 text-[10px] font-black uppercase tracking-widest">ou use uma URL</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>
          <div className="space-y-4">
            <input id="photo-input-supp" placeholder="https://exemplo.com/foto.jpg" className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 outline-none focus:border-emerald-600 text-white text-sm" />
            <button onClick={() => { addPhotoToPortfolio((document.getElementById('photo-input-supp') as HTMLInputElement).value); }} className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black uppercase shadow-xl hover:bg-emerald-700 transition-all">Salvar via URL</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === ('rsvp' as any)} onClose={() => setActiveModal(null)} title="Confirmar Presença">
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          submitRSVP(siteData.slug, {
            name: formData.get('name'),
            phone: formData.get('phone'),
            confirmed: true
          });
        }} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-600 ml-1">Seu Nome Completo</label>
            <input name="name" required className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 text-sm" placeholder="Ex: Maria Souza" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-600 ml-1">Seu WhatsApp</label>
            <input name="phone" required className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 text-sm" placeholder="(11) 99999-9999" />
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
            <p className="text-emerald-500 font-bold mb-1">Deseja confirmar sua presença?</p>
            <p className="text-[10px] text-emerald-500/60 uppercase tracking-widest">Aguardamos você neste dia especial!</p>
          </div>
          <button type="submit" className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase shadow-xl hover:bg-zinc-200 transition-all">Confirmar Agora</button>
        </form>
      </Modal>

      <Modal isOpen={activeModal === 'cover_crop'} onClose={() => setActiveModal(null)} title="Ajustar Foto de Capa">
        <div className="p-2">
          {tempCropImage && (
            <ImageCropper
              image={tempCropImage}
              aspectRatio={16 / 9}
              onCropComplete={async (croppedBlob) => {
                await handleSitePhotoUpload(croppedBlob, false);
                setActiveModal(null);
                setTempCropImage(null);
              }}
              onCancel={() => {
                setActiveModal(null);
                setTempCropImage(null);
              }}
            />
          )}
        </div>
      </Modal>

      {user?.role === 'noiva' && isAIChatOpen && (
        <div className="fixed bottom-24 lg:bottom-40 right-6 lg:right-12 w-[calc(100vw-48px)] md:w-[450px] h-[600px] max-h-[70vh] bg-zinc-950 border border-white/10 rounded-[40px] shadow-2xl z-[200] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
          <header className="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/20">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white">Madrinha IA</h3>
                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Online agora
                </p>
              </div>
            </div>
            <button onClick={() => setIsAIChatOpen(false)} className="p-3 hover:bg-white/5 rounded-xl transition-all text-zinc-500 hover:text-white">
              <Plus className="rotate-45" size={20} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar bg-gradient-to-b from-transparent to-black/20">
            {chatMessages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-5 rounded-[24px] text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-red-600 text-white rounded-tr-none' : 'bg-zinc-900 text-zinc-300 border border-white/5 rounded-tl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-zinc-900 p-5 rounded-[24px] rounded-tl-none border border-white/5 flex gap-2 items-center text-zinc-500 italic text-sm">
                  <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-6 bg-zinc-900/50 border-t border-white/5">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="relative flex items-center gap-3 bg-zinc-950 border border-white/10 rounded-2xl p-2 pl-5 focus-within:border-red-600/50 transition-all"
            >
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Pergunte qualquer coisa..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-white py-3"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isThinking}
                className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-red-600/20"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {user?.role === 'noiva' && (
        <button onClick={() => setIsAIChatOpen(!isAIChatOpen)} className={`fixed bottom-24 lg:bottom-12 right-6 lg:right-12 w-20 h-20 bg-red-600 rounded-[28px] flex items-center justify-center shadow-2xl z-[101] text-white hover:scale-110 active:scale-95 transition-all ${isAIChatOpen ? 'hidden' : 'flex'}`}><MessageSquare size={32} /></button>
      )}

      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-black border-t border-white/5 p-4 flex justify-around items-center z-[90]">
        <button onClick={() => setCurrentView(AppView.DASHBOARD)} className={`p-3 transition-all ${currentView === AppView.DASHBOARD ? 'text-red-500 scale-125' : 'text-zinc-600'}`}><LayoutDashboard /></button>
        <button onClick={() => setCurrentView(AppView.STREAMING)} className={`p-3 transition-all ${currentView === AppView.STREAMING ? 'text-red-500 scale-125' : 'text-zinc-600'}`}><VideoIcon /></button>
        <button onClick={() => setCurrentView(AppView.VENDORS)} className={`p-3 transition-all ${currentView === AppView.VENDORS ? 'text-red-500 scale-125' : 'text-zinc-600'}`}><Store /></button>
        {user?.role === 'noiva' && <button onClick={() => setCurrentView(AppView.SITE_BUILDER)} className={`p-3 transition-all ${currentView === AppView.SITE_BUILDER ? 'text-red-500 scale-125' : 'text-zinc-600'}`}><Globe /></button>}
        {user?.role === 'fornecedor' && <button onClick={() => setCurrentView(AppView.SUPPLIER_DASHBOARD)} className={`p-3 transition-all ${currentView === AppView.SUPPLIER_DASHBOARD ? 'text-emerald-500 scale-125' : 'text-zinc-600'}`}><UserIcon /></button>}
        {user?.role === 'admin' && <button onClick={() => setCurrentView(AppView.ADMIN_PANEL)} className={`p-3 transition-all ${currentView === AppView.ADMIN_PANEL ? 'text-red-500 scale-125' : 'text-zinc-600'}`}><Database /></button>}
      </nav>

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }.font-serif { font-family: 'Playfair Display', serif; }`}</style>
    </div >
  );
};

export default App;