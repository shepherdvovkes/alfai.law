import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Validation schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
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
    const validationResult = resetPasswordSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }

    const { token, password } = validationResult.data

    // Find reset token
    const tokenData = resetTokens.get(token)
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (tokenData.expiresAt < new Date()) {
      resetTokens.delete(token)
      return NextResponse.json(
        { error: 'Reset token has expired' },
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

    // Hash new password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Update user password
    users[userIndex].password = hashedPassword

    // Remove used token
    resetTokens.delete(token)

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
      user: {
        id: users[userIndex].id,
        email: users[userIndex].email,
        name: users[userIndex].name,
        role: users[userIndex].role,
        firm: users[userIndex].firm,
        position: users[userIndex].position,
      },
    })

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 