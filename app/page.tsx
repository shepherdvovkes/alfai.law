'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  
  useEffect(() => {
    // Check if user is authenticated (in a real app, this would check localStorage, cookies, or API)
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    
    if (isAuthenticated) {
      router.replace('/dashboard')
    } else {
      router.replace('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-surface-dark flex items-center justify-center">
      <div className="text-center">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-text-secondary">Loading Legal AI System...</p>
      </div>
    </div>
  )
} 