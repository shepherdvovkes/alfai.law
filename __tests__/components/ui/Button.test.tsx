import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  const user = userEvent.setup()

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Button>Click me</Button>)
      const button = screen.getByRole('button', { name: 'Click me' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('btn-primary')
      expect(button).toHaveClass('px-4 py-2.5 text-sm')
    })

    it('should render with custom className', () => {
      render(<Button className="custom-class">Custom Button</Button>)
      const button = screen.getByRole('button', { name: 'Custom Button' })
      expect(button).toHaveClass('custom-class')
    })

    it('should render all variants correctly', () => {
      const variants = ['primary', 'secondary', 'ghost', 'outline', 'danger'] as const
      
      variants.forEach(variant => {
        const { unmount } = render(<Button variant={variant}>Variant {variant}</Button>)
        const button = screen.getByRole('button', { name: `Variant ${variant}` })
        
        if (variant === 'primary') {
          expect(button).toHaveClass('btn-primary')
        } else if (variant === 'secondary') {
          expect(button).toHaveClass('btn-secondary')
        } else if (variant === 'ghost') {
          expect(button).toHaveClass('btn-ghost')
        } else if (variant === 'outline') {
          expect(button).toHaveClass('border border-white/20')
        } else if (variant === 'danger') {
          expect(button).toHaveClass('bg-accent-red')
        }
        
        unmount()
      })
    })

    it('should render all sizes correctly', () => {
      const sizes = ['sm', 'md', 'lg', 'icon'] as const
      
      sizes.forEach(size => {
        const { unmount } = render(<Button size={size}>Size {size}</Button>)
        const button = screen.getByRole('button', { name: `Size ${size}` })
        
        if (size === 'sm') {
          expect(button).toHaveClass('px-3 py-2 text-sm')
        } else if (size === 'md') {
          expect(button).toHaveClass('px-4 py-2.5 text-sm')
        } else if (size === 'lg') {
          expect(button).toHaveClass('px-6 py-3 text-base')
        } else if (size === 'icon') {
          expect(button).toHaveClass('h-10 w-10')
        }
        
        unmount()
      })
    })
  })

  describe('Loading state', () => {
    it('should show loading spinner when loading is true', () => {
      render(<Button loading>Loading Button</Button>)
      const button = screen.getByRole('button', { name: 'Loading Button' })
      const spinner = button.querySelector('.spinner')
      expect(spinner).toBeInTheDocument()
    })

    it('should be disabled when loading is true', () => {
      render(<Button loading>Loading Button</Button>)
      const button = screen.getByRole('button', { name: 'Loading Button' })
      expect(button).toBeDisabled()
    })

    it('should not show spinner when loading is false', () => {
      render(<Button loading={false}>Normal Button</Button>)
      const button = screen.getByRole('button', { name: 'Normal Button' })
      const spinner = button.querySelector('.spinner')
      expect(spinner).not.toBeInTheDocument()
    })
  })

  describe('Disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled Button</Button>)
      const button = screen.getByRole('button', { name: 'Disabled Button' })
      expect(button).toBeDisabled()
    })

    it('should be disabled when both disabled and loading are true', () => {
      render(<Button disabled loading>Disabled Loading Button</Button>)
      const button = screen.getByRole('button', { name: 'Disabled Loading Button' })
      expect(button).toBeDisabled()
    })
  })

  describe('Event handling', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Clickable Button</Button>)
      const button = screen.getByRole('button', { name: 'Clickable Button' })
      
      await user.click(button)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not call onClick when disabled', async () => {
      const handleClick = jest.fn()
      render(<Button disabled onClick={handleClick}>Disabled Button</Button>)
      const button = screen.getByRole('button', { name: 'Disabled Button' })
      
      await user.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should not call onClick when loading', async () => {
      const handleClick = jest.fn()
      render(<Button loading onClick={handleClick}>Loading Button</Button>)
      const button = screen.getByRole('button', { name: 'Loading Button' })
      
      await user.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should handle keyboard events', async () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Keyboard Button</Button>)
      const button = screen.getByRole('button', { name: 'Keyboard Button' })
      
      button.focus()
      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)
      
      await user.keyboard(' ')
      expect(handleClick).toHaveBeenCalledTimes(2)
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<Button aria-label="Custom label">Button</Button>)
      const button = screen.getByRole('button', { name: 'Custom label' })
      expect(button).toBeInTheDocument()
    })

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(<Button ref={ref}>Ref Button</Button>)
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    it('should have focus styles', () => {
      render(<Button>Focus Button</Button>)
      const button = screen.getByRole('button', { name: 'Focus Button' })
      expect(button).toHaveClass('focus:outline-none focus:ring-2')
    })
  })

  describe('Props forwarding', () => {
    it('should forward HTML button attributes', () => {
      render(
        <Button 
          type="submit" 
          form="test-form" 
          data-testid="test-button"
          aria-describedby="description"
        >
          Submit Button
        </Button>
      )
      const button = screen.getByRole('button', { name: 'Submit Button' })
      expect(button).toHaveAttribute('type', 'submit')
      expect(button).toHaveAttribute('form', 'test-form')
      expect(button).toHaveAttribute('data-testid', 'test-button')
      expect(button).toHaveAttribute('aria-describedby', 'description')
    })
  })
}) 