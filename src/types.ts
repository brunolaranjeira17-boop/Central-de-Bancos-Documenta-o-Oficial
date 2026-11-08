export type UserRole = 'ADMIN' | 'ANALYST' | 'CONSULTANT';

export interface UserProfile {
  role: UserRole;
  name: string;
  department: string;
  avatarInitials: string;
}

export type BankStatus = 'OPERATING' | 'MAINTENANCE' | 'TOKEN_REQUIRED' | 'HIGH_DEMAND';

export interface Bank {
  id: string;
  name: string;
  code: string;
  category: string;
  url: string;
  logoUrl?: string;
  status: BankStatus;
  statusLabel: string;
  notes: string;
  commissionRate: string;
  highlightTag?: string;
}

export interface BankCategory {
  id: string;
  name: string;
  description: string;
  bankCount?: number;
}

export interface ProductGoal {
  id: string;
  name: string;
  category: string;
  targetValue: number;
  unit: string;
}

export type ProductionStatus = 'PAGO' | 'APROVADO' | 'EM_ANALISE' | 'AGUARDANDO_AVERBACAO';

export interface ProductionContract {
  id: string;
  contractNumber: string;
  clientName: string;
  clientDocument: string;
  productId: string;
  productName: string;
  bankId: string;
  bankName: string;
  value: number;
  consultantName: string;
  status: ProductionStatus;
  date: string;
  notes?: string;
}

export type ProposalStatus = 'EM_ANALISE' | 'APROVADA' | 'PENDENTE_DOCS' | 'RECUSADA';

export interface InternalProposal {
  id: string;
  proposalCode: string;
  clientName: string;
  clientCpf: string;
  productId: string;
  productName: string;
  targetBank: string;
  requestedValue: number;
  termMonths: number;
  consultantName: string;
  status: ProposalStatus;
  analystNote?: string;
  submittedAt: string;
  urgency: 'NORMAL' | 'ALTA' | 'VIP';
}

export interface MarketRate {
  name: string;
  rate: string;
  period: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface MarketNotice {
  id: string;
  title: string;
  summary: string;
  date: string;
  tag: 'MERCADO' | 'COMUNICADO' | 'OPERACIONAL' | 'CAMPANHA';
  priority: 'normal' | 'high';
}

export interface QuickDocument {
  id: string;
  title: string;
  format: 'PDF' | 'XLSX' | 'DOCX';
  size: string;
  category: string;
  updatedAt: string;
  fileData?: string;
  customUploaded?: boolean;
}

