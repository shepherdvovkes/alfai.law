'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  MessageSquare, 
  FileText, 
  Calendar,
  TrendingUp,
  Users,
  FolderOpen,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Analytics, Case, Task, Event } from '@/types'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  const [analytics] = useState<Analytics>({
    totalCases: 24,
    activeCases: 18,
    completedCases: 6,
    totalClients: 15,
    totalRevenue: 125000,
    aiQueriesUsed: 156,
    documentsGenerated: 89,
    successRate: 85,
    averageCaseDuration: 45
  })

  const [recentCases] = useState<Case[]>([
    {
      id: '1',
      caseNumber: '2024-001',
      title: 'Smith vs. Johnson',
      description: 'Contract dispute',
      clientId: '1',
      status: 'active',
      priority: 'high',
      type: 'civil',
      court: 'District Court',
      amount: 50000,
      currency: 'USD',
      startDate: new Date('2024-01-15'),
      deadline: new Date('2024-03-15'),
      assignedTo: ['1'],
      tags: ['contract', 'dispute'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '2',
      caseNumber: '2024-002',
      title: 'Brown Estate',
      description: 'Probate proceedings',
      clientId: '2',
      status: 'pending',
      priority: 'medium',
      type: 'family',
      court: 'Probate Court',
      amount: 250000,
      currency: 'USD',
      startDate: new Date('2024-01-20'),
      deadline: new Date('2024-04-20'),
      assignedTo: ['1'],
      tags: ['probate', 'estate'],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    }
  ])

  const [upcomingEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Court Hearing - Smith Case',
      description: 'Initial hearing for contract dispute',
      type: 'court-hearing',
      startDate: new Date('2024-01-25T10:00:00'),
      endDate: new Date('2024-01-25T11:00:00'),
      allDay: false,
      location: 'District Court Room 3',
      caseId: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Client Meeting - Brown',
      description: 'Review estate documents',
      type: 'meeting',
      startDate: new Date('2024-01-26T14:00:00'),
      endDate: new Date('2024-01-26T15:00:00'),
      allDay: false,
      location: 'Conference Room A',
      caseId: '2',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])

  const [recentTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Review contract terms',
      description: 'Analyze contract for Smith case',
      status: 'todo',
      priority: 'high',
      caseId: '1',
      dueDate: new Date('2024-01-23'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Prepare court filing',
      description: 'Draft motion for Brown estate',
      status: 'in-progress',
      priority: 'medium',
      caseId: '2',
      dueDate: new Date('2024-01-24'),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center">
        <div className="text-text-primary">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'status-active'
      case 'pending': return 'status-pending'
      case 'completed': return 'status-closed'
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

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Welcome back, {user?.name || 'User'}
            </h1>
            <p className="text-text-secondary mt-1">
              Here's what's happening with your cases today
            </p>
          </div>
          <div className="flex space-x-3">
            <Button>
              <Plus size={16} className="mr-2" />
              New Case
            </Button>
            <Button variant="secondary">
              <MessageSquare size={16} className="mr-2" />
              AI Query
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6 cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <Plus className="text-primary-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">New Case</h3>
                <p className="text-sm text-text-secondary">Create a new case</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6 cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-accent-green/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="text-accent-green" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">AI Query</h3>
                <p className="text-sm text-text-secondary">Ask AI assistant</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6 cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-accent-orange/20 rounded-lg flex items-center justify-center">
                <FileText className="text-accent-orange" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Generate Doc</h3>
                <p className="text-sm text-text-secondary">Create document</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6 cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="text-primary-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Schedule</h3>
                <p className="text-sm text-text-secondary">Book meeting</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Total Cases</p>
                <p className="text-2xl font-bold text-text-primary">{analytics.totalCases}</p>
              </div>
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <FolderOpen className="text-primary-400" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="text-accent-green mr-1" size={16} />
              <span className="text-accent-green">+12%</span>
              <span className="text-text-muted ml-1">from last month</span>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Active Cases</p>
                <p className="text-2xl font-bold text-text-primary">{analytics.activeCases}</p>
              </div>
              <div className="w-12 h-12 bg-accent-green/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-accent-green" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-text-muted">{analytics.successRate}% success rate</span>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-text-primary">${analytics.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-accent-orange/20 rounded-lg flex items-center justify-center">
                <DollarSign className="text-accent-orange" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="text-accent-green mr-1" size={16} />
              <span className="text-accent-green">+8%</span>
              <span className="text-text-muted ml-1">from last month</span>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">AI Queries</p>
                <p className="text-2xl font-bold text-text-primary">{analytics.aiQueriesUsed}</p>
              </div>
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="text-primary-400" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-text-muted">This month</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Cases */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">Active Cases</h2>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentCases.map((caseItem) => (
                  <div key={caseItem.id} className="flex items-center justify-between p-4 bg-surface-dark/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-text-primary">{caseItem.title}</h3>
                        <span className={`status-badge ${getStatusColor(caseItem.status)}`}>
                          {caseItem.status}
                        </span>
                        <span className={`priority-badge ${getPriorityColor(caseItem.priority)}`}>
                          {caseItem.priority}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mt-1">{caseItem.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-text-muted">
                        <span>Case #{caseItem.caseNumber}</span>
                        <span>${caseItem.amount?.toLocaleString()}</span>
                        <span>Due: {caseItem.deadline?.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Today's Schedule */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Today's Schedule</h2>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 p-3 bg-surface-dark/50 rounded-lg">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2" />
                    <div className="flex-1">
                      <h4 className="font-medium text-text-primary text-sm">{event.title}</h4>
                      <p className="text-xs text-text-secondary mt-1">{event.description}</p>
                      <p className="text-xs text-text-muted mt-1">
                        {event.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {event.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Tasks */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Recent Tasks</h2>
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-3 p-3 bg-surface-dark/50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      task.status === 'completed' ? 'bg-accent-green' :
                      task.status === 'in-progress' ? 'bg-accent-orange' :
                      'bg-text-muted'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-text-primary text-sm">{task.title}</h4>
                      <p className="text-xs text-text-secondary mt-1">{task.description}</p>
                      <p className="text-xs text-text-muted mt-1">
                        Due: {task.dueDate?.toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
} 