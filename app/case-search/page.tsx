'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Calendar, User, FileText, MapPin, Clock, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Case, SearchResult } from '@/types'

export default function CaseSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    status: '',
    type: '',
    dateRange: '',
    assignedTo: '',
    priority: '',
  })
  const [showFilters, setShowFilters] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Smith vs. Johnson - Contract Dispute',
      type: 'Civil Litigation',
      status: 'Active',
      priority: 'High',
      assignedTo: 'John Doe',
      client: 'Robert Smith',
      lastUpdated: new Date('2024-01-15'),
      progress: 75,
      description: 'Contract dispute regarding software development services',
      tags: ['Contract', 'Software', 'Dispute'],
    },
    {
      id: '2',
      title: 'Corporate Merger - Tech Solutions Inc.',
      type: 'Corporate Law',
      status: 'Pending',
      priority: 'Medium',
      assignedTo: 'Jane Smith',
      client: 'Tech Solutions Inc.',
      lastUpdated: new Date('2024-01-14'),
      progress: 45,
      description: 'Merger and acquisition of two technology companies',
      tags: ['Merger', 'Corporate', 'Technology'],
    },
    {
      id: '3',
      title: 'Patent Infringement - Mobile App',
      type: 'Intellectual Property',
      status: 'Active',
      priority: 'High',
      assignedTo: 'John Doe',
      client: 'Innovation Labs',
      lastUpdated: new Date('2024-01-13'),
      progress: 30,
      description: 'Patent infringement case involving mobile application',
      tags: ['Patent', 'Technology', 'Infringement'],
    },
  ]

  const handleSearch = () => {
    // Simulate search
    setSearchResults(mockResults.filter(result => 
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (result.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    ))
  }

  const handleFilterChange = (filter: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filter]: value
    }))
  }

  const clearFilters = () => {
    setSelectedFilters({
      status: '',
      type: '',
      dateRange: '',
      assignedTo: '',
      priority: '',
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Case Search</h1>
          <p className="text-text-secondary">Find and manage your legal cases efficiently</p>
        </div>
        <Button className="btn-primary">
          <FileText size={18} className="mr-2" />
          New Case
        </Button>
      </div>

      {/* Search Bar */}
      <div className="glass-card p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Search cases by title, client, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={18} />}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} className="btn-primary">
            Search
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter size={18} />
            Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t border-white/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Status
                </label>
                <select
                  value={selectedFilters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="input-field w-full"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Case Type
                </label>
                <select
                  value={selectedFilters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="input-field w-full"
                >
                  <option value="">All Types</option>
                  <option value="civil">Civil Litigation</option>
                  <option value="corporate">Corporate Law</option>
                  <option value="criminal">Criminal Law</option>
                  <option value="family">Family Law</option>
                  <option value="ip">Intellectual Property</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Date Range
                </label>
                <select
                  value={selectedFilters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="input-field w-full"
                >
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Assigned To
                </label>
                <select
                  value={selectedFilters.assignedTo}
                  onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
                  className="input-field w-full"
                >
                  <option value="">All Lawyers</option>
                  <option value="john">John Doe</option>
                  <option value="jane">Jane Smith</option>
                  <option value="mike">Mike Johnson</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Priority
                </label>
                <select
                  value={selectedFilters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="input-field w-full"
                >
                  <option value="">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button onClick={handleSearch} className="btn-primary">
                Apply Filters
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">
            Search Results ({searchResults.length})
          </h2>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span>Sort by:</span>
            <select className="bg-transparent border-none text-text-primary">
              <option>Relevance</option>
              <option>Date</option>
              <option>Priority</option>
              <option>Status</option>
            </select>
          </div>
        </div>

        {searchResults.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Search size={48} className="mx-auto mb-4 text-text-muted" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No cases found
            </h3>
            <p className="text-text-secondary">
              Try adjusting your search criteria or filters
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {searchResults.map((result) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 hover:bg-surface-light/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-text-primary">
                        {result.title}
                      </h3>
                      <span className={`status-badge ${(result.status || 'unknown').toLowerCase()}`}>
                        {result.status || 'Unknown'}
                      </span>
                      <span className={`priority-badge ${(result.priority || 'low').toLowerCase()}`}>
                        {result.priority || 'Low'}
                      </span>
                    </div>
                    
                    <p className="text-text-secondary mb-3">
                      {result.description}
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm text-text-muted">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{result.assignedTo}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{result.lastUpdated?.toLocaleDateString() || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{result.progress}% Complete</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3">
                      {(result.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye size={16} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <FileText size={16} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 