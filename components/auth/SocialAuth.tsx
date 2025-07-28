'use client'

import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

interface SocialAuthProps {
  mode?: 'login' | 'register'
}

export default function SocialAuth({ mode = 'login' }: SocialAuthProps) {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: false,
      })

      if (result?.error) {
        console.error('Google sign in error:', result.error)
        if (result.error === 'OAuthAccountNotLinked') {
          toast.error('This account is already linked to another sign-in method')
        } else if (result.error === 'AccessDenied') {
          toast.error('Access denied. Please try again.')
        } else if (result.error === 'Configuration') {
          toast.error('Google authentication is not properly configured')
        } else {
          toast.error(`Failed to sign in with Google: ${result.error}`)
        }
      } else if (result?.ok) {
        toast.success('Successfully signed in with Google')
        window.location.href = '/dashboard'
      } else {
        toast.error('Unexpected response from Google')
      }
    } catch (error) {
      console.error('Google sign in error:', error)
      toast.error('Error signing in with Google. Please try again.')
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

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center px-6 py-3 border border-white/10 rounded-lg hover:bg-surface-light/50 transition-colors"
        >
          <FcGoogle size={20} className="mr-2" />
          Continue with Google
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-text-muted">
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