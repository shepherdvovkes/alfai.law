import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

// Validation schema
const loginSchema = z.object({
  email: z.string().min(1, 'Email or username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// Mock user database (in real app, this would be a database)
const users = [
  {
    id: '1',
    email: 'admin@legalai.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'John Doe',
    role: 'admin',
    firm: 'Legal AI Partners',
    position: 'Partner',
    isEmailVerified: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'lawyer@legalai.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'Jane Smith',
    role: 'lawyer',
    firm: 'Legal AI Partners',
    position: 'Associate',
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

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }

    const { email, password } = validationResult.data

    // Find user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return NextResponse.json(
        { error: 'Please verify your email before logging in' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        firm: user.firm,
        position: user.position,
      },
      token,
    })

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 