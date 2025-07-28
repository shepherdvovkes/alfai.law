import { User } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
  firm: string
  position: string
  barNumber?: string
  specialization?: string
  notifications: boolean
  language: string
  terms: boolean
  privacy: boolean
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  token?: string
  error?: string
  details?: any[]
}

export interface ApiError {
  error: string
  details?: any[]
}

// API helper function
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}/api${endpoint}`
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies
  }

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'API request failed')
  }

  return data
}

// Authentication functions
export const auth = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiCall<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      })
      
      // Store user data in localStorage for frontend state
      if (response.success && response.user) {
        localStorage.setItem('user', JSON.stringify(response.user))
        localStorage.setItem('isAuthenticated', 'true')
      }
      
      return response
    } catch (error) {
      return {
        success: false,
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Login failed',
      }
    }
  },

  // Register
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiCall<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      return response
    } catch (error) {
      return {
        success: false,
        message: 'Registration failed',
        error: error instanceof Error ? error.message : 'Registration failed',
      }
    }
  },

  // Verify email
  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const response = await apiCall<AuthResponse>('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token }),
      })
      return response
    } catch (error) {
      return {
        success: false,
        message: 'Email verification failed',
        error: error instanceof Error ? error.message : 'Email verification failed',
      }
    }
  },

  // Forgot password
  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await apiCall<AuthResponse>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      return response
    } catch (error) {
      return {
        success: false,
        message: 'Password reset request failed',
        error: error instanceof Error ? error.message : 'Password reset request failed',
      }
    }
  },

  // Reset password
  async resetPassword(token: string, password: string, confirmPassword: string): Promise<AuthResponse> {
    try {
      const response = await apiCall<AuthResponse>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password, confirmPassword }),
      })
      return response
    } catch (error) {
      return {
        success: false,
        message: 'Password reset failed',
        error: error instanceof Error ? error.message : 'Password reset failed',
      }
    }
  },

  // Logout
  async logout(): Promise<AuthResponse> {
    try {
      const response = await apiCall<AuthResponse>('/auth/logout', {
        method: 'POST',
      })
      
      // Clear local storage
      localStorage.removeItem('user')
      localStorage.removeItem('isAuthenticated')
      
      return response
    } catch (error) {
      // Clear local storage even if API call fails
      localStorage.removeItem('user')
      localStorage.removeItem('isAuthenticated')
      
      return {
        success: false,
        message: 'Logout failed',
        error: error instanceof Error ? error.message : 'Logout failed',
      }
    }
  },

  // Get current user
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await apiCall<AuthResponse>('/auth/me')
      
      // Update localStorage with fresh user data
      if (response.success && response.user) {
        localStorage.setItem('user', JSON.stringify(response.user))
        localStorage.setItem('isAuthenticated', 'true')
      }
      
      return response
    } catch (error) {
      console.error('getCurrentUser: Network error, checking localStorage:', error)
      
      // Check if user exists in localStorage
      const storedUser = localStorage.getItem('user')
      const isAuth = localStorage.getItem('isAuthenticated')
      
      if (storedUser && isAuth === 'true') {
        // User exists in localStorage, return success with stored data
        return {
          success: true,
          message: 'Using cached user data',
          user: JSON.parse(storedUser),
        }
      }
      
      // No stored user, return error
      return {
        success: false,
        message: 'Failed to get user profile',
        error: error instanceof Error ? error.message : 'Failed to get user profile',
      }
    }
  },

  // Check if user is authenticated (client-side)
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('isAuthenticated') === 'true'
  },

  // Get user from localStorage (client-side)
  getUser(): User | null {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  // Clear authentication data (client-side)
  clearAuth(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('user')
    localStorage.removeItem('isAuthenticated')
  },
} 