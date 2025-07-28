'use client'

import { useApp } from '@/contexts/AppContext'
import { t } from '@/lib/translations'

export default function ThemeTest() {
  const { language, theme } = useApp()

  const getThemeColors = () => {
    switch (theme) {
      case 'dark-purple':
        return {
          primary: 'bg-purple-500',
          surface: 'bg-purple-900/20',
          text: 'text-purple-200',
          border: 'border-purple-500/20'
        }
      case 'dark-green':
        return {
          primary: 'bg-green-500',
          surface: 'bg-green-900/20',
          text: 'text-green-200',
          border: 'border-green-500/20'
        }
      case 'dark-red':
        return {
          primary: 'bg-red-500',
          surface: 'bg-red-900/20',
          text: 'text-red-200',
          border: 'border-red-500/20'
        }
      case 'dark-orange':
        return {
          primary: 'bg-orange-500',
          surface: 'bg-orange-900/20',
          text: 'text-orange-200',
          border: 'border-orange-500/20'
        }
      default: // dark-blue
        return {
          primary: 'bg-blue-500',
          surface: 'bg-blue-900/20',
          text: 'text-blue-200',
          border: 'border-blue-500/20'
        }
    }
  }

  const colors = getThemeColors()

  return (
    <div className="p-4 space-y-4">
      <div className={`${colors.surface} p-4 rounded-lg border ${colors.border}`}>
        <h3 className="text-lg font-semibold text-white mb-2">
          Current Settings:
        </h3>
        <p className="text-gray-300">
          Language: <span className={colors.text}>{language}</span>
        </p>
        <p className="text-gray-300">
          Theme: <span className={colors.text}>{theme}</span>
        </p>
      </div>
      
      <div className={`${colors.primary} p-4 rounded-lg`}>
        <p className="text-white">
          This should change color with theme: {t('welcomeBack', language)}
        </p>
      </div>
      
      <div className="bg-gray-800/30 p-4 rounded-lg">
        <p className="text-white">
          Surface color test: {t('signIn', language)}
        </p>
      </div>
      
      <div className={`bg-gradient-to-r ${colors.primary.replace('bg-', 'from-')} ${colors.primary.replace('bg-', 'to-').replace('500', '600')} p-4 rounded-lg`}>
        <p className="text-white font-semibold">
          Gradient test: {t('createAccount', language)}
        </p>
      </div>
    </div>
  )
} 