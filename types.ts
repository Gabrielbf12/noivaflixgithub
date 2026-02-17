
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
