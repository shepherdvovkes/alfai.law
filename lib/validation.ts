import { z } from 'zod'

// Email or username validation with custom error message
const emailSchema = z
  .string()
  .min(1, 'Email or username is required')
  .max(255, 'Email or username is too long')

// Password validation with strength requirements
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .regex(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
  .regex(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
  .regex(/^(?=.*\d)/, 'Password must contain at least one number')
  .regex(/^(?=.*[@$!%*?&])/, 'Password must contain at least one special character (@$!%*?&)')

// Name validation
const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name is too long')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')

// Phone validation
const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
  .min(10, 'Phone number is too short')
  .max(20, 'Phone number is too long')

// Company name validation
const companySchema = z
  .string()
  .min(2, 'Company name must be at least 2 characters')
  .max(100, 'Company name is too long')

// Bar number validation
const barNumberSchema = z
  .string()
  .regex(/^[A-Z0-9\-]+$/, 'Bar number can only contain uppercase letters, numbers, and hyphens')
  .min(3, 'Bar number is too short')
  .max(20, 'Bar number is too long')

// Login form validation
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

// Registration form validation
export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  firm: companySchema,
  position: z.string().min(1, 'Position is required').max(100, 'Position is too long'),
  barNumber: barNumberSchema.optional(),
  specialization: z.string().max(200, 'Specialization is too long').optional(),
  phone: phoneSchema.optional(),
  notifications: z.boolean().default(true),
  language: z.enum(['en', 'uk', 'ru', 'de', 'fr']).default('en'),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms of service'),
  privacy: z.boolean().refine(val => val === true, 'You must accept the privacy policy'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Forgot password validation
export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

// Reset password validation
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Client form validation
export const clientSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  type: z.enum(['individual', 'corporate']),
  company: companySchema.optional(),
  position: z.string().max(100, 'Position is too long').optional(),
  address: z.string().max(500, 'Address is too long').optional(),
  notes: z.string().max(1000, 'Notes are too long').optional(),
})

// Case form validation
export const caseSchema = z.object({
  title: z.string().min(5, 'Case title must be at least 5 characters').max(200, 'Case title is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description is too long'),
  type: z.enum(['civil', 'criminal', 'administrative', 'commercial', 'family', 'other']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  court: z.string().max(200, 'Court name is too long').optional(),
  judge: z.string().max(200, 'Judge name is too long').optional(),
  amount: z.number().min(0, 'Amount cannot be negative').optional(),
  currency: z.string().max(3, 'Currency code is too long').optional(),
  startDate: z.date(),
  deadline: z.date().optional(),
  tags: z.array(z.string()).max(10, 'Too many tags').optional(),
})

// Document form validation
export const documentSchema = z.object({
  title: z.string().min(1, 'Document title is required').max(200, 'Document title is too long'),
  type: z.enum(['contract', 'petition', 'agreement', 'report', 'template', 'other']),
  content: z.string().max(10000, 'Document content is too long').optional(),
  tags: z.array(z.string()).max(10, 'Too many tags').optional(),
})

// Utility function to get field error
export const getFieldError = (errors: any[], fieldName: string): string | undefined => {
  const error = errors.find(err => err.path.includes(fieldName))
  return error?.message
}

// Password strength checker
export const checkPasswordStrength = (password: string): {
  score: number
  feedback: string[]
  isStrong: boolean
} => {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('At least 8 characters')
  }

  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('One lowercase letter')
  }

  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('One uppercase letter')
  }

  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push('One number')
  }

  if (/[@$!%*?&]/.test(password)) {
    score += 1
  } else {
    feedback.push('One special character (@$!%*?&)')
  }

  return {
    score,
    feedback,
    isStrong: score >= 4
  }
}

// Email format validator
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Phone format validator
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,20}$/
  return phoneRegex.test(phone)
}

// URL validator
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Date validator
export const isValidDate = (date: string): boolean => {
  const dateObj = new Date(date)
  return dateObj instanceof Date && !isNaN(dateObj.getTime())
}

// File size validator (in bytes)
export const isValidFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize
}

// File type validator
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type)
} 