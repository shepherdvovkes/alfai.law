'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Home, 
  BarChart3, 
  MessageSquare, 
  Search, 
  FileText, 
  Scale, 
  Users, 
  FolderOpen, 
  Calendar, 
  BookOpen, 
  PieChart, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  User,
  DollarSign,
  GitBranch,
  CheckSquare,
  Bell,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SidebarItem } from '@/types'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

const navigationItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'Home',
    href: '/dashboard',
    children: [
      { id: 'home', label: 'Home', icon: 'Home', href: '/dashboard' },
      { id: 'analytics', label: 'Analytics', icon: 'BarChart3', href: '/dashboard/analytics' }
    ]
  },
  {
    id: 'ai-analysis',
    label: 'AI Analysis',
    icon: 'MessageSquare',
    href: '/ai-assistant',
    children: [
      { id: 'ai-assistant', label: 'AI Assistant', icon: 'MessageSquare', href: '/ai-assistant' },
      { id: 'case-search', label: 'Case Search', icon: 'Search', href: '/case-search' },
      { id: 'document-generator', label: 'Document Generator', icon: 'FileText', href: '/document-generator' },
      { id: 'precedent-analysis', label: 'Precedent Analysis', icon: 'Scale', href: '/precedent-analysis' }
    ]
  },
  {
    id: 'case-management',
    label: 'Case Management',
    icon: 'FolderOpen',
    href: '/cases',
    children: [
      { id: 'active-cases', label: 'Active Cases', icon: 'FolderOpen', href: '/cases' },
      { id: 'case-details', label: 'Case Details', icon: 'FileText', href: '/cases/details' },
      { id: 'case-timeline', label: 'Case Timeline', icon: 'Calendar', href: '/cases/timeline' },
      { id: 'case-documents', label: 'Case Documents', icon: 'FileText', href: '/cases/documents' }
    ]
  },
  {
    id: 'client-management',
    label: 'Client Management',
    icon: 'Users',
    href: '/clients',
    children: [
      { id: 'client-directory', label: 'Client Directory', icon: 'Users', href: '/clients' },
      { id: 'client-profiles', label: 'Client Profiles', icon: 'User', href: '/clients/profiles' },
      { id: 'communication-log', label: 'Communication Log', icon: 'MessageSquare', href: '/clients/communications' },
      { id: 'billing-invoicing', label: 'Billing & Invoicing', icon: 'DollarSign', href: '/clients/billing' }
    ]
  },
  {
    id: 'document-management',
    label: 'Document Management',
    icon: 'FileText',
    href: '/document-generator',
    children: [
      { id: 'document-generator', label: 'Generate Documents', icon: 'FileText', href: '/document-generator' },
      { id: 'document-library', label: 'Document Library', icon: 'FolderOpen', href: '/document-library' }
    ]
  },
  {
    id: 'calendar-tasks',
    label: 'Calendar & Tasks',
    icon: 'Calendar',
    href: '/calendar',
    children: [
      { id: 'calendar-view', label: 'Calendar View', icon: 'Calendar', href: '/calendar' },
      { id: 'task-management', label: 'Task Management', icon: 'CheckSquare', href: '/tasks' },
      { id: 'reminders', label: 'Reminders', icon: 'Bell', href: '/reminders' },
      { id: 'court-schedule', label: 'Court Schedule', icon: 'Clock', href: '/court-schedule' }
    ]
  },
  {
    id: 'legal-research',
    label: 'Legal Research',
    icon: 'BookOpen',
    href: '/research',
    children: [
      { id: 'law-database', label: 'Law Database', icon: 'BookOpen', href: '/research/law-database' },
      { id: 'jurisprudence', label: 'Jurisprudence', icon: 'Scale', href: '/research/jurisprudence' },
      { id: 'legal-news', label: 'Legal News', icon: 'Newspaper', href: '/research/news' },
      { id: 'research-history', label: 'Research History', icon: 'History', href: '/research/history' }
    ]
  },
  {
    id: 'reports-analytics',
    label: 'Reports & Analytics',
    icon: 'PieChart',
    href: '/reports',
    children: [
      { id: 'performance-reports', label: 'Performance Reports', icon: 'BarChart3', href: '/reports/performance' },
      { id: 'financial-reports', label: 'Financial Reports', icon: 'DollarSign', href: '/reports/financial' },
      { id: 'case-success-rates', label: 'Case Success Rates', icon: 'TrendingUp', href: '/reports/success-rates' },
      { id: 'time-tracking', label: 'Time Tracking', icon: 'Clock', href: '/reports/time-tracking' }
    ]
  },
              {
              id: 'settings',
              label: 'Settings & Admin',
              icon: 'Settings',
              href: '/settings',
              children: [
                { id: 'profile-settings', label: 'Profile Settings', icon: 'User', href: '/profile' },
                { id: 'appearance-settings', label: 'Appearance & Language', icon: 'Palette', href: '/settings/appearance' },
                { id: 'firm-settings', label: 'Firm Settings', icon: 'Building', href: '/settings/firm' },
                { id: 'integration-settings', label: 'Integration Settings', icon: 'Link', href: '/settings/integrations' },
                { id: 'security-settings', label: 'Security Settings', icon: 'Shield', href: '/settings/security' }
              ]
            }
]

