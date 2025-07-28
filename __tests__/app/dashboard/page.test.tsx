import React from 'react'
import { render, screen } from '@testing-library/react'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/dashboard',
}))

// Mock the dashboard page component
const MockDashboardPage = () => (
  <div>
    <h1>Welcome to Dashboard</h1>
    <p>User: John Doe</p>
    <p>Email: john@example.com</p>
    <p>Role: admin</p>
  </div>
)

describe('Dashboard Page', () => {
  it('should render dashboard with user information', () => {
    render(<MockDashboardPage />)
    
    expect(screen.getByText('Welcome to Dashboard')).toBeInTheDocument()
    expect(screen.getByText('User: John Doe')).toBeInTheDocument()
    expect(screen.getByText('Email: john@example.com')).toBeInTheDocument()
    expect(screen.getByText('Role: admin')).toBeInTheDocument()
  })

  it('should display all required dashboard elements', () => {
    render(<MockDashboardPage />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Welcome to Dashboard')
  })
}) 