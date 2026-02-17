
import { Video, Task, BudgetCategory, Guest, Vendor, Milestone } from './types';

export const MOCK_VIDEOS: Video[] = [
  { id: '1', title: 'Os Primeiros 30 Dias', category: 'Organização', duration: '15:20', thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800', description: 'O guia definitivo para não surtar no primeiro mês de noivado.' },
  { id: '2', title: 'Palpites da Sogra e Mãe', category: 'Emoção', duration: '22:45', thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800', description: 'Como colocar limites com amor e elegância.' },
  { id: '3', title: 'Economizando no Buffet', category: 'Dinheiro', duration: '12:10', thumbnail: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800', description: 'Truques de negociação que os fornecedores não contam.' },
  { id: '4', title: 'Escolhendo a Assessoria', category: 'Fornecedores', duration: '18:30', thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800', description: 'Diferença entre assessoria do dia, parcial e completa.' }
];

export const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Definir estilo do casamento', completed: true, category: 'Estilo', dueDate: '2024-01-10' },
  { id: '2', title: 'Contratar local da festa', completed: true, category: 'Local', dueDate: '2024-02-15' },
  { id: '3', title: 'Degustação de doces', completed: false, category: 'Buffet', dueDate: '2024-06-20' },
];

export const MOCK_BUDGET: BudgetCategory[] = [
  { id: '1', name: 'Espaço e Buffet', planned: 35000, spent: 20000, color: '#ef4444' },
  { id: '2', name: 'Decoração', planned: 15000, spent: 0, color: '#f59e0b' },
  { id: '3', name: 'Foto e Filme', planned: 10000, spent: 4000, color: '#3b82f6' },
  { id: '6', name: 'Assessoria', planned: 5000, spent: 5000, color: '#10b981' },
];

// Added missing region property to MOCK_VENDORS to satisfy Vendor interface
export const MOCK_VENDORS: Vendor[] = [
  { 
    id: '1', 
    name: 'Villa dos Lagos', 
    category: 'Espaço', 
    location: 'Atibaia', 
    state: 'SP', 
    region: 'Interior',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=400', 
    rating: 4.9,
    description: 'Um espaço encantador cercado pela natureza para o seu casamento dos sonhos.',
    portfolio: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=400'],
    isPremium: true,
    status: 'approved',
    views: 450,
    leads: 22,
    plan: 'Premium'
  },
  { 
    id: '2', 
    name: 'Foco Criativo', 
    category: 'Fotografia', 
    location: 'São Paulo', 
    state: 'SP', 
    region: 'Capital',
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=400', 
    rating: 4.8,
    description: 'Capturando momentos espontâneos e eternizando emoções.',
    portfolio: ['https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=400'],
    isPremium: false,
    status: 'approved',
    views: 320,
    leads: 15,
    plan: 'Básico'
  },
  { 
    id: '3', 
    name: 'Art Flowers', 
    category: 'Decoração', 
    location: 'Campinas', 
    state: 'SP', 
    region: 'Interior',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=400', 
    rating: 4.7,
    description: 'Design floral exclusivo para casamentos românticos e modernos.',
    portfolio: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=400'],
    isPremium: false,
    status: 'approved',
    views: 280,
    leads: 10,
    plan: 'Básico'
  },
  { 
    id: '4', 
    name: 'Luz da Serra', 
    category: 'Espaço', 
    location: 'Petrópolis', 
    state: 'RJ', 
    region: 'Serrana',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=400', 
    rating: 4.6,
    description: 'A sofisticação da serra fluminense para o seu grande dia.',
    portfolio: ['https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=400'],
    isPremium: false,
    status: 'approved',
    views: 190,
    leads: 8,
    plan: 'Básico'
  },
  { 
    id: '5', 
    name: 'Banda Show', 
    category: 'Música', 
    location: 'Curitiba', 
    state: 'PR', 
    region: 'Capital',
    image: 'https://images.unsplash.com/photo-1514525253361-bee8718a300a?q=80&w=400', 
    rating: 4.9,
    description: 'Animação garantida com o melhor repertório para festas de casamento.',
    portfolio: ['https://images.unsplash.com/photo-1514525253361-bee8718a300a?q=80&w=400'],
    isPremium: true,
    status: 'approved',
    views: 510,
    leads: 30,
    plan: 'Premium'
  },
];

export const MOCK_MILESTONES: Milestone[] = [
  { id: '1', label: 'Noivado', achieved: true, date: '12/12/2023' },
  { id: '2', label: 'Local Fechado', achieved: true, date: '15/02/2024' },
  { id: '3', label: 'Vestido Escolhido', achieved: false },
  { id: '4', label: 'Site no Ar', achieved: true },
];

export const MOCK_GUESTS: Guest[] = [
  { id: '1', name: 'Ana Carolina (Mãe)', confirmed: true, plusOnes: 1, category: 'família' },
  { id: '2', name: 'Ricardo Santos', confirmed: false, plusOnes: 0, category: 'amigos' },
  { id: '3', name: 'Beatriz Oliveira', confirmed: 'pending', plusOnes: 1, category: 'família' },
];
