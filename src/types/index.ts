// Tipos principales de la aplicación

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
  rut?: string
  contactPerson?: string
  industry?: string
  createdAt: string
}

export interface PersonalInfo {
  companyName: string
  contactName: string
  email: string
  phone: string
  address: string
}

export interface ProjectAbstract {
  title: string
  description: string
  objectives: string[]
}

export interface Deliverable {
  id: string
  name: string
  description: string
  quantity: number
  unit: string
  unitPrice: number
  total: number
}

export interface TimelinePhase {
  name: string
  duration: string
  startDate: string
  endDate: string
}

export interface Timeline {
  startDate: string
  endDate: string
  phases: TimelinePhase[]
}

export interface CommercialConditions {
  currency: string
  paymentTerms: string
  validityDays: number
  warranty: string
  additionalTerms: string[]
}

export interface OptionalItem {
  id: string
  name: string
  description: string
  price: number
  selected: boolean
}

export interface BankingDetails {
  bankName: string
  accountType: string
  accountNumber: string
  rut: string
}

export interface QuotationTotals {
  subtotal: number
  optionalSelected: number
  subtotalWithOptional: number
  tax: number
  total: number
}

export interface Quotation {
  id: string
  clientId: string
  number: string
  title: string
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'expired'
  validUntil: string
  createdAt: string
  updatedAt: string
  
  // Secciones de la cotización
  personalInfo: PersonalInfo
  projectAbstract: ProjectAbstract
  deliverables: Deliverable[]
  assumptions: string[]
  timeline: Timeline
  commercialConditions: CommercialConditions
  optionalItems: OptionalItem[]
  bankingDetails: BankingDetails
  notes: string
  
  // Totales
  totals: QuotationTotals
}

// Tipos para el store
export interface QuotationItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

// Estados de la aplicación
export type QuotationStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'expired'

// Tipos para formularios
export interface NewQuotationForm {
  clientId: string
  title: string
}

export interface ClientForm {
  name: string
  email: string
  phone: string
  address: string
  rut?: string
  contactPerson?: string
  industry?: string
}

// Tipos para estadísticas
export interface DashboardStats {
  totalQuotations: number
  approvedQuotations: number
  pendingQuotations: number
  totalClients: number
  totalRevenue: number
}
