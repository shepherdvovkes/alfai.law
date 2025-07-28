'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, Building, Shield, Check, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { registerSchema, checkPasswordStrength } from '@/lib/validation'
import SocialAuth from '@/components/auth/SocialAuth'
import DemoSocialAuth from '@/components/auth/DemoSocialAuth'
import LanguageThemeSwitcher from '@/components/settings/LanguageThemeSwitcher'
import { useApp } from '@/contexts/AppContext'
import { t } from '@/lib/translations'

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  firm: string
  position: string
  barNumber: string
  specialization: string
  notifications: boolean
  language: string
  terms: boolean
  privacy: boolean
}

export default function RegisterPage() {
  const { language } = useApp()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [passwordStrength, setPasswordStrength] = useState<{ score: number; feedback: string[]; isStrong: boolean }>({ score: 0, feedback: [], isStrong: false })
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    firm: '',
    position: '',
    barNumber: '',
    specialization: '',
    notifications: true,
    language: 'en',
    terms: false,
    privacy: false
  })

  const steps = [
    { id: 1, title: 'Basic Information', description: 'Personal details' },
    { id: 2, title: 'Professional Details', description: 'Work information' },
    { id: 3, title: 'Preferences', description: 'Settings & terms' }
  ]

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    // Check password strength
    if (field === 'password' && typeof value === 'string') {
      setPasswordStrength(checkPasswordStrength(value))
    }
  }

  const nextStep = () => {
    // Validate current step before proceeding
    const stepErrors: Record<string, string> = {}
    
    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) stepErrors.name = 'Name is required'
        if (!formData.email.trim()) stepErrors.email = 'Email или имя пользователя обязательно'
        if (!formData.password) stepErrors.password = 'Password is required'
        if (!formData.confirmPassword) stepErrors.confirmPassword = 'Please confirm your password'
        if (formData.password !== formData.confirmPassword) {
          stepErrors.confirmPassword = 'Passwords do not match'
        }
        if (!passwordStrength.isStrong) {
          stepErrors.password = 'Password is not strong enough'
        }
        break
      case 2:
        if (!formData.firm.trim()) stepErrors.firm = 'Firm name is required'
        if (!formData.position.trim()) stepErrors.position = 'Position is required'
        break
      case 3:
        if (!formData.terms) stepErrors.terms = 'You must accept the terms of service'
        if (!formData.privacy) stepErrors.privacy = 'You must accept the privacy policy'
        break
    }
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to email verification
      window.location.href = '/verify-email'
    }, 2000)
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword
      case 2:
        return formData.firm && formData.position
      case 3:
        return formData.terms && formData.privacy
      default:
        return false
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
            <Shield size={60} />
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
              {t('createAccount', language)}
            </h1>
            <p className="text-xl text-text-secondary max-w-md">
              Create your account and start using intelligent legal analysis and case management
            </p>
          </div>
          
          {/* Progress Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step.id 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-surface-light text-text-muted'
                }`}>
                  {currentStep > step.id ? <Check size={20} /> : step.id}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-text-primary">{step.title}</h3>
                  <p className="text-sm text-text-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold gradient-text mb-2">
                Create Account
              </h2>
              <p className="text-text-secondary">
                Step {currentStep} of 3
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      currentStep >= step.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-surface-light text-text-muted'
                    }`}
                  >
                    {currentStep > step.id ? <Check size={12} /> : step.id}
                  </div>
                ))}
              </div>
              <div className="w-full bg-surface-light rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                                  <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                leftIcon={<User size={18} />}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
                required
              />
                    
                                  <Input
                label="Email или имя пользователя"
                type="text"
                placeholder="Введите email или имя пользователя"
                leftIcon={<Mail size={18} />}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                required
              />
                    
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      leftIcon={<Lock size={18} />}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-text-muted hover:text-text-primary"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      }
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      error={errors.password}
                      required
                    />
                    
                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-surface-light/30 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                passwordStrength.score <= 1 ? 'bg-accent-red' :
                                passwordStrength.score <= 2 ? 'bg-accent-orange' :
                                passwordStrength.score <= 3 ? 'bg-accent-orange' :
                                'bg-accent-green'
                              }`}
                              style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                            />
                          </div>
                          <span className={`text-xs ${
                            passwordStrength.score <= 1 ? 'text-accent-red' :
                            passwordStrength.score <= 2 ? 'text-accent-orange' :
                            passwordStrength.score <= 3 ? 'text-accent-orange' :
                            'text-accent-green'
                          }`}>
                            {passwordStrength.score <= 1 ? 'Weak' :
                             passwordStrength.score <= 2 ? 'Fair' :
                             passwordStrength.score <= 3 ? 'Good' :
                             'Strong'}
                          </span>
                        </div>
                        {passwordStrength.feedback.length > 0 && (
                          <div className="text-xs text-text-muted space-y-1">
                            {passwordStrength.feedback.map((feedback, index) => (
                              <div key={index} className="flex items-center gap-1">
                                <AlertCircle size={12} />
                                {feedback}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <Input
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      leftIcon={<Lock size={18} />}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-text-muted hover:text-text-primary"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      }
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      error={errors.confirmPassword}
                      required
                    />
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <Input
                      label="Law Firm"
                      type="text"
                      placeholder="Enter your law firm name"
                      leftIcon={<Building size={18} />}
                      value={formData.firm}
                      onChange={(e) => handleInputChange('firm', e.target.value)}
                      required
                    />
                    
                    <Input
                      label="Position"
                      type="text"
                      placeholder="Your position (e.g., Partner, Associate)"
                      leftIcon={<User size={18} />}
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      required
                    />
                    
                    <Input
                      label="Bar Number"
                      type="text"
                      placeholder="Your bar registration number"
                      leftIcon={<Shield size={18} />}
                      value={formData.barNumber}
                      onChange={(e) => handleInputChange('barNumber', e.target.value)}
                    />
                    
                    <Input
                      label="Specialization"
                      type="text"
                      placeholder="Your legal specialization"
                      leftIcon={<Shield size={18} />}
                      value={formData.specialization}
                      onChange={(e) => handleInputChange('specialization', e.target.value)}
                    />
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          id="notifications"
                          name="notifications"
                          checked={formData.notifications}
                          onChange={(e) => handleInputChange('notifications', e.target.checked)}
                          className="w-4 h-4 text-primary-500 bg-surface-light border-white/10 rounded focus:ring-primary-500 focus:ring-2"
                        />
                        <span className="ml-2 text-sm text-text-secondary">
                          Receive email notifications
                        </span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Interface Language
                      </label>
                      <select
                        value={formData.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        className="input-field w-full"
                      >
                        <option value="en">English</option>
                        <option value="uk">Українська</option>
                        <option value="ru">Русский</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          id="terms"
                          name="terms"
                          checked={formData.terms}
                          onChange={(e) => handleInputChange('terms', e.target.checked)}
                          className="w-4 h-4 text-primary-500 bg-surface-light border-white/10 rounded focus:ring-primary-500 focus:ring-2"
                          required
                        />
                        <span className="ml-2 text-sm text-text-secondary">
                          I agree to the <Link href="/terms" className="text-primary-400 hover:text-primary-300">Terms of Service</Link>
                        </span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          id="privacy"
                          name="privacy"
                          checked={formData.privacy}
                          onChange={(e) => handleInputChange('privacy', e.target.checked)}
                          className="w-4 h-4 text-primary-500 bg-surface-light border-white/10 rounded focus:ring-primary-500 focus:ring-2"
                          required
                        />
                        <span className="ml-2 text-sm text-text-secondary">
                          I agree to the <Link href="/privacy" className="text-primary-400 hover:text-primary-300">Privacy Policy</Link>
                        </span>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={prevStep}
                    className="flex items-center"
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    Previous
                  </Button>
                )}
                
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="flex items-center ml-auto"
                  >
                    Next
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    loading={isLoading}
                    disabled={!isStepValid()}
                    className="w-full"
                  >
                    Create Account
                  </Button>
                )}
              </div>
            </form>

            {/* Social Registration */}
            {process.env.NODE_ENV === 'development' ? (
              <DemoSocialAuth mode="register" />
            ) : (
              <SocialAuth mode="register" />
            )}

            {/* Sign In Link */}
            <div className="text-center mt-6">
              <span className="text-text-secondary">
                Already have an account?{' '}
              </span>
              <Link
                href="/login"
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 