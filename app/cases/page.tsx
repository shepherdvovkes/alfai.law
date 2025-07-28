'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Calendar,
  DollarSign,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Case } from '@/types'

export default function CasesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')

  const [cases] = useState<Case[]>([
    {
      id: '1',
      caseNumber: '2024-001',
      title: 'Smith vs. Johnson',
      description: 'Contract dispute regarding software licensing agreement',
      clientId: '1',
      status: 'active',
      priority: 'high',
      type: 'civil',
      court: 'District Court',
      judge: 'Judge Williams',
      amount: 50000,
      currency: 'USD',
      startDate: new Date('2024-01-15'),
      deadline: new Date('2024-03-15'),
      assignedTo: ['1'],
      tags: ['contract', 'dispute', 'software'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '2',
      caseNumber: '2024-002',
      title: 'Brown Estate',
      description: 'Probate proceedings for estate administration',
      clientId: '2',
      status: 'pending',
      priority: 'medium',
      type: 'family',
      court: 'Probate Court',
      judge: 'Judge Davis',
      amount: 250000,
      currency: 'USD',
      startDate: new Date('2024-01-20'),
      deadline: new Date('2024-04-20'),
      assignedTo: ['1'],
      tags: ['probate', 'estate', 'family'],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '3',
      caseNumber: '2024-003',
      title: 'Wilson Corporation',
      description: 'Employment discrimination lawsuit',
      clientId: '3',
      status: 'active',
      priority: 'urgent',
      type: 'civil',
      court: 'Federal Court',
      judge: 'Judge Thompson',
      amount: 150000,
      currency: 'USD',
      startDate: new Date('2024-01-10'),
      deadline: new Date('2024-02-28'),
      assignedTo: ['1', '2'],
      tags: ['employment', 'discrimination', 'federal'],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18')
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'status-active'
      case 'pending': return 'status-pending'
      case 'closed': return 'status-closed'
      case 'archived': return 'status-closed'
      default: return 'status-closed'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'priority-low'
      case 'medium': return 'priority-medium'
      case 'high': return 'priority-high'
      case 'urgent': return 'priority-urgent'
      default: return 'priority-low'
    }
  }

  const getDaysUntilDeadline = (deadline: Date) => {
    const today = new Date()
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caseItem.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || caseItem.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || caseItem.priority === selectedPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Case Management</h1>
            <p className="text-text-secondary mt-1">
              Manage your active cases and track their progress
            </p>
          </div>
          <Button>
            <Plus size={16} className="mr-2" />
            New Case
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="glass-card p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search cases by title, number, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search size={18} />}
              />
            </div>
            <div className="flex gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input-field min-w-[120px]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="closed">Closed</option>
                <option value="archived">Archived</option>
              </select>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="input-field min-w-[120px]"
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cases Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-dark/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">Case</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">Priority</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">Court</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">Deadline</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredCases.map((caseItem) => {
                  const daysUntilDeadline = getDaysUntilDeadline(caseItem.deadline!)
                  const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline > 0
                  const isOverdue = daysUntilDeadline < 0
                  
                  return (
                    <motion.tr
                      key={caseItem.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-surface-dark/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                              <FileText className="text-primary-400" size={20} />
                            </div>
                            <div>
                              <h3 className="font-medium text-text-primary">{caseItem.title}</h3>
                              <p className="text-sm text-text-secondary">#{caseItem.caseNumber}</p>
                            </div>
                          </div>
                          <p className="text-sm text-text-muted mt-1 max-w-xs truncate">
                            {caseItem.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`status-badge ${getStatusColor(caseItem.status)}`}>
                          {caseItem.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`priority-badge ${getPriorityColor(caseItem.priority)}`}>
                          {caseItem.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-text-primary">{caseItem.court}</p>
                          <p className="text-xs text-text-muted">{caseItem.judge}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <DollarSign size={16} className="text-text-muted" />
                          <span className="text-text-primary">
                            {caseItem.amount?.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} className="text-text-muted" />
                          <div>
                            <p className="text-sm text-text-primary">
                              {caseItem.deadline?.toLocaleDateString()}
                            </p>
                            {isOverdue ? (
                              <p className="text-xs text-accent-red">Overdue</p>
                            ) : isUrgent ? (
                              <p className="text-xs text-accent-orange">{daysUntilDeadline} days left</p>
                            ) : (
                              <p className="text-xs text-text-muted">{daysUntilDeadline} days left</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical size={16} />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <FileText className="text-primary-400" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{cases.length}</p>
                <p className="text-sm text-text-secondary">Total Cases</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent-green/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-accent-green" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {cases.filter(c => c.status === 'active').length}
                </p>
                <p className="text-sm text-text-secondary">Active Cases</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent-orange/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-accent-orange" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {cases.filter(c => getDaysUntilDeadline(c.deadline!) <= 7 && getDaysUntilDeadline(c.deadline!) > 0).length}
                </p>
                <p className="text-sm text-text-secondary">Urgent Deadlines</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent-red/20 rounded-lg flex items-center justify-center">
                <Clock className="text-accent-red" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {cases.filter(c => getDaysUntilDeadline(c.deadline!) < 0).length}
                </p>
                <p className="text-sm text-text-secondary">Overdue</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
} 