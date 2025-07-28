import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/Input'

describe('Input', () => {
  const user = userEvent.setup()

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Input placeholder="Enter text" />)
      const input = screen.getByPlaceholderText('Enter text')
      expect(input).toBeInTheDocument()
      expect(input).toHaveClass('input-field')
    })

    it('should render with label', () => {
      render(<Input label="Email Address" placeholder="Enter email" />)
      const label = screen.getByText('Email Address')
      const input = screen.getByPlaceholderText('Enter email')
      expect(label).toBeInTheDocument()
      expect(label).toHaveAttribute('for', input.id)
    })

    it('should render with helper text', () => {
      render(<Input helperText="This is helpful information" placeholder="Enter text" />)
      const helperText = screen.getByText('This is helpful information')
      expect(helperText).toBeInTheDocument()
      expect(helperText).toHaveClass('text-text-muted')
    })

    it('should render with error message', () => {
      render(<Input error="This field is required" placeholder="Enter text" />)
      const errorMessage = screen.getByText('This field is required')
      const input = screen.getByPlaceholderText('Enter text')
      expect(errorMessage).toBeInTheDocument()
      expect(errorMessage).toHaveClass('text-accent-red')
      expect(input).toHaveClass('border-accent-red')
    })

    it('should prioritize error over helper text', () => {
      render(
        <Input 
          error="This field is required" 
          helperText="This is helpful information" 
          placeholder="Enter text" 
        />
      )
      const errorMessage = screen.getByText('This field is required')
      const helperText = screen.queryByText('This is helpful information')
      expect(errorMessage).toBeInTheDocument()
      expect(helperText).not.toBeInTheDocument()
    })
  })

  describe('Icons', () => {
    it('should render with left icon', () => {
      const LeftIcon = () => <span data-testid="left-icon">🔍</span>
      render(<Input leftIcon={<LeftIcon />} placeholder="Search" />)
      const leftIcon = screen.getByTestId('left-icon')
      const input = screen.getByPlaceholderText('Search')
      expect(leftIcon).toBeInTheDocument()
      expect(input).toHaveClass('pl-10')
    })

    it('should render with right icon', () => {
      const RightIcon = () => <span data-testid="right-icon">📧</span>
      render(<Input rightIcon={<RightIcon />} placeholder="Email" />)
      const rightIcon = screen.getByTestId('right-icon')
      const input = screen.getByPlaceholderText('Email')
      expect(rightIcon).toBeInTheDocument()
      expect(input).toHaveClass('pr-10')
    })

    it('should render with both icons', () => {
      const LeftIcon = () => <span data-testid="left-icon">🔍</span>
      const RightIcon = () => <span data-testid="right-icon">📧</span>
      render(
        <Input 
          leftIcon={<LeftIcon />} 
          rightIcon={<RightIcon />} 
          placeholder="Search email" 
        />
      )
      const leftIcon = screen.getByTestId('left-icon')
      const rightIcon = screen.getByTestId('right-icon')
      const input = screen.getByPlaceholderText('Search email')
      expect(leftIcon).toBeInTheDocument()
      expect(rightIcon).toBeInTheDocument()
      expect(input).toHaveClass('pl-10', 'pr-10')
    })
  })

  describe('Input functionality', () => {
    it('should handle text input', async () => {
      render(<Input placeholder="Enter text" />)
      const input = screen.getByPlaceholderText('Enter text')
      await user.type(input, 'Hello World')
      expect(input).toHaveValue('Hello World')
    })

    it('should handle controlled input', () => {
      const handleChange = jest.fn()
      render(<Input value="test" onChange={handleChange} placeholder="Enter text" />)
      const input = screen.getByPlaceholderText('Enter text')
      expect(input).toHaveValue('test')
    })

    it('should handle different input types', () => {
      const types = ['text', 'email', 'password', 'number', 'tel', 'url'] as const
      
      types.forEach(type => {
        const { unmount } = render(<Input type={type} placeholder={`${type} input`} />)
        const input = screen.getByPlaceholderText(`${type} input`)
        expect(input).toHaveAttribute('type', type)
        unmount()
      })
    })

    it('should handle disabled state', () => {
      render(<Input disabled placeholder="Disabled input" />)
      const input = screen.getByPlaceholderText('Disabled input')
      expect(input).toBeDisabled()
    })

    it('should handle required state', () => {
      render(<Input required placeholder="Required input" />)
      const input = screen.getByPlaceholderText('Required input')
      expect(input).toBeRequired()
    })
  })

  describe('Accessibility', () => {
    it('should associate label with input', () => {
      render(<Input label="Email" placeholder="Enter email" />)
      const label = screen.getByText('Email')
      const input = screen.getByPlaceholderText('Enter email')
      expect(label).toHaveAttribute('for', input.id)
    })

    it('should use provided id', () => {
      render(<Input id="custom-id" label="Email" placeholder="Enter email" />)
      const label = screen.getByText('Email')
      const input = screen.getByPlaceholderText('Enter email')
      expect(input).toHaveAttribute('id', 'custom-id')
      expect(label).toHaveAttribute('for', 'custom-id')
    })

    it('should generate unique id when not provided', () => {
      render(<Input label="Email" placeholder="Enter email" />)
      const input = screen.getByPlaceholderText('Enter email')
      expect(input.id).toMatch(/^input-[a-z0-9]+$/)
    })

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>()
      render(<Input ref={ref} placeholder="Ref input" />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })
  })

  describe('Props forwarding', () => {
    it('should forward HTML input attributes', () => {
      render(
        <Input 
          name="email"
          maxLength={50}
          minLength={3}
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          data-testid="test-input"
          aria-describedby="description"
          placeholder="Test input"
        />
      )
      const input = screen.getByPlaceholderText('Test input')
      expect(input).toHaveAttribute('name', 'email')
      expect(input).toHaveAttribute('maxLength', '50')
      expect(input).toHaveAttribute('minLength', '3')
      expect(input).toHaveAttribute('pattern', '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$')
      expect(input).toHaveAttribute('data-testid', 'test-input')
      expect(input).toHaveAttribute('aria-describedby', 'description')
    })

    it('should apply custom className', () => {
      render(<Input className="custom-input" placeholder="Custom input" />)
      const input = screen.getByPlaceholderText('Custom input')
      expect(input).toHaveClass('custom-input')
    })
  })

  describe('Error states', () => {
    it('should apply error styles to input', () => {
      render(<Input error="Error message" placeholder="Error input" />)
      const input = screen.getByPlaceholderText('Error input')
      expect(input).toHaveClass('border-accent-red', 'focus:ring-accent-red')
    })

    it('should show error message with correct styling', () => {
      render(<Input error="This field is required" placeholder="Error input" />)
      const errorMessage = screen.getByText('This field is required')
      expect(errorMessage).toHaveClass('text-accent-red')
    })
  })
}) 