'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from './Sidebar'
import Header from './Header'
import { useAuth } from '@/components/providers/AuthProvider'
import toast from 'react-hot-toast'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    console.log('AppLayout: Auth state changed - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated)
    
    // Check authentication using AuthProvider state
    if (!isLoading && !isAuthenticated) {
      console.log('AppLayout: User not authenticated, checking for demo user...')
      // Check for demo user as fallback
      const demoUser = localStorage.getItem('demoUser')
      const demoAuth = localStorage.getItem('isAuthenticated')
      
      if (!(demoUser && demoAuth === 'true')) {
        console.log('AppLayout: No demo user found, redirecting to login')
        router.replace('/login')
      } else {
        console.log('AppLayout: Demo user found, allowing access')
      }
    } else if (isAuthenticated) {
      console.log('AppLayout: User is authenticated, allowing access')
    }
  }, [isLoading, isAuthenticated, router])

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className="min-h-screen bg-surface-dark flex">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={toggleSidebar} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header 
          onSidebarToggle={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
} 