import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import AuthProvider from '@/components/providers/AuthProvider'
import { AppProvider } from '@/contexts/AppContext'
import ThemeProvider from '@/components/providers/ThemeProvider'

export const metadata: Metadata = {
  title: 'Legal AI System - Intelligent Legal Analysis & Case Management',
  description: 'Advanced AI-powered legal system for case management, document generation, and legal analysis. Streamline your legal practice with intelligent automation.',
  keywords: 'legal AI, case management, document generation, legal analysis, law firm software',
  authors: [{ name: 'Legal AI System' }],
  robots: 'index, follow',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans">
        <AppProvider>
          <AuthProvider>
            <ThemeProvider>
              <div className="min-h-screen bg-surface-dark">
                {children}
              </div>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1E2438',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  },
                  success: {
                    iconTheme: {
                      primary: '#00D084',
                      secondary: '#FFFFFF',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#FF4757',
                      secondary: '#FFFFFF',
                    },
                  },
                }}
              />
            </ThemeProvider>
          </AuthProvider>
        </AppProvider>
      </body>
    </html>
  )
} 