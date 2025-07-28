'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FcGoogle } from 'react-icons/fc'
import { FaApple, FaFacebook } from 'react-icons/fa'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

interface DemoSocialAuthProps {
  mode?: 'login' | 'register'
}

export default function DemoSocialAuth({ mode = 'login' }: DemoSocialAuthProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleDemoSocialSignIn = async (provider: string) => {
    setIsLoading(provider)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock successful social login
      const mockUserData = {
        google: {
          name: 'John Doe',
          email: 'john.doe@gmail.com',
          avatar: 'https://via.placeholder.com/150'
        },
        apple: {
          name: 'Jane Smith',
          email: 'jane.smith@icloud.com',
          avatar: 'https://via.placeholder.com/150'
        },
        facebook: {
          name: 'Mike Johnson',
          email: 'mike.johnson@facebook.com',
          avatar: 'https://via.placeholder.com/150'
        }
      }

      const userData = mockUserData[provider as keyof typeof mockUserData]
      
      // Store demo user data in localStorage
      localStorage.setItem('demoUser', JSON.stringify({
        ...userData,
        provider,
        isDemo: true
      }))
      
      // Set authentication state
      localStorage.setItem('isAuthenticated', 'true')
      
      // Create a mock session for NextAuth
      const mockSession = {
        user: {
          id: `demo-${provider}-${Date.now()}`,
          name: userData.name,
          email: userData.email,
          image: userData.avatar,
          role: 'lawyer',
          firm: 'Demo Law Firm',
          position: 'Associate Attorney'
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      }
      
      // Store session in localStorage
      localStorage.setItem('next-auth.session-token', 'demo-session-token')
      localStorage.setItem('next-auth.csrf-token', 'demo-csrf-token')
      sessionStorage.setItem('next-auth.session-token', 'demo-session-token')
      
      toast.success(`Demo ${provider} ${mode} successful!`)
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 1000)
      
    } catch (error) {
      toast.error(`Demo ${provider} ${mode} failed`)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-surface-light text-text-muted">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="outline"
          onClick={() => handleDemoSocialSignIn('google')}
          loading={isLoading === 'google'}
          disabled={isLoading !== null}
          className="flex items-center justify-center px-4 py-2 border border-white/10 rounded-lg hover:bg-surface-light/50 transition-colors"
        >
          <FcGoogle size={18} />
        </Button>
        
        <Button
          variant="outline"
          onClick={() => handleDemoSocialSignIn('apple')}
          loading={isLoading === 'apple'}
          disabled={isLoading !== null}
          className="flex items-center justify-center px-4 py-2 border border-white/10 rounded-lg hover:bg-surface-light/50 transition-colors"
        >
          <FaApple size={18} />
        </Button>
        
        <Button
          variant="outline"
          onClick={() => handleDemoSocialSignIn('facebook')}
          loading={isLoading === 'facebook'}
          disabled={isLoading !== null}
          className="flex items-center justify-center px-4 py-2 border border-white/10 rounded-lg hover:bg-surface-light/50 transition-colors"
        >
          <FaFacebook size={18} className="text-blue-500" />
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-text-muted">
          <span className="text-accent-orange">⚠️ Demo Mode:</span> This simulates social authentication for development purposes.
        </p>
        <p className="text-xs text-text-muted mt-1">
          By continuing, you agree to our{' '}
          <a href="#" className="text-primary-400 hover:text-primary-300">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary-400 hover:text-primary-300">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
} 