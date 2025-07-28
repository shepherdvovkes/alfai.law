'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types'
import { auth } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async () => {
    try {
      console.log('AuthProvider: Starting authentication check...')
      setIsLoading(true)
      
      // Check if user is authenticated in localStorage
      const isAuth = auth.isAuthenticated()
      const storedUser = auth.getUser()
      console.log('AuthProvider: localStorage check - isAuth:', isAuth, 'storedUser:', storedUser)
      
      if (isAuth && storedUser) {
        console.log('AuthProvider: User found in localStorage, setting state...')
        // Set the user immediately from localStorage for better UX
        setUser(storedUser)
        setIsAuthenticated(true)
        
        // Then verify with server in the background
        try {
          console.log('AuthProvider: Verifying with server...')
          const response = await auth.getCurrentUser()
          console.log('AuthProvider: Server verification response:', response)
          
          if (response.success && response.user) {
            console.log('AuthProvider: Server verification successful, updating user data')
            // Update with fresh data from server
            setUser(response.user)
            setIsAuthenticated(true)
          } else {
            console.log('AuthProvider: Server verification failed, but keeping user logged in')
            // Don't clear auth on server verification failure
            // Keep the user logged in with localStorage data
            // This prevents logout on temporary network issues or server problems
          }
        } catch (error) {
          console.error('AuthProvider: Server verification failed:', error)
          // Keep the user logged in if server verification fails
          // This prevents logout on temporary network issues
          console.log('AuthProvider: Keeping user logged in despite server verification failure')
        }
      } else {
        console.log('AuthProvider: No user found in localStorage')
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('AuthProvider: Auth check failed:', error)
      auth.clearAuth()
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
      console.log('AuthProvider: Authentication check completed')
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('AuthProvider: Starting login process...')
      const response = await auth.login({ email, password })
      console.log('AuthProvider: Login response:', response)
      
      if (response.success && response.user) {
        console.log('AuthProvider: Setting user and authentication state...')
        setUser(response.user)
        setIsAuthenticated(true)
        console.log('AuthProvider: Login successful, user authenticated')
        return true
      }
      console.log('AuthProvider: Login failed - no success or user data')
      return false
    } catch (error) {
      console.error('AuthProvider: Login failed:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      await auth.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      auth.clearAuth()
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
} 