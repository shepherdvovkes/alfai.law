'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'en' | 'uk' | 'ru' | 'de' | 'fr'
export type Theme = 'dark-blue' | 'dark-purple' | 'dark-green' | 'dark-red' | 'dark-orange'

interface AppContextType {
  language: Language
  setLanguage: (lang: Language) => void
  theme: Theme
  setTheme: (theme: Theme) => void
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [language, setLanguage] = useState<Language>('en')
  const [theme, setTheme] = useState<Theme>('dark-blue')
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [updateKey, setUpdateKey] = useState(0)

  useEffect(() => {
    // Load settings from localStorage
    const savedLanguage = localStorage.getItem('app-language') as Language
    const savedTheme = localStorage.getItem('app-theme') as Theme
    const savedDarkMode = localStorage.getItem('app-dark-mode')

    if (savedLanguage) setLanguage(savedLanguage)
    if (savedTheme) setTheme(savedTheme)
    if (savedDarkMode !== null) setIsDarkMode(savedDarkMode === 'true')

    // Apply theme to document
    const themeToApply = savedTheme || 'dark-blue'
    applyTheme(themeToApply)
    setIsInitialized(true)
  }, [])

  const applyTheme = (newTheme: Theme) => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      
      // Remove all theme classes
      root.classList.remove('theme-dark-blue', 'theme-dark-purple', 'theme-dark-green', 'theme-dark-red', 'theme-dark-orange')
      
      // Add new theme class
      root.classList.add(`theme-${newTheme}`)
      
      // Theme applied successfully
    }
  }

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('app-language', lang)
    setUpdateKey(prev => prev + 1)
    // Language changed successfully
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('app-theme', newTheme)
    setUpdateKey(prev => prev + 1)
    // Theme changed successfully
  }

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('app-dark-mode', newDarkMode.toString())
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <AppContext.Provider value={{
      language,
      setLanguage: handleLanguageChange,
      theme,
      setTheme: handleThemeChange,
      isDarkMode,
      toggleDarkMode
    }}>
      <div key={updateKey}>
        {isInitialized ? children : <div className="min-h-screen bg-surface-dark" />}
      </div>
    </AppContext.Provider>
  )
} 