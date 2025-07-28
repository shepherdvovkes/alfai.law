'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, ChevronDown, Check, Globe } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { t } from '@/lib/translations'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'

interface LanguageThemeSwitcherProps {
  variant?: 'compact' | 'full'
  className?: string
}

export default function LanguageThemeSwitcher({ variant = 'full', className = '' }: LanguageThemeSwitcherProps) {
  const { language, setLanguage, theme, setTheme } = useApp()
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showThemeMenu, setShowThemeMenu] = useState(false)

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.language-menu') && !target.closest('.theme-menu')) {
        setShowLanguageMenu(false)
        setShowThemeMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const languages = [
    { code: 'en', name: 'English', flag: 'EN' },
    { code: 'uk', name: 'Українська', flag: 'UK' },
    { code: 'ru', name: 'Русский', flag: 'RU' },
    { code: 'de', name: 'Deutsch', flag: 'DE' },
    { code: 'fr', name: 'Français', flag: 'FR' }
  ]

  const themes = [
    { 
      id: 'dark-blue', 
      name: t('darkBlue', language), 
      colors: ['#0A0E1A', '#0066FF', '#1E2438'],
      preview: 'bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700',
      primaryColor: 'bg-blue-500'
    },
    { 
      id: 'dark-purple', 
      name: t('darkPurple', language), 
      colors: ['#0A0E1A', '#8B5CF6', '#1E1B4B'],
      preview: 'bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700',
      primaryColor: 'bg-purple-500'
    },
    { 
      id: 'dark-green', 
      name: t('darkGreen', language), 
      colors: ['#0A0E1A', '#10B981', '#064E3B'],
      preview: 'bg-gradient-to-br from-green-900 via-green-800 to-green-700',
      primaryColor: 'bg-green-500'
    },
    { 
      id: 'dark-red', 
      name: t('darkRed', language), 
      colors: ['#0A0E1A', '#EF4444', '#7F1D1D'],
      preview: 'bg-gradient-to-br from-red-900 via-red-800 to-red-700',
      primaryColor: 'bg-red-500'
    },
    { 
      id: 'dark-orange', 
      name: t('darkOrange', language), 
      colors: ['#0A0E1A', '#F97316', '#7C2D12'],
      preview: 'bg-gradient-to-br from-orange-900 via-orange-800 to-orange-700',
      primaryColor: 'bg-orange-500'
    }
  ]

  const currentLanguage = languages.find(lang => lang.code === language)
  const currentTheme = themes.find(t => t.id === theme)

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {/* Language Switcher */}
        <LanguageSwitcher variant="compact" />

        {/* Theme Switcher */}
        <div className="relative theme-menu">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-surface-light/30 hover:bg-surface-light/50 transition-colors"
          >
            <div className={`w-4 h-4 rounded-full ${currentTheme?.primaryColor}`} />
            <span className="text-sm text-text-primary">{currentTheme?.name}</span>
            <ChevronDown size={14} className="text-text-secondary" />
          </button>

          <AnimatePresence>
            {showThemeMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-64 bg-surface-light border border-white/10 rounded-lg shadow-glass z-50"
              >
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => {
                      setTheme(themeOption.id as any)
                      setShowThemeMenu(false)
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-surface-dark/50 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg ${themeOption.preview}`} />
                    <span className="text-text-primary">{themeOption.name}</span>
                    {theme === themeOption.id && <Check size={16} className="text-primary-400 ml-auto" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Language Settings */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
          <Globe size={20} className="mr-2" />
          {t('languageSettings', language)}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code as any)}
              className={`p-4 rounded-lg border-2 transition-all ${
                language === lang.code
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-white/10 bg-surface-light/30 hover:border-white/20 hover:bg-surface-light/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-primary-400">{lang.flag}</span>
                <div className="text-left">
                  <p className="font-medium text-text-primary">{lang.name}</p>
                  <p className="text-sm text-text-secondary">{lang.code.toUpperCase()}</p>
                </div>
                {language === lang.code && (
                  <Check size={20} className="text-primary-400 ml-auto" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Theme Settings */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
          <Palette size={20} className="mr-2" />
          {t('themeSettings', language)}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((themeOption) => (
            <button
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id as any)}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === themeOption.id
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-white/10 bg-surface-light/30 hover:border-white/20 hover:bg-surface-light/50'
              }`}
            >
              <div className="space-y-3">
                <div className={`w-full h-16 rounded-lg ${themeOption.preview}`} />
                <div className="flex items-center justify-between">
                  <span className="font-medium text-text-primary">{themeOption.name}</span>
                  {theme === themeOption.id && (
                    <Check size={20} className="text-primary-400" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 