import React, { useState } from 'react';
import {
    Users, Building2, Clock, TrendingUp, Check, X, Search, CheckCircle,
    PieChart, ArrowUpRight, Video as VideoIcon, Plus, Trash2, LayoutDashboard
} from 'lucide-react';
import { User, Vendor, Video } from '../types';

interface AdminPanelProps {
    user: User | null;
    adminStats: {
        totalBrides: number;
        totalVendors: number;
        pendingVendors: number;
        monthlyRevenue: number;
    };
    allUsers: User[];
    vendors: Vendor[];
    videos: Video[];
    onApproveVendor: (id: string) => void;
    onRejectVendor: (id: string) => void;
    onAddVideo: (e: React.FormEvent<HTMLFormElement>) => void;
    onDeleteVideo: (id: string) => void;
}

const PREMIUM_PRICE_NOIVA = 47;
const PREMIUM_PRICE_FORNECEDOR = 97;

export const AdminPanel: React.FC<AdminPanelProps> = ({
    user,
    adminStats,
    allUsers,
    vendors,
    videos,
    onApproveVendor,
    onRejectVendor,
    onAddVideo,
    onDeleteVideo
}) => {
    const [adminTab, setAdminTab] = useState<'overview' | 'brides' | 'vendors' | 'finances' | 'videos'>('overview');
    const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
                <div className="space-y-2">
                    <h2 className="text-5xl font-serif text-white">Pro Painel Admin</h2>
                    <p className="text-zinc-500">Gestão global do ecossistema Noivaflix.</p>
                </div>
                <div className="flex bg-zinc-950 p-2 rounded-2xl border border-white/5 gap-2 overflow-x-auto no-scrollbar max-w-full">
                    <button onClick={() => setAdminTab('overview')} className={`px-6 py-3 rounded-xl font-bold text-xs uppercase transition-all whitespace-nowrap ${adminTab === 'overview' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-500 hover:text-white'}`}>Visão Geral</button>
                    <button onClick={() => setAdminTab('brides')} className={`px-6 py-3 rounded-xl font-bold text-xs uppercase transition-all whitespace-nowrap ${adminTab === 'brides' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-500 hover:text-white'}`}>Noivas</button>
                    <button onClick={() => setAdminTab('vendors')} className={`px-6 py-3 rounded-xl font-bold text-xs uppercase transition-all whitespace-nowrap ${adminTab === 'vendors' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-500 hover:text-white'}`}>Fornecedores {adminStats.pendingVendors > 0 && <span className="ml-1 bg-red-600 text-white px-2 py-0.5 rounded-full text-[10px]">{adminStats.pendingVendors}</span>}</button>
                    <button onClick={() => setAdminTab('finances')} className={`px-6 py-3 rounded-xl font-bold text-xs uppercase transition-all whitespace-nowrap ${adminTab === 'finances' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-500 hover:text-white'}`}>Financeiro</button>
                    <button onClick={() => setAdminTab('videos')} className={`px-6 py-3 rounded-xl font-bold text-xs uppercase transition-all whitespace-nowrap ${adminTab === 'videos' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-500 hover:text-white'}`}>Conteúdos</button>
                </div>
            </header>

            {adminTab === 'overview' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-zinc-900/40 p-8 rounded-[32px] border border-white/5 space-y-4 hover:bg-zinc-900/60 transition-colors">
                            <div className="p-3 bg-red-600/10 text-red-500 w-fit rounded-xl"><Users size={20} /></div>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Total Noivas</p>
                            <h3 className="text-3xl font-black text-white">{adminStats.totalBrides}</h3>
                        </div>
                        <div className="bg-zinc-900/40 p-8 rounded-[32px] border border-white/5 space-y-4 hover:bg-zinc-900/60 transition-colors">
                            <div className="p-3 bg-emerald-600/10 text-emerald-500 w-fit rounded-xl"><Building2 size={20} /></div>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Total Fornecedores</p>
                            <h3 className="text-3xl font-black text-white">{adminStats.totalVendors}</h3>
                        </div>
                        <div className="bg-zinc-900/40 p-8 rounded-[32px] border border-white/5 space-y-4 hover:bg-zinc-900/60 transition-colors">
                            <div className="p-3 bg-amber-600/10 text-amber-500 w-fit rounded-xl"><Clock size={20} /></div>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Pendentes Aprovação</p>
                            <h3 className="text-3xl font-black text-white">{adminStats.pendingVendors}</h3>
                        </div>
                        <div className="bg-zinc-900/40 p-8 rounded-[32px] border border-white/5 space-y-4 hover:bg-zinc-900/60 transition-colors">
                            <div className="p-3 bg-blue-600/10 text-blue-500 w-fit rounded-xl"><TrendingUp size={20} /></div>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Receita Mensal (Estimada)</p>
                            <h3 className="text-3xl font-black text-white">R$ {adminStats.monthlyRevenue.toLocaleString()}</h3>
                        </div>
                    </div>

                    <div className="bg-zinc-900/20 p-10 rounded-[40px] border border-white/5">
                        <h3 className="text-xl font-bold mb-8 text-white flex items-center gap-2"><LayoutDashboard size={20} className="text-zinc-500" /> Atividades Recentes</h3>
                        <div className="space-y-4">
                            {vendors.filter(v => v.status === 'pending').map(v => (
                                <div key={v.id} className="flex flex-col md:flex-row justify-between items-center p-6 bg-zinc-900/40 rounded-3xl border border-white/5 gap-4">
                                    <div className="flex items-center gap-6">
                                        <img src={v.image} className="w-12 h-12 rounded-xl object-cover" />
                                        <div>
                                            <h4 className="font-bold text-white">{v.name}</h4>
                                            <p className="text-zinc-500 text-xs uppercase tracking-widest">Solicitação de cadastro • {v.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => onRejectVendor(v.id)} className="p-3 bg-red-600/10 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all" title="Rejeitar"><X size={18} /></button>
                                        <button onClick={() => onApproveVendor(v.id)} className="p-3 bg-emerald-600/10 text-emerald-500 rounded-xl hover:bg-emerald-600 hover:text-white transition-all" title="Aprovar"><Check size={18} /></button>
                                    </div>
                                </div>
                            ))}
                            {adminStats.pendingVendors === 0 && <p className="text-center py-10 text-zinc-600 italic">Nenhuma atividade pendente no momento.</p>}
                        </div>
                    </div>
                </div>
            )}

            {adminTab === 'brides' && (
                <div className="bg-zinc-900/20 p-6 md:p-10 rounded-[40px] border border-white/5 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
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
                                                <span className="font-bold text-white">{bride.name}</span>
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
                <div className="bg-zinc-900/20 p-6 md:p-10 rounded-[40px] border border-white/5 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
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
                                                    <span className="font-bold text-white">{v.name}</span>
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
                                                        <button onClick={() => onApproveVendor(v.id)} className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"><Check size={18} /></button>
                                                        <button onClick={() => onRejectVendor(v.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><X size={18} /></button>
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
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-zinc-900/40 p-10 rounded-[40px] border border-white/5 space-y-6">
                            <h4 className="text-xl font-bold flex items-center gap-3 text-white"><PieChart className="text-red-500" /> Origem da Receita</h4>
                            <div className="h-64 flex items-center justify-center border-b border-white/5">
                                <div className="relative w-48 h-48 rounded-full border-[20px] border-zinc-900 flex items-center justify-center">
                                    <div className="absolute inset-0 rounded-full border-[20px] border-red-600 border-l-transparent border-b-transparent rotate-45"></div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black uppercase text-zinc-500">Faturamento</p>
                                        <p className="text-2xl font-black text-white">100%</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 pt-4">
                                <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-sm text-zinc-400"><div className="w-3 h-3 bg-red-600 rounded-full"></div> Noivas Premium</span><span className="font-bold text-white">R$ {(allUsers.filter(u => u.role === 'noiva' && u.plan === 'Premium').length * PREMIUM_PRICE_NOIVA).toLocaleString()}</span></div>
                                <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-sm text-zinc-400"><div className="w-3 h-3 bg-emerald-600 rounded-full"></div> Fornecedores Premium</span><span className="font-bold text-white">R$ {(vendors.filter(v => v.plan === 'Premium' && v.status === 'approved').length * PREMIUM_PRICE_FORNECEDOR).toLocaleString()}</span></div>
                            </div>
                        </div>

                        <div className="bg-zinc-900/40 p-10 rounded-[40px] border border-white/5 space-y-8">
                            <h4 className="text-xl font-bold text-white">Últimas Transações</h4>
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
                                            <div><p className="font-bold text-sm text-white">{t.name}</p><p className="text-[10px] text-zinc-500 uppercase tracking-widest">{t.plan}</p></div>
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

            {adminTab === 'videos' && (
                <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white">Gerenciar Vídeos</h3>
                        <button onClick={() => setIsAddVideoModalOpen(true)} className="bg-white text-black px-6 py-3 rounded-xl font-black uppercase text-xs shadow-lg hover:bg-zinc-200 transition-all flex items-center gap-2">
                            <Plus size={16} /> Adicionar Vídeo
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map(v => (
                            <div key={v.id} className="bg-zinc-900/40 p-4 rounded-3xl border border-white/5 space-y-4 group">
                                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
                                    <img src={v.thumbnail} className="w-full h-full object-cover opacity-60" />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button onClick={() => onDeleteVideo(v.id)} className="p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700 shadow-lg"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-red-500 font-black text-[10px] uppercase tracking-widest">{v.category}</span>
                                    <h4 className="font-bold text-white truncate">{v.title}</h4>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Video Modal */}
                    {isAddVideoModalOpen && (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
                            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsAddVideoModalOpen(false)}></div>
                            <div className="bg-zinc-950 border border-white/10 w-full max-w-lg rounded-[32px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                                <header className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-white">Adicionar Novo Vídeo</h3>
                                    <button onClick={() => setIsAddVideoModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-white"><X size={20} /></button>
                                </header>
                                <div className="p-6 md:p-8">
                                    <form onSubmit={(e) => { onAddVideo(e); setIsAddVideoModalOpen(false); }} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-zinc-600 ml-1">Título do Vídeo</label>
                                            <input name="title" required className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 text-sm text-white focus:border-red-600 transition-colors outline-none" placeholder="Ex: Guia de Casamento" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-zinc-600 ml-1">Categoria</label>
                                                <select name="category" className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 text-sm text-white focus:border-red-600 transition-colors outline-none appearance-none">
                                                    <option>Planejamento</option>
                                                    <option>Inspiração</option>
                                                    <option>Tutorial</option>
                                                    <option>Entrevista</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-zinc-600 ml-1">Thumbnail URL</label>
                                                <input name="thumbnail" className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 text-sm text-white focus:border-red-600 transition-colors outline-none" placeholder="https://..." />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-zinc-600 ml-1">URL do Vídeo (YouTube/MP4)</label>
                                            <input name="videoUrl" required className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 text-sm text-white focus:border-red-600 transition-colors outline-none" placeholder="https://..." />
                                        </div>
                                        <button type="submit" className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase shadow-xl hover:bg-zinc-200 transition-all">Adicionar Vídeo</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
