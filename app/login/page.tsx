'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Scale, Gavel, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import toast from 'react-hot-toast'
import { useAuth } from '@/components/providers/AuthProvider'
import SocialAuth from '@/components/auth/SocialAuth'
import DemoSocialAuth from '@/components/auth/DemoSocialAuth'
import LanguageThemeSwitcher from '@/components/settings/LanguageThemeSwitcher'
import { useApp } from '@/contexts/AppContext'
import { t } from '@/lib/translations'

export default function LoginPage() {
  const { language } = useApp()
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(email, password)
      
      if (success) {
        toast.success('Login successful!')
        router.push('/dashboard')
      } else {
        toast.error('Login failed')
      }
    } catch (error) {
      toast.error('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Language & Theme Switcher */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageThemeSwitcher variant="compact" />
      </div>
      
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-surface-medium to-primary-900/20">
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Legal Icons */}
          <motion.div
            className="absolute top-20 left-20 text-primary-400/20"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Scale size={60} />
          </motion.div>
          <motion.div
            className="absolute top-40 right-32 text-accent-green/20"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Gavel size={50} />
          </motion.div>
          <motion.div
            className="absolute bottom-32 left-32 text-accent-orange/20"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <FileText size={70} />
          </motion.div>
        </div>
      </div>

      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="mb-8">
            <h1 className="text-6xl font-bold gradient-text mb-4">
              Legal AI System
            </h1>
            <p className="text-xl text-text-secondary max-w-md">
              Intelligent legal analysis and case management powered by advanced AI technology
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Scale className="text-primary-400" size={24} />
              </div>
              <h3 className="font-semibold text-text-primary mb-1">AI Analysis</h3>
              <p className="text-sm text-text-muted">Smart legal insights</p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-accent-green/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="text-accent-green" size={24} />
              </div>
              <h3 className="font-semibold text-text-primary mb-1">Document Gen</h3>
              <p className="text-sm text-text-muted">Auto-generated docs</p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-accent-orange/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Gavel className="text-accent-orange" size={24} />
              </div>
              <h3 className="font-semibold text-text-primary mb-1">Case Mgmt</h3>
              <p className="text-sm text-text-muted">Complete workflow</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold gradient-text mb-2">
                {t('welcomeBack', language)}
              </h2>
              <p className="text-text-secondary">
                {t('signInToAccount', language)}
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email или имя пользователя"
                type="text"
                placeholder="Введите email или имя пользователя"
                leftIcon={<Mail size={18} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <Input
                label={t('password', language)}
                type={showPassword ? 'text' : 'password'}
                placeholder={t('password', language)}
                leftIcon={<Lock size={18} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-text-muted hover:text-text-primary"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember-me"
                    name="remember-me"
                    className="w-4 h-4 text-primary-500 bg-surface-light border-white/10 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-text-secondary">
                    {t('rememberMe', language)}
                  </span>
                </label>
                
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                >
                  {t('forgotPassword', language)}
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
              >
                {t('signIn', language)}
              </Button>
            </form>

            {/* Social Login */}
            {process.env.NODE_ENV === 'development' ? (
              <DemoSocialAuth mode="login" />
            ) : (
              <SocialAuth mode="login" />
            )}

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <span className="text-text-secondary">
                {t('dontHaveAccount', language)}{' '}
              </span>
              <Link
                href="/register"
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                {t('signUp', language)}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 