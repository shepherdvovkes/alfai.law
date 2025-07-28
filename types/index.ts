export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'lawyer' | 'assistant'
  firm?: string
  position?: string
  specialization?: string
  barNumber?: string
  createdAt: Date
  lastLogin?: Date
}

export interface Case {
  id: string
  caseNumber: string
  title: string
  description: string
  clientId: string
  status: 'active' | 'pending' | 'closed' | 'archived'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  type: 'civil' | 'criminal' | 'administrative' | 'commercial' | 'family' | 'other'
  court?: string
  judge?: string
  amount?: number
  currency?: string
  startDate: Date
  deadline?: Date
  assignedTo: string[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Client {
  id: string
  name: string
  email: string
  phone?: string
  type: 'individual' | 'corporate'
  address?: string
  company?: string
  position?: string
  notes?: string
  avatar?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Document {
  id: string
  title: string
  type: 'contract' | 'petition' | 'agreement' | 'report' | 'template' | 'other'
  content?: string
  fileUrl?: string
  fileName?: string
  fileSize?: number
  mimeType?: string
  caseId?: string
  clientId?: string
  createdBy: string
  version: number
  isTemplate: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  attachments?: string[]
  metadata?: Record<string, any>
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo?: string
  caseId?: string
  clientId?: string
  dueDate?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Event {
  id: string
  title: string
  description?: string
  type: 'meeting' | 'court-hearing' | 'deadline' | 'reminder' | 'other'
  startDate: Date
  endDate?: Date
  allDay: boolean
  location?: string
  attendees?: string[]
  caseId?: string
  clientId?: string
  reminder?: Date
  createdAt: Date
  updatedAt: Date
}

export interface SearchResult {
  id: string
  title: string
  snippet?: string
  type: 'case' | 'document' | 'client' | 'precedent' | 'Civil Litigation' | 'Corporate Law' | 'Intellectual Property'
  relevance?: number
  metadata?: Record<string, any>
  status?: string
  priority?: string
  assignedTo?: string
  client?: string
  lastUpdated?: Date
  progress?: number
  description?: string
  tags?: string[]
}

export interface Analytics {
  totalCases: number
  activeCases: number
  completedCases: number
  totalClients: number
  totalRevenue: number
  aiQueriesUsed: number
  documentsGenerated: number
  successRate: number
  averageCaseDuration: number
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  actionUrl?: string
  createdAt: Date
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'date' | 'file' | 'checkbox'
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: any
  placeholder?: string
}

export interface SidebarItem {
  id: string
  label: string
  icon: string
  href: string
  badge?: number
  children?: SidebarItem[]
}

export interface Breadcrumb {
  label: string
  href?: string
} 