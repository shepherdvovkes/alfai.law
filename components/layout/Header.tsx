'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/components/providers/AuthProvider'
import toast from 'react-hot-toast'
import LanguageThemeSwitcher from '@/components/settings/LanguageThemeSwitcher'

interface HeaderProps {
  onSidebarToggle: () => void
  isSidebarCollapsed: boolean
}

export default function Header({ onSidebarToggle, isSidebarCollapsed }: HeaderProps) {
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  // Get user info from auth context
  const getUserInfo = () => {
    if (user) {
      return {
        name: user.name,
        email: user.email,
        role: user.position || 'User',
        firm: user.firm || 'Legal AI System'
      }
    }
    return {
      name: 'Guest',
      email: 'guest@example.com',
      role: 'Guest',
      firm: 'Legal AI System'
    }
  }

  const userInfo = getUserInfo()

  const notifications = [
    {
      id: 1,
      title: 'New case assigned',
      message: 'Case #2024-001 has been assigned to you',
      time: '2 minutes ago',
      type: 'info' as const
    },
    {
      id: 2,
      title: 'Document ready',
      message: 'Contract for Smith case is ready for review',
      time: '1 hour ago',
      type: 'success' as const
    },
    {
      id: 3,
      title: 'Court deadline',
      message: 'Filing deadline for Johnson case is tomorrow',
      time: '3 hours ago',
      type: 'warning' as const
    }
  ]

  const unreadCount = notifications.length

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      window.location.href = '/login'
    } catch (error) {
      toast.error('An error occurred during logout')
      window.location.href = '/login'
    }
  }

  return (
    <header className="bg-surface-medium border-b border-white/10 px-6 py-4 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onSidebarToggle}
          className="p-2 rounded-lg hover:bg-surface-light/50 transition-colors"
        >
          {isSidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
        
        {/* Search */}
        <div className="relative w-96">
          <Input
            placeholder="Search cases, documents, clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search size={18} />}
            className="w-full"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Language & Theme Switcher */}
        <LanguageThemeSwitcher variant="compact" />
        
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-surface-light/50 transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-red text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-80 bg-surface-light border border-white/10 rounded-lg shadow-glass z-50"
              >
                <div className="p-4 border-b border-white/10">
                  <h3 className="font-semibold text-text-primary">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 border-b border-white/10 hover:bg-surface-dark/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'success' ? 'bg-accent-green' :
                          notification.type === 'warning' ? 'bg-accent-orange' :
                          'bg-primary-500'
                        }`} />
                        <div className="flex-1">
                          <h4 className="font-medium text-text-primary text-sm">
                            {notification.title}
                          </h4>
                          <p className="text-text-secondary text-sm mt-1">
                            {notification.message}
                          </p>
                          <p className="text-text-muted text-xs mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-white/10">
                  <Button variant="ghost" className="w-full text-sm">
                    View all notifications
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-surface-light/50 transition-colors"
          >
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-text-primary">{userInfo.name}</p>
              <p className="text-xs text-text-secondary">{userInfo.role}</p>
            </div>
            <ChevronDown size={16} className="text-text-secondary" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-48 bg-surface-light border border-white/10 rounded-lg shadow-glass z-50"
              >
                <div className="p-4 border-b border-white/10">
                  <p className="font-medium text-text-primary">{userInfo.name}</p>
                  <p className="text-sm text-text-secondary">{userInfo.email}</p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-dark/50 rounded-lg transition-colors">
                    <User size={16} />
                    <span>Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-dark/50 rounded-lg transition-colors">
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                  <div className="border-t border-white/10 my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-accent-red hover:bg-accent-red/10 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
} 