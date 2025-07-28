import { 
  extractIntelligentSearchQuery, 
  performQuickMetadataSearch, 
  performIntelligentZakonSearch,
  getFullTextsByIds,
  formatZakonResultsForAI 
} from '@/lib/intelligent-search'

// Mock OpenAI
jest.mock('openai', () => ({
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn()
      }
    }
  }))
}))

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn()
}))

// Mock environment variables
const originalEnv = process.env
beforeEach(() => {
  jest.resetModules()
  process.env = { ...originalEnv }
  process.env.OPENAI_API_KEY = 'test-openai-key'
  process.env.ZAKON_TOKEN = 'test-zakon-token'
})

afterEach(() => {
  process.env = originalEnv
  jest.clearAllMocks()
})

describe('intelligent-search', () => {
  const mockOpenAI = require('openai').default
  const mockAxios = require('axios')

  describe('extractIntelligentSearchQuery', () => {
    beforeEach(() => {
      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [{ message: { content: '"виселення" AND "приватизації"' } }]
            })
          }
        }
      }))
    })

    it('should extract search query using OpenAI', async () => {
      const userText = 'Я адвокат власника житла. Ситуація: колишній мешканець не проживає давно'
      const result = await extractIntelligentSearchQuery(userText)

      expect(result).toBe('"виселення" AND "приватизації"')
      expect(mockOpenAI).toHaveBeenCalled()
    })

    it('should handle OpenAI errors and use fallback', async () => {
      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: jest.fn().mockRejectedValue(new Error('OpenAI API error'))
          }
        }
      }))

      const userText = 'виселення з житла'
      const result = await extractIntelligentSearchQuery(userText)

      expect(result).toContain('виселення')
    })

    it('should handle empty OpenAI response', async () => {
      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [{ message: { content: '' } }]
            })
          }
        }
      }))

      const userText = 'виселення з житла'
      const result = await extractIntelligentSearchQuery(userText)

      expect(result).toContain('виселення')
    })
  })

  describe('performQuickMetadataSearch', () => {
    beforeEach(() => {
      mockAxios.get.mockResolvedValue({
        data: [
          {
            doc_id: '123',
            title: 'Test Case 1',
            courtLevel: 'Верховний суд',
            adjudication_date: '2024-01-01',
            resolution: 'Задоволено',
            snippet: 'Test snippet'
          }
        ]
      })

      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [{ message: { content: 'Test summary' } }]
            })
          }
        }
      }))
    })

    it('should perform quick metadata search', async () => {
      const searchQuery = '"виселення" AND "приватизації"'
      const result = await performQuickMetadataSearch(searchQuery)

      expect(result.metadata).toHaveLength(1)
      expect(result.totalFound).toBe(1)
      expect(result.summary).toBe('Test summary')
      expect(result.courtLevels).toBeDefined()
    })

    it('should handle no results', async () => {
      mockAxios.get.mockResolvedValue({ data: [] })

      const searchQuery = '"nonexistent"'
      const result = await performQuickMetadataSearch(searchQuery)

      expect(result.metadata).toHaveLength(0)
      expect(result.totalFound).toBe(0)
      expect(result.summary).toContain('не знайдено жодної справи')
    })

    it('should handle API errors', async () => {
      mockAxios.get.mockRejectedValue(new Error('API Error'))

      const searchQuery = '"виселення"'
      const result = await performQuickMetadataSearch(searchQuery)

      expect(result.metadata).toHaveLength(0)
      expect(result.totalFound).toBe(0)
    })
  })

  describe('performIntelligentZakonSearch', () => {
    beforeEach(() => {
      mockAxios.get
        .mockResolvedValueOnce({
          data: [
            {
              doc_id: '123',
              title: 'Test Case 1',
              courtLevel: 'Верховний суд',
              adjudication_date: '2024-01-01',
              resolution: 'Задоволено',
              snippet: 'Test snippet'
            }
          ]
        })
        .mockResolvedValueOnce({
          data: [
            {
              doc_id: '123',
              text: 'Full text of the case',
              title: 'Test Case 1'
            }
          ]
        })
    })

    it('should perform two-phase search', async () => {
      const searchQuery = '"виселення" AND "приватизації"'
      const result = await performIntelligentZakonSearch(searchQuery)

      expect(result.metadata).toHaveLength(1)
      expect(result.fullTexts).toHaveLength(1)
      expect(result.totalFound).toBe(1)
      expect(result.courtLevels).toBeDefined()
    })

    it('should handle no metadata results', async () => {
      mockAxios.get.mockResolvedValue({ data: [] })

      const searchQuery = '"nonexistent"'
      const result = await performIntelligentZakonSearch(searchQuery)

      expect(result.metadata).toHaveLength(0)
      expect(result.fullTexts).toHaveLength(0)
      expect(result.totalFound).toBe(0)
    })
  })

  describe('getFullTextsByIds', () => {
    beforeEach(() => {
      mockAxios.get.mockResolvedValue({
        data: [
          {
            doc_id: '123',
            text: 'Full text of the case',
            title: 'Test Case 1'
          }
        ]
      })
    })

    it('should fetch full texts by doc_id', async () => {
      const cases = [
        {
          doc_id: '123',
          title: 'Test Case 1',
          courtLevel: 'Верховний суд'
        }
      ]

      const result = await getFullTextsByIds(cases)

      expect(result).toHaveLength(1)
      expect(result[0].fullText).toBe('Full text of the case')
      expect(result[0].doc_id).toBe('123')
    })

    it('should handle cases without full text', async () => {
      mockAxios.get.mockResolvedValue({ data: [] })

      const cases = [
        {
          doc_id: '123',
          title: 'Test Case 1',
          snippet: 'Test snippet'
        }
      ]

      const result = await getFullTextsByIds(cases)

      expect(result).toHaveLength(1)
      expect(result[0].fullText).toContain('Test snippet')
    })

    it('should handle API errors gracefully', async () => {
      mockAxios.get.mockRejectedValue(new Error('API Error'))

      const cases = [
        {
          doc_id: '123',
          title: 'Test Case 1',
          snippet: 'Test snippet'
        }
      ]

      const result = await getFullTextsByIds(cases)

      expect(result).toHaveLength(1)
      expect(result[0].fullText).toContain('Test snippet')
    })
  })

  describe('formatZakonResultsForAI', () => {
    it('should format results with data', () => {
      const results = {
        metadata: [
          {
            doc_id: '123',
            title: 'Test Case 1',
            courtLevel: 'Верховний суд',
            adjudication_date: '2024-01-01',
            resolution: 'Задоволено'
          }
        ],
        fullTexts: [
          {
            doc_id: '123',
            title: 'Test Case 1',
            courtLevel: 'Верховний суд',
            adjudication_date: '2024-01-01',
            resolution: 'Задоволено',
            fullText: 'Full text of the case with виселення and приватизація',
            url: 'http://example.com'
          }
        ],
        totalFound: 1,
        courtLevels: {
          'Верховний суд': [{ doc_id: '123' }]
        }
      }

      const formatted = formatZakonResultsForAI(results)

      expect(formatted).toContain('РЕЗУЛЬТАТИ ПОШУКУ В БАЗІ ЗАКОН ОНЛАЙН')
      expect(formatted).toContain('Знайдено 1 справ')
      expect(formatted).toContain('ДЕТАЛЬНИЙ АНАЛІЗ НАЙВАЖЛИВІШИХ СПРАВ')
      expect(formatted).toContain('Test Case 1')
      expect(formatted).toContain('✅ Задоволено позов')
    })

    it('should handle empty results', () => {
      const results = {
        metadata: [],
        fullTexts: [],
        totalFound: 0,
        courtLevels: {}
      }

      const formatted = formatZakonResultsForAI(results)

      expect(formatted).toContain('Нічого не знайдено за вашим запитом')
    })

    it('should format results without full texts', () => {
      const results = {
        metadata: [
          {
            doc_id: '123',
            title: 'Test Case 1',
            courtLevel: 'Верховний суд'
          }
        ],
        fullTexts: [],
        totalFound: 1,
        courtLevels: {
          'Верховний суд': [{ doc_id: '123' }]
        }
      }

      const formatted = formatZakonResultsForAI(results)

      expect(formatted).toContain('Знайдено 1 справ')
      expect(formatted).not.toContain('ДЕТАЛЬНИЙ АНАЛІЗ')
    })
  })

  describe('Error handling', () => {
    it('should handle missing environment variables', async () => {
      delete process.env.OPENAI_API_KEY
      delete process.env.ZAKON_TOKEN

      const userText = 'виселення з житла'
      const result = await extractIntelligentSearchQuery(userText)

      expect(result).toContain('виселення')
    })

    it('should handle network timeouts', async () => {
      mockAxios.get.mockRejectedValue(new Error('timeout'))

      const searchQuery = '"виселення"'
      const result = await performQuickMetadataSearch(searchQuery)

      expect(result.metadata).toHaveLength(0)
      expect(result.totalFound).toBe(0)
    })
  })
}) 