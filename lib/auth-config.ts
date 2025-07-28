import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const authOptions = {
  debug: process.env.NODE_ENV === 'development',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'mock-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock-google-client-secret',
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

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
          }
        ]

        const user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase())
        
        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        
        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          firm: user.firm,
          position: user.position,
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user) {
        token.role = user.role
        token.firm = user.firm
        token.position = user.position
      }
      return token
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.role = token.role
        session.user.firm = token.firm
        session.user.position = token.position
      }
      return session
    },
    async signIn({ user, account, profile }: any) {
      // Handle social login
      if (account?.provider !== 'credentials') {
        // In a real app, you would:
        // 1. Check if user exists in your database
        // 2. If not, create a new user
        // 3. Update user profile with social data
        
        console.log('Social login:', {
          provider: account?.provider,
          email: user.email,
          name: user.name,
        })
      }
      
      return true
    }
  },
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
} 