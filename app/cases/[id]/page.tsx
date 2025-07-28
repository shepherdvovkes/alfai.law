'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  User, 
  FileText, 
  Clock, 
  DollarSign, 
  MapPin, 
  Phone, 
  Mail, 
  Edit, 
  Plus, 
  Download, 
  Share, 
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Clock as ClockIcon
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Case, Client, Document, Task, Event } from '@/types'

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)

  // Mock case data
  const caseData: Case = {
    id: params.id,
    caseNumber: 'CASE-2024-001',
    title: 'Smith vs. Johnson - Contract Dispute',
    description: 'Contract dispute regarding software development services and payment terms. The plaintiff alleges breach of contract and seeks damages for unpaid work.',
    clientId: 'client-1',
    status: 'active',
    priority: 'high',
    type: 'civil',
    court: 'Superior Court of California',
    judge: 'Hon. Sarah Williams',
    amount: 150000,
    currency: 'USD',
    startDate: new Date('2024-01-15'),
    deadline: new Date('2024-06-30'),
    assignedTo: ['lawyer-1', 'lawyer-2'],
    tags: ['Contract', 'Software', 'Dispute', 'Payment'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  }

  const clientData: Client = {
    id: 'client-1',
    name: 'Robert Smith',
    email: 'robert.smith@email.com',
    phone: '+1 (555) 123-4567',
    type: 'individual',
    address: '123 Main Street, San Francisco, CA 94102',
    company: 'TechStart Inc.',
    position: 'CEO',
    notes: 'High-value client, prefers email communication',
    tags: ['Technology', 'Startup', 'VIP'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
  }

  const documents: Document[] = [
    {
      id: 'doc-1',
      title: 'Original Contract Agreement',
      type: 'contract',
      fileName: 'contract_agreement.pdf',
      fileSize: 245760,
      mimeType: 'application/pdf',
      caseId: params.id,
      createdBy: 'lawyer-1',
      version: 1,
      isTemplate: false,
      tags: ['Contract', 'Original'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: 'doc-2',
      title: 'Breach Notice Letter',
      type: 'petition',
      fileName: 'breach_notice.pdf',
      fileSize: 128000,
      mimeType: 'application/pdf',
      caseId: params.id,
      createdBy: 'lawyer-1',
      version: 1,
      isTemplate: false,
      tags: ['Notice', 'Breach'],
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18'),
    },
    {
      id: 'doc-3',
      title: 'Court Filing - Complaint',
      type: 'petition',
      fileName: 'complaint.pdf',
      fileSize: 512000,
      mimeType: 'application/pdf',
      caseId: params.id,
      createdBy: 'lawyer-1',
      version: 1,
      isTemplate: false,
      tags: ['Court', 'Filing'],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
    },
  ]

  const tasks: Task[] = [
    {
      id: 'task-1',
      title: 'Review contract terms',
      description: 'Analyze the original contract for potential breach points',
      status: 'completed',
      priority: 'high',
      assignedTo: 'lawyer-1',
      caseId: params.id,
      dueDate: new Date('2024-01-16'),
      completedAt: new Date('2024-01-16'),
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-16'),
    },
    {
      id: 'task-2',
      title: 'Prepare response to defendant',
      description: 'Draft legal response to defendant\'s counter-arguments',
      status: 'in-progress',
      priority: 'high',
      assignedTo: 'lawyer-2',
      caseId: params.id,
      dueDate: new Date('2024-01-25'),
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18'),
    },
    {
      id: 'task-3',
      title: 'Schedule mediation session',
      description: 'Contact mediator and schedule preliminary mediation',
      status: 'todo',
      priority: 'medium',
      assignedTo: 'lawyer-1',
      caseId: params.id,
      dueDate: new Date('2024-02-01'),
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
    },
  ]

  const events: Event[] = [
    {
      id: 'event-1',
      title: 'Initial Case Review',
      description: 'First meeting with client to discuss case details',
      type: 'meeting',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-15'),
      allDay: false,
      location: 'Office Conference Room',
      attendees: ['lawyer-1', 'client-1'],
      caseId: params.id,
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-14'),
    },
    {
      id: 'event-2',
      title: 'Court Filing Deadline',
      description: 'Deadline for filing initial court documents',
      type: 'deadline',
      startDate: new Date('2024-01-25'),
      allDay: true,
      caseId: params.id,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: 'event-3',
      title: 'Preliminary Hearing',
      description: 'First court hearing for case presentation',
      type: 'court-hearing',
      startDate: new Date('2024-02-15'),
      endDate: new Date('2024-02-15'),
      allDay: false,
      location: 'Superior Court of California',
      attendees: ['lawyer-1', 'lawyer-2'],
      caseId: params.id,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
    },
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'documents', label: 'Documents', icon: '📄' },
    { id: 'timeline', label: 'Timeline', icon: '📅' },
    { id: 'tasks', label: 'Tasks', icon: '✅' },
    { id: 'communications', label: 'Communications', icon: '💬' },
  ]

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-accent-green" />
      case 'in-progress':
        return <ClockIcon size={16} className="text-accent-orange" />
      case 'todo':
        return <AlertCircle size={16} className="text-text-muted" />
      default:
        return <AlertCircle size={16} className="text-text-muted" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-text-primary">{caseData.title}</h1>
            <span className={`status-badge ${caseData.status}`}>
              {caseData.status}
            </span>
            <span className={`priority-badge ${caseData.priority}`}>
              {caseData.priority}
            </span>
          </div>
          <p className="text-text-secondary">Case Number: {caseData.caseNumber}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit size={16} className="mr-2" />
            Edit
          </Button>
          <Button className="btn-primary">
            <Plus size={16} className="mr-2" />
            Add Document
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface-light/30 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-500 text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Case Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Case Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Case Type</label>
                    <p className="text-text-primary">{caseData.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Court</label>
                    <p className="text-text-primary">{caseData.court}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Judge</label>
                    <p className="text-text-primary">{caseData.judge}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Amount</label>
                    <p className="text-text-primary">${caseData.amount?.toLocaleString()} {caseData.currency}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Start Date</label>
                    <p className="text-text-primary">{caseData.startDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Deadline</label>
                    <p className="text-text-primary">{caseData.deadline?.toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                  <p className="text-text-primary">{caseData.description}</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {events.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-3 bg-surface-light/30 rounded-lg">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-text-primary">{event.title}</h4>
                        <p className="text-sm text-text-secondary">{event.description}</p>
                        <p className="text-xs text-text-muted mt-1">
                          {event.startDate.toLocaleDateString()} {event.startDate.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Client Info & Quick Actions */}
            <div className="space-y-6">
              {/* Client Information */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Client Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-text-muted" />
                    <span className="text-text-primary">{clientData.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-text-muted" />
                    <span className="text-text-primary">{clientData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-text-muted" />
                    <span className="text-text-primary">{clientData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-text-muted" />
                    <span className="text-text-primary">{clientData.address}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <Button variant="outline" className="w-full">
                    <MessageSquare size={16} className="mr-2" />
                    Contact Client
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText size={16} className="mr-2" />
                    Add Document
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar size={16} className="mr-2" />
                    Schedule Event
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Plus size={16} className="mr-2" />
                    Create Task
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Share size={16} className="mr-2" />
                    Share Case
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text-primary">Documents</h2>
              <Button className="btn-primary">
                <Plus size={16} className="mr-2" />
                Upload Document
              </Button>
            </div>
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-surface-light/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-primary-400" />
                    <div>
                      <h4 className="font-medium text-text-primary">{doc.title}</h4>
                      <p className="text-sm text-text-secondary">
                        {formatFileSize(doc.fileSize || 0)} • {doc.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Download size={16} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-6">Case Timeline</h2>
            <div className="space-y-6">
              {events.map((event, index) => (
                <div key={event.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                    {index < events.length - 1 && (
                      <div className="w-0.5 h-12 bg-white/10 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-text-primary">{event.title}</h4>
                      <span className="text-xs px-2 py-1 bg-primary-500/20 text-primary-400 rounded">
                        {event.type}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mb-2">{event.description}</p>
                    <div className="flex items-center gap-4 text-xs text-text-muted">
                      <span>{event.startDate.toLocaleDateString()}</span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text-primary">Tasks</h2>
              <Button className="btn-primary">
                <Plus size={16} className="mr-2" />
                Add Task
              </Button>
            </div>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-surface-light/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(task.status)}
                    <div>
                      <h4 className="font-medium text-text-primary">{task.title}</h4>
                      <p className="text-sm text-text-secondary">{task.description}</p>
                      <p className="text-xs text-text-muted mt-1">
                        Due: {task.dueDate?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`priority-badge ${task.priority}`}>
                      {task.priority}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Edit size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'communications' && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-6">Communications</h2>
            <div className="space-y-4">
              <div className="text-center py-8">
                <MessageSquare size={48} className="mx-auto mb-4 text-text-muted" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  No communications yet
                </h3>
                <p className="text-text-secondary">
                  Start a conversation with your client or team members
                </p>
                <Button className="btn-primary mt-4">
                  <MessageSquare size={16} className="mr-2" />
                  Start Conversation
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 