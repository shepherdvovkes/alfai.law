'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Check, RefreshCw, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false)
  const [resendCount, setResendCount] = useState(0)

  const handleResend = async () => {
    setIsResending(true)
    // Simulate resend process
    setTimeout(() => {
      setIsResending(false)
      setResendCount(prev => prev + 1)
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
        <div className="glass-card p-8 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="w-20 h-20 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="text-accent-green" size={40} />
          </motion.div>
          
          {/* Header */}
          <h1 className="text-3xl font-bold gradient-text mb-4">
            Verify Your Email
          </h1>
          
          <p className="text-text-secondary mb-6">
            We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
          </p>

          {/* Status Info */}
          <div className="bg-surface-light/50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-text-primary mb-2">What to do next:</h3>
            <ul className="text-sm text-text-secondary space-y-1 text-left">
              <li>• Check your email inbox</li>
              <li>• Click the verification link</li>
              <li>• Return here to sign in</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Button
              onClick={handleResend}
              loading={isResending}
              variant="secondary"
              className="w-full"
            >
              <RefreshCw size={16} className="mr-2" />
              Resend Verification Email
            </Button>
            
            <Button
              variant="ghost"
              className="w-full"
            >
              <MessageCircle size={16} className="mr-2" />
              Contact Support
            </Button>
            
            <Link href="/login">
              <Button variant="ghost" className="w-full">
                Back to Login
              </Button>
            </Link>
          </div>

          {/* Resend Info */}
          {resendCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-accent-green/10 border border-accent-green/20 rounded-lg"
            >
              <p className="text-sm text-accent-green">
                Verification email sent! Check your inbox.
              </p>
            </motion.div>
          )}

          {/* Help Text */}
          <div className="mt-6 text-xs text-text-muted">
            <p>Didn't receive the email? Check your spam folder or try resending.</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 