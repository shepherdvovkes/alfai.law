'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useApp } from '@/contexts/AppContext'

interface ThemeProviderProps {
  children: ReactNode
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { language, theme } = useApp()
  const [key, setKey] = useState(0)

  useEffect(() => {
    // Force re-render when language or theme changes
    setKey(prev => prev + 1)
  }, [language, theme])

  return (
    <div key={key} className={`theme-${theme}`}>
      {children}
    </div>
  )
} 