import { cn, formatDate, formatDateTime, generateId, truncateText, debounce } from '@/lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional')).toBe('base conditional')
      expect(cn('base', false && 'conditional')).toBe('base')
    })

    it('should handle arrays and objects', () => {
      expect(cn(['class1', 'class2'], { class3: true, class4: false })).toBe('class1 class2 class3')
    })

    it('should handle Tailwind conflicts', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
    })
  })

  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const date = '2023-12-25'
      const result = formatDate(date)
      expect(result).toBe('Dec 25, 2023')
    })

    it('should format Date object correctly', () => {
      const date = new Date('2023-12-25')
      const result = formatDate(date)
      expect(result).toBe('Dec 25, 2023')
    })

    it('should handle different date formats', () => {
      const date = '2023-01-01T00:00:00.000Z'
      const result = formatDate(date)
      expect(result).toMatch(/Jan 1, 2023/)
    })
  })

  describe('formatDateTime', () => {
    it('should format date and time correctly', () => {
      const date = '2023-12-25T14:30:00'
      const result = formatDateTime(date)
      expect(result).toMatch(/Dec 25, 2023/)
      expect(result).toMatch(/2:30 PM/)
    })

    it('should format Date object with time', () => {
      const date = new Date('2023-12-25T14:30:00')
      const result = formatDateTime(date)
      expect(result).toMatch(/Dec 25, 2023/)
      expect(result).toMatch(/2:30 PM/)
    })
  })

  describe('generateId', () => {
    it('should generate a string', () => {
      const id = generateId()
      expect(typeof id).toBe('string')
      expect(id.length).toBe(9)
    })

    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })

    it('should generate alphanumeric IDs', () => {
      const id = generateId()
      expect(id).toMatch(/^[a-z0-9]+$/)
    })
  })

  describe('truncateText', () => {
    it('should truncate text longer than maxLength', () => {
      const text = 'This is a very long text that needs to be truncated'
      const result = truncateText(text, 20)
      expect(result).toBe('This is a very long ...')
      expect(result.length).toBe(23) // 20 + 3 for '...'
    })

    it('should not truncate text shorter than maxLength', () => {
      const text = 'Short text'
      const result = truncateText(text, 20)
      expect(result).toBe('Short text')
    })

    it('should handle empty string', () => {
      const result = truncateText('', 10)
      expect(result).toBe('')
    })

    it('should handle exact length text', () => {
      const text = 'Exactly ten'
      const result = truncateText(text, 10)
      expect(result).toBe('Exactly te...')
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should debounce function calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 1000)

      // Call multiple times
      debouncedFn('test1')
      debouncedFn('test2')
      debouncedFn('test3')

      // Function should not be called immediately
      expect(mockFn).not.toHaveBeenCalled()

      // Fast forward time
      jest.advanceTimersByTime(1000)

      // Function should be called once with the last argument
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('test3')
    })

    it('should handle multiple debounced calls with delays', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 500)

      debouncedFn('first')
      jest.advanceTimersByTime(300)
      debouncedFn('second')
      jest.advanceTimersByTime(300)
      debouncedFn('third')
      jest.advanceTimersByTime(500)

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('third')
    })

    it('should clear previous timeout on new calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 1000)

      debouncedFn('test1')
      jest.advanceTimersByTime(500)
      debouncedFn('test2')
      jest.advanceTimersByTime(500)

      // Should not be called yet
      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(500)

      // Should be called with the last argument
      expect(mockFn).toHaveBeenCalledWith('test2')
    })
  })
}) 