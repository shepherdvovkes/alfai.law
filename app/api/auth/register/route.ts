import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email or username is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  firm: z.string().min(1, 'Firm name is required'),
  position: z.string().min(1, 'Position is required'),
  barNumber: z.string().optional(),
  specialization: z.string().optional(),
  notifications: z.boolean().default(true),
  language: z.string().default('en'),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms of service'),
  privacy: z.boolean().refine(val => val === true, 'You must accept the privacy policy'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Mock user database (in real app, this would be a database)
    const users = [
  {
    id: '1',
    email: 'admin@legalai.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    name: 'John Doe',
    role: 'admin',
    firm: 'Legal AI Partners',
    position: 'Partner',
    isEmailVerified: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    email: 'admin',
    password: '$2b$12$qzc3Cwr/chJmUd1WgYPdP.9WafktMALdSkCQJXT6UXqZ7swKq4cRG', // admin123123
    name: 'Administrator',
    role: 'admin',
    firm: 'Legal AI System',
    position: 'System Administrator',
    isEmailVerified: true,
    createdAt: new Date('2024-01-01'),
  }
]

// Mock verification tokens (in real app, this would be stored in database)
const verificationTokens = new Map<string, { userId: string, expiresAt: Date }>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }

    const { 
      name, 
      email, 
      password, 
      firm, 
      position, 
      barNumber, 
      specialization,
      notifications,
      language 
    } = validationResult.data

    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: 'lawyer',
      firm,
      position,
      barNumber,
      specialization,
      notifications,
      language,
      isEmailVerified: false,
      createdAt: new Date(),
    }

    // Add user to database
    users.push(newUser)

    // Generate verification token
    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    
    verificationTokens.set(verificationToken, {
      userId: newUser.id,
      expiresAt
    })

    // In a real app, you would send an email here
    console.log(`Verification email sent to ${email} with token: ${verificationToken}`)

    return NextResponse.json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        firm: newUser.firm,
        position: newUser.position,
      },
      verificationToken, // In production, this would not be returned
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 