'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Plus, 
  User, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Eye, 
  MessageSquare,
  Star,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Client } from '@/types'

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Mock clients data
  const clients: Client[] = [
    {
      id: '1',
      name: 'Robert Smith',
      email: 'robert.smith@techstart.com',
      phone: '+1 (555) 123-4567',
      type: 'individual',
      address: '123 Main Street, San Francisco, CA 94102',
      company: 'TechStart Inc.',
      position: 'CEO',
      notes: 'High-value client, prefers email communication. Interested in IP protection.',
      avatar: '/avatars/robert.jpg',
      tags: ['Technology', 'Startup', 'VIP', 'IP Law'],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@legalfirm.com',
      phone: '+1 (555) 234-5678',
      type: 'corporate',
      address: '456 Business Ave, New York, NY 10001',
      company: 'Legal Solutions LLC',
      position: 'General Counsel',
      notes: 'Corporate client with multiple ongoing cases. Requires regular updates.',
      avatar: '/avatars/sarah.jpg',
      tags: ['Corporate', 'Legal', 'Regular Client'],
      createdAt: new Date('2023-12-15'),
      updatedAt: new Date('2024-01-12'),
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael.chen@innovate.com',
      phone: '+1 (555) 345-6789',
      type: 'individual',
      address: '789 Innovation Dr, Austin, TX 73301',
      company: 'Innovate Labs',
      position: 'Founder',
      notes: 'Startup founder seeking patent protection and corporate structure advice.',
      avatar: '/avatars/michael.jpg',
      tags: ['Startup', 'Patent', 'Corporate'],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-18'),
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@family.com',
      phone: '+1 (555) 456-7890',
      type: 'individual',
      address: '321 Family Lane, Chicago, IL 60601',
      company: '',
      position: '',
      notes: 'Family law client. Going through divorce proceedings.',
      avatar: '/avatars/emily.jpg',
      tags: ['Family Law', 'Divorce', 'Sensitive'],
      createdAt: new Date('2023-11-20'),
      updatedAt: new Date('2024-01-10'),
    },
    {
      id: '5',
      name: 'David Wilson',
      email: 'david.wilson@realestate.com',
      phone: '+1 (555) 567-8901',
      type: 'corporate',
      address: '654 Property Blvd, Miami, FL 33101',
      company: 'Wilson Real Estate Group',
      position: 'Managing Partner',
      notes: 'Real estate development company. Multiple property transactions.',
      avatar: '/avatars/david.jpg',
      tags: ['Real Estate', 'Corporate', 'High Volume'],
      createdAt: new Date('2023-10-15'),
      updatedAt: new Date('2024-01-08'),
    },
    {
      id: '6',
      name: 'Lisa Brown',
      email: 'lisa.brown@healthcare.com',
      phone: '+1 (555) 678-9012',
      type: 'corporate',
      address: '987 Medical Center Dr, Boston, MA 02101',
      company: 'Healthcare Solutions Inc.',
      position: 'Legal Director',
      notes: 'Healthcare compliance and regulatory matters. Complex legal requirements.',
      avatar: '/avatars/lisa.jpg',
      tags: ['Healthcare', 'Compliance', 'Regulatory'],
      createdAt: new Date('2023-09-10'),
      updatedAt: new Date('2024-01-05'),
    },
  ]

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = selectedFilter === 'all' || client.type === selectedFilter
    
    return matchesSearch && matchesFilter
  })

  const getClientTypeIcon = (type: string) => {
    return type === 'corporate' ? <Building size={16} /> : <User size={16} />
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Client Management</h1>
          <p className="text-text-secondary">Manage your client relationships and information</p>
        </div>
        <Button className="btn-primary">
          <Plus size={18} className="mr-2" />
          Add Client
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search clients by name, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={18} />}
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Clients</option>
              <option value="individual">Individual</option>
              <option value="corporate">Corporate</option>
            </select>
            <div className="flex items-center gap-1 bg-surface-light/30 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary-500 text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-500 text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <div className="w-4 h-4 space-y-0.5">
                  <div className="w-full h-0.5 bg-current rounded-sm"></div>
                  <div className="w-full h-0.5 bg-current rounded-sm"></div>
                  <div className="w-full h-0.5 bg-current rounded-sm"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Client Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">
          Clients ({filteredClients.length})
        </h2>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span>Sort by:</span>
          <select className="bg-transparent border-none text-text-primary">
            <option>Name</option>
            <option>Company</option>
            <option>Date Added</option>
            <option>Last Contact</option>
          </select>
        </div>
      </div>

      {/* Clients Grid/List */}
      {filteredClients.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <User size={48} className="mx-auto mb-4 text-text-muted" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            No clients found
          </h3>
          <p className="text-text-secondary">
            Try adjusting your search criteria or add a new client
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 hover:bg-surface-light/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
                    {client.avatar ? (
                      <img src={client.avatar} alt={client.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-primary-400 font-semibold">{getInitials(client.name)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">{client.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-text-secondary">
                      {getClientTypeIcon(client.type)}
                      <span>{client.type === 'corporate' ? 'Corporate' : 'Individual'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {client.tags.includes('VIP') && (
                    <Star size={16} className="text-accent-orange" />
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={14} className="text-text-muted" />
                  <span className="text-text-secondary">{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={14} className="text-text-muted" />
                    <span className="text-text-secondary">{client.phone}</span>
                  </div>
                )}
                {client.company && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building size={14} className="text-text-muted" />
                    <span className="text-text-secondary">{client.company}</span>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={14} className="text-text-muted" />
                    <span className="text-text-secondary truncate">{client.address}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {client.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
                {client.tags.length > 3 && (
                  <span className="px-2 py-1 bg-surface-light/50 text-text-muted text-xs rounded">
                    +{client.tags.length - 3}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-text-muted">
                  Added {client.createdAt.toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 font-medium text-text-secondary">Client</th>
                  <th className="text-left p-4 font-medium text-text-secondary">Contact</th>
                  <th className="text-left p-4 font-medium text-text-secondary">Company</th>
                  <th className="text-left p-4 font-medium text-text-secondary">Type</th>
                  <th className="text-left p-4 font-medium text-text-secondary">Tags</th>
                  <th className="text-left p-4 font-medium text-text-secondary">Added</th>
                  <th className="text-left p-4 font-medium text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-b border-white/5 hover:bg-surface-light/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center">
                          {client.avatar ? (
                            <img src={client.avatar} alt={client.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="text-primary-400 text-xs font-semibold">{getInitials(client.name)}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-text-primary">{client.name}</div>
                          {client.position && (
                            <div className="text-sm text-text-secondary">{client.position}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="text-sm text-text-primary">{client.email}</div>
                        {client.phone && (
                          <div className="text-sm text-text-secondary">{client.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-text-primary">{client.company || '-'}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {getClientTypeIcon(client.type)}
                        <span className="text-sm text-text-secondary capitalize">{client.type}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {client.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {client.tags.length > 2 && (
                          <span className="px-2 py-1 bg-surface-light/50 text-text-muted text-xs rounded">
                            +{client.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-text-secondary">
                        {client.createdAt.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
} 