const iconMap: Record<string, React.ComponentType<any>> = {
  Home,
  BarChart3,
  MessageSquare,
  Search,
  FileText,
  Scale,
  Users,
  FolderOpen,
  Calendar,
  BookOpen,
  PieChart,
  Settings,
  User: Users,
  DollarSign: BarChart3,
  GitBranch: FileText,
  CheckSquare: Calendar,
  Bell: Calendar,
  Clock: Calendar,
  Newspaper: BookOpen,
  History: BookOpen,
  TrendingUp: BarChart3,
  Building: Users,
  Link: Settings,
  Shield: Settings
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard'])

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Home
    return <IconComponent size={20} />
  }

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="bg-surface-medium border-r border-white/10 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold gradient-text">
                Legal AI
              </h1>
              <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full font-medium">
                0.1 alpha
              </span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-surface-light/50 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navigationItems.map((item) => {
          const isExpanded = expandedItems.includes(item.id)
          const hasChildren = item.children && item.children.length > 0
          const isItemActive = isActive(item.href)

          return (
            <div key={item.id}>
              {/* Main Item */}
              <div className="relative">
                <Link
                  href={item.href}
                  className={cn(
                    'sidebar-item w-full',
                    isItemActive && 'active'
                  )}
                >
                  {renderIcon(item.icon)}
                  {!isCollapsed && (
                    <span className="flex-1">{item.label}</span>
                  )}
                  {hasChildren && !isCollapsed && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleExpanded(item.id)
                      }}
                      className="p-1 hover:bg-surface-light/50 rounded"
                    >
                      <ChevronRight 
                        size={16} 
                        className={cn(
                          'transition-transform',
                          isExpanded && 'rotate-90'
                        )}
                      />
                    </button>
                  )}
                </Link>
              </div>

                             {/* Children */}
               {hasChildren && isExpanded && !isCollapsed && item.children && (
                 <motion.div
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   className="ml-6 mt-2 space-y-1"
                 >
                   {item.children.map((child) => {
                     const isChildActive = isActive(child.href)
                     return (
                       <Link
                         key={child.id}
                         href={child.href}
                         className={cn(
                           'sidebar-item text-sm',
                           isChildActive && 'active'
                         )}
                       >
                         {renderIcon(child.icon)}
                         <span>{child.label}</span>
                       </Link>
                     )
                   })}
                 </motion.div>
               )}
            </div>
          )
        })}
      </nav>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-t border-white/10">
          <div className="space-y-2">
            <button className="w-full btn-primary text-sm">
              <Plus size={16} className="mr-2" />
              New Case
            </button>
            <button className="w-full btn-secondary text-sm">
              <MessageSquare size={16} className="mr-2" />
              AI Query
            </button>
          </div>
        </div>
      )}

      {/* Language Switcher */}
      <div className="p-4 border-t border-white/10">
        <LanguageSwitcher variant="compact" className="w-full" />
      </div>
    </motion.div>
  )
} 