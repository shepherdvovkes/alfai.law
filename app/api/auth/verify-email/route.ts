import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema
const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
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
  }
]

// Mock verification tokens (in real app, this would be stored in database)
const verificationTokens = new Map<string, { userId: string, expiresAt: Date }>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validationResult = verifyEmailSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }

    const { token } = validationResult.data

    // Find verification token
    const tokenData = verificationTokens.get(token)
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (tokenData.expiresAt < new Date()) {
      verificationTokens.delete(token)
      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      )
    }

    // Find user
    const userIndex = users.findIndex(u => u.id === tokenData.userId)
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user verification status
    users[userIndex].isEmailVerified = true

    // Remove used token
    verificationTokens.delete(token)

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully. You can now log in.',
      user: {
        id: users[userIndex].id,
        email: users[userIndex].email,
        name: users[userIndex].name,
        role: users[userIndex].role,
        firm: users[userIndex].firm,
        position: users[userIndex].position,
        isEmailVerified: users[userIndex].isEmailVerified,
      },
    })

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 