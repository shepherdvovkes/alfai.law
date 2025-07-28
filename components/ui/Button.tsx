import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, children, disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-dark disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      primary: 'btn-primary focus:ring-primary-500',
      secondary: 'btn-secondary focus:ring-primary-500',
      ghost: 'btn-ghost focus:ring-primary-500',
      outline: 'border border-white/20 text-text-primary hover:bg-surface-light/50 focus:ring-primary-500',
      danger: 'bg-accent-red hover:bg-accent-red/80 text-white focus:ring-accent-red',
    }
    
    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
      icon: 'h-10 w-10',
    }
    
    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="spinner mr-2" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button } 