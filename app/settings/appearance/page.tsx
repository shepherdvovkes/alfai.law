'use client'

import { motion } from 'framer-motion'
import { useApp } from '@/contexts/AppContext'
import { t } from '@/lib/translations'
import LanguageThemeSwitcher from '@/components/settings/LanguageThemeSwitcher'
import ThemeTest from '@/components/settings/ThemeTest'
import AppLayout from '@/components/layout/AppLayout'

export default function AppearanceSettingsPage() {
  const { language } = useApp()

  return (
    <AppLayout>
      <div className="min-h-screen bg-surface-dark p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">
              {t('appearance', language)}
            </h1>
            <p className="text-text-secondary">
              {t('languageSettings', language)} & {t('themeSettings', language)}
            </p>
          </div>

          {/* Settings Content */}
          <div className="glass-card p-8">
            <LanguageThemeSwitcher variant="full" />
          </div>

          {/* Theme Test */}
          <div className="mt-6 glass-card p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">
              Live Preview
            </h3>
            <ThemeTest />
          </div>

          {/* Additional Settings */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Language Preview */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                Language Preview
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-surface-light/30 rounded-lg">
                  <h4 className="font-medium text-text-primary mb-2">
                    {t('welcomeBack', language)}
                  </h4>
                  <p className="text-text-secondary text-sm">
                    {t('signInToAccount', language)}
                  </p>
                </div>
                <div className="p-4 bg-surface-light/30 rounded-lg">
                  <h4 className="font-medium text-text-primary mb-2">
                    {t('profileSettings', language)}
                  </h4>
                  <p className="text-text-secondary text-sm">
                    {t('manageAccount', language)}
                  </p>
                </div>
              </div>
            </div>

                      {/* Theme Preview */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">
              Theme Preview
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-lg">
                <h4 className="font-medium text-white mb-2">Dark Blue Theme</h4>
                <p className="text-blue-200 text-sm">Professional and modern</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 rounded-lg">
                <h4 className="font-medium text-white mb-2">Dark Purple Theme</h4>
                <p className="text-purple-200 text-sm">Elegant and sophisticated</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-900 via-green-800 to-green-700 rounded-lg">
                <h4 className="font-medium text-white mb-2">Dark Green Theme</h4>
                <p className="text-green-200 text-sm">Calm and focused</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-red-900 via-red-800 to-red-700 rounded-lg">
                <h4 className="font-medium text-white mb-2">Dark Red Theme</h4>
                <p className="text-red-200 text-sm">Energetic and bold</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-900 via-orange-800 to-orange-700 rounded-lg">
                <h4 className="font-medium text-white mb-2">Dark Orange Theme</h4>
                <p className="text-orange-200 text-sm">Warm and inviting</p>
              </div>
            </div>
          </div>
          </div>

          {/* Settings Info */}
          <div className="mt-8 glass-card p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">
              Settings Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-text-primary mb-2">Language Settings</h4>
                <ul className="text-text-secondary text-sm space-y-1">
                  <li>• Choose from 5 supported languages</li>
                  <li>• Real-time translation updates</li>
                  <li>• Settings are saved automatically</li>
                  <li>• Works across all pages</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-2">Theme Settings</h4>
                <ul className="text-text-secondary text-sm space-y-1">
                  <li>• 5 beautiful dark themes</li>
                  <li>• Instant theme switching</li>
                  <li>• Consistent across the app</li>
                  <li>• Optimized for productivity</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
} 