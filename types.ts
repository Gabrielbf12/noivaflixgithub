
export enum AppView {
  DASHBOARD = 'dashboard',
  STREAMING = 'streaming',
  CHECKLIST = 'checklist',
  BUDGET = 'budget',
  GUESTS = 'guests',
  SITE_BUILDER = 'site_builder',
  SITE_PUBLIC = 'site_public',
  VENDORS = 'vendors',
  PROFILE = 'profile',
  WEDDING_PROFILE = 'wedding_profile',
  SUPPLIER_DASHBOARD = 'supplier_dashboard',
  SUPPLIER_EDIT = 'supplier_edit',
  ADMIN_PANEL = 'admin_panel',
  ONBOARDING = 'onboarding',
  SUPPLIER_ONBOARDING = 'supplier_onboarding'
}

export type UserRole = 'noiva' | 'fornecedor' | 'admin';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'deleted';
export type PlanningPhase = 'acabei_noivar' | 'fechei_fornecedores' | 'falta_pouco' | 'estou_perdida';
export type AccountStatus = 'active' | 'suspended' | 'deleted';

export interface AdminLog {
  id: string;
  action: string;
  targetName: string;
  timestamp: string;
  adminName: string;
  details?: string;
}

export interface Video {
  id: string;
  title: string;
  category: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  dueDate: string;
}

export interface Guest {
  id: string;
  name: string;
  confirmed: boolean | 'pending';
  plusOnes: number;
  category: 'família' | 'amigos' | 'trabalho';
}

export interface Expense {
  id: string;
  supplier: string;
  category: string;
  value: number;
  status: 'pago' | 'pendente';
  observation?: string;
}

export interface Vendor {
  id: string;
  userId?: string;
  name: string;
  responsibleName?: string;
  category: string;
  location: string;
  state: string;
  region: string;
  image: string;
  coverImage?: string;
  description: string;
  experience_years?: number;
  rating: number;
  portfolio: string[];
  instagram?: string;
  website?: string;
  whatsapp?: string;
  phone?: string;
  email?: string;
  isPremium: boolean;
  status: ApprovalStatus;
  views: number;
  leads: number;
  plan: 'Básico' | 'Premium';
  dateRegistered?: string;
  activationDate?: string;

  // Novas funcionalidades estratégicas
  verified?: boolean;
  verification_status?: 'pending' | 'approved' | 'rejected' | null;
  verification_docs?: {
    cpfCnpj?: string;
    personalDoc?: string;
    addressProof?: string;
    portfolio?: string;
  };
  initialInvestment?: string;
  averageInvestmentRange?: string;
  averageContractedTicket?: string;
}

export interface WeddingSiteData {
  slug: string;
  theme: 'Classic' | 'Boho' | 'Modern';
  brideName: string;
  groomName: string;
  date: string;
  time: string;
  locationName: string;
  locationAddress: string;
  locationUrl?: string;
  headline: string;
  story: string;
  heroImage: string;
  album: string[];
  rsvpEnabled: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  weddingDate?: string;
  plan: string;
  avatar: string;
  supplierId?: string;
  accountStatus?: AccountStatus;
  dateRegistered?: string;
  budget?: number;
  city?: string;
  state?: string;
  guestCount?: string;
  phase?: PlanningPhase;
  onboardingCompleted?: boolean;
  subscriptionStatus?: 'active' | 'trialing' | 'past_due' | 'canceled';
  trialEndsAt?: string;
  currentPeriodEnd?: string;
  weddingStyle?: string;
  urgencyLevel?: string;
  decisionStage?: string;
  vendorTicket?: number;
  weddingProfileCompleted?: boolean;
  phone?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  planned: number;
  spent: number;
  color: string;
}

export interface Milestone {
  id: string;
  label: string;
  achieved: boolean;
  date?: string;
}

export interface Lead {
  id: string;
  created_at: string;
  vendor_id: string;
  bride_id?: string;
  bride_name: string;
  bride_city?: string;
  bride_wedding_date?: string;
  bride_guest_count?: string;
  bride_total_budget?: number;
  bride_vendor_ticket?: number;
  bride_wedding_style?: string;
  bride_urgency_level?: string;
  bride_decision_stage?: string;
  status: 'new' | 'contacted' | 'closed' | 'lost';
  notes?: string;
  contacted_at?: string;
}
