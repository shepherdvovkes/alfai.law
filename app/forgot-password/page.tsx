'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate password reset process
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-surface-medium to-primary-900/20">
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Legal Icons */}
          <motion.div
            className="absolute top-20 left-20 text-primary-400/20"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Mail size={60} />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          {/* Back Button */}
          <Link
            href="/login"
            className="inline-flex items-center text-text-secondary hover:text-text-primary mb-6 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to login
          </Link>

          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold gradient-text mb-2">
                  Forgot Password?
                </h2>
                <p className="text-text-secondary">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  leftIcon={<Mail size={18} />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  loading={isLoading}
                  disabled={!email}
                  className="w-full"
                >
                  Send Reset Link
                </Button>
              </form>

              {/* Instructions */}
              <div className="mt-6 p-4 bg-surface-light/50 rounded-lg">
                <h3 className="font-semibold text-text-primary mb-2">What happens next?</h3>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• We'll send a password reset link to your email</li>
                  <li>• The link will expire in 24 hours</li>
                  <li>• Check your spam folder if you don't see it</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="w-16 h-16 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="text-accent-green" size={32} />
                </motion.div>
                
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  Check Your Email
                </h2>
                <p className="text-text-secondary mb-6">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                
                <div className="space-y-4">
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="secondary"
                    className="w-full"
                  >
                    Send Another Email
                  </Button>
                  
                  <Link href="/login">
                    <Button variant="ghost" className="w-full">
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
} 