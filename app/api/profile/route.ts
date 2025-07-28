import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // In a real app, fetch from database
    // For now, return mock data
    const profileData = {
      firstName: session.user?.name?.split(' ')[0] || '',
      lastName: session.user?.name?.split(' ').slice(1).join(' ') || '',
      email: session.user?.email || '',
      title: session.user?.position || '',
      firm: session.user?.firm || '',
      // Add more fields as needed
    }

    return NextResponse.json({ success: true, data: profileData })
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email) {
      return NextResponse.json({ 
        error: 'Missing required fields: firstName, lastName, email' 
      }, { status: 400 })
    }

    // In a real app, save to database
    // For now, just return success
    const updatedProfile = {
      ...body,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedProfile,
      message: 'Profile updated successfully'
    })
  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { provider } = body

    // Simulate importing data from social provider
    const mockSocialData = {
      google: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
        avatar: 'https://via.placeholder.com/150',
        title: 'Senior Attorney',
        firm: 'Legal Partners LLC'
      },
      apple: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@icloud.com',
        avatar: 'https://via.placeholder.com/150',
        title: 'Partner',
        firm: 'Smith & Associates'
      },
      facebook: {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@facebook.com',
        avatar: 'https://via.placeholder.com/150',
        title: 'Associate Attorney',
        firm: 'Johnson Law Group'
      }
    }

    const socialData = mockSocialData[provider as keyof typeof mockSocialData]
    
    if (!socialData) {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      data: socialData,
      message: `Data imported from ${provider}`
    })
  } catch (error) {
    console.error('Profile import error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 