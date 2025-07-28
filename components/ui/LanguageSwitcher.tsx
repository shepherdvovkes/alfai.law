'use client'

import React, { useState } from 'react'
import { ChevronDown, Globe, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '@/contexts/AppContext'
import { cn } from '@/lib/utils'

interface LanguageOption {
  code: string
  name: string
  nativeName: string
  flag: string
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: 'EN' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: 'UK' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: 'RU' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: 'DE' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: 'FR' },
]

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact' | 'minimal'
  className?: string
  showFlags?: boolean
  showNativeNames?: boolean
}

export default function LanguageSwitcher({ 
  variant = 'default', 
  className,
  showFlags = true,
  showNativeNames = false
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useApp()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0]

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as any)
    setIsOpen(false)
  }

  const getDisplayName = (lang: LanguageOption) => {
    if (showNativeNames) {
      return lang.nativeName
    }
    return lang.name
  }

  const variants = {
    default: {
      button: "flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-light hover:bg-surface-light/80 transition-colors",
      dropdown: "absolute top-full right-0 mt-2 w-48 bg-surface-medium border border-white/10 rounded-lg shadow-lg z-50",
      item: "flex items-center gap-3 px-3 py-2 hover:bg-surface-light transition-colors cursor-pointer"
    },
    compact: {
      button: "flex items-center gap-1 px-2 py-1 rounded-md bg-surface-light hover:bg-surface-light/80 transition-colors text-sm",
      dropdown: "absolute top-full right-0 mt-1 w-40 bg-surface-medium border border-white/10 rounded-md shadow-lg z-50",
      item: "flex items-center gap-2 px-2 py-1 hover:bg-surface-light transition-colors cursor-pointer text-sm"
    },
    minimal: {
      button: "flex items-center gap-1 hover:text-primary-400 transition-colors",
      dropdown: "absolute top-full right-0 mt-1 w-36 bg-surface-medium border border-white/10 rounded-md shadow-lg z-50",
      item: "flex items-center gap-2 px-2 py-1 hover:bg-surface-light transition-colors cursor-pointer text-sm"
    }
  }

  const currentVariant = variants[variant]

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(currentVariant.button, "focus:outline-none focus:ring-2 focus:ring-primary-500")}
        aria-label="Select language"
      >
        {variant === 'minimal' ? (
          <Globe size={16} />
        ) : (
          <>
            {showFlags && <span className="text-sm font-medium text-primary-400">{currentLanguage.flag}</span>}
            <span className="text-text-primary">
              {variant === 'compact' ? currentLanguage.code.toUpperCase() : getDisplayName(currentLanguage)}
            </span>
            <ChevronDown size={14} className="text-text-muted" />
          </>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={currentVariant.dropdown}
          >
            {languages.map((lang) => (
              <div
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={cn(
                  currentVariant.item,
                  lang.code === language && "bg-primary-500/10 text-primary-400"
                )}
              >
                {showFlags && <span className="text-sm font-medium text-primary-400">{lang.flag}</span>}
                <span className="flex-1 text-left">
                  {getDisplayName(lang)}
                </span>
                {lang.code === language && (
                  <Check size={14} className="text-primary-400" />
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
} 