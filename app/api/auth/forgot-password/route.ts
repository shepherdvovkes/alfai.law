import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
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
    id: '2',
    email: 'lawyer@legalai.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    name: 'Jane Smith',
    role: 'lawyer',
    firm: 'Legal AI Partners',
    position: 'Associate',
    isEmailVerified: true,
    createdAt: new Date('2024-01-01'),
  }
]

// Mock reset tokens (in real app, this would be stored in database)
const resetTokens = new Map<string, { userId: string, expiresAt: Date }>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validationResult = forgotPasswordSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }

    const { email } = validationResult.data

    // Find user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      })
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    
    resetTokens.set(resetToken, {
      userId: user.id,
      expiresAt
    })

    // In a real app, you would send an email here
    console.log(`Password reset email sent to ${email} with token: ${resetToken}`)

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
      resetToken, // In production, this would not be returned
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 