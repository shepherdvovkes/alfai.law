'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { motion, AnimatePresence } from 'framer-motion'

interface Case {
  id: string
  title: string
  cause_num: string
  courtLevel: string
  adjudication_date: string
  resolution: string
  fullText: string
  url: string
  doc_id: string
}

export default function FullTextsPage() {
  const [cases, setCases] = useState<Case[]>([])
  const [filteredCases, setFilteredCases] = useState<Case[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourt, setSelectedCourt] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)

  useEffect(() => {
    // Загружаем данные о делах из localStorage или API
    const loadCases = async () => {
      try {
        // Здесь будет загрузка из API или localStorage
        // Пока используем моковые данные
        const mockCases: Case[] = [
          {
            id: '1',
            title: 'Постанова від 17.03.2023 по справі № 447/3813/21',
            cause_num: '447/3813/21',
            courtLevel: 'Верховний суд / Касаційні суди',
            adjudication_date: '2023-03-17',
            resolution: 'Про визнання особи такою, що втратила право користування житловим приміщенням',
            fullText: 'Повний текст рішення суду...',
            url: 'https://zakononline.com.ua/court-decisions/show/123456',
            doc_id: '123456'
          },
          // Добавьте больше моковых данных
        ]
        
        setCases(mockCases)
        setFilteredCases(mockCases)
      } catch (error) {
        console.error('Ошибка загрузки дел:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCases()
  }, [])

  useEffect(() => {
    // Фильтрация дел
    let filtered = cases

    if (searchTerm) {
      filtered = filtered.filter(caseItem =>
        caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.cause_num.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.resolution.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCourt !== 'all') {
      filtered = filtered.filter(caseItem => caseItem.courtLevel === selectedCourt)
    }

    setFilteredCases(filtered)
  }, [cases, searchTerm, selectedCourt])

  const courtLevels = Array.from(new Set(cases.map(c => c.courtLevel)))

  const handleDownloadAll = () => {
    // Логика скачивания всех дел
    console.log('Скачиваем все дела...')
  }

  const handleDownloadCase = (caseItem: Case) => {
    // Логика скачивания конкретного дела
    console.log('Скачиваем дело:', caseItem.cause_num)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Завантаження справ...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Повні тексти судових рішень</h1>
            <p className="text-gray-600">Всього справ: {cases.length}</p>
          </div>
          <Button onClick={handleDownloadAll} className="bg-blue-500 hover:bg-blue-600">
            📥 Завантажити всі
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пошук
              </label>
              <Input
                type="text"
                placeholder="Номер справи або ключові слова..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Судова інстанція
              </label>
              <select
                value={selectedCourt}
                onChange={(e) => setSelectedCourt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Всі інстанції</option>
                {courtLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCourt('all')
                }}
                className="w-full bg-gray-500 hover:bg-gray-600"
              >
                Очистити фільтри
              </Button>
            </div>
          </div>
        </div>

        {/* Cases List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Список справ ({filteredCases.length})
              </h2>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              <AnimatePresence>
                {filteredCases.map((caseItem, index) => (
                  <motion.div
                    key={caseItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedCase?.id === caseItem.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedCase(caseItem)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">
                          {caseItem.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          №{caseItem.cause_num} • {caseItem.courtLevel}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(caseItem.adjudication_date).toLocaleDateString('uk-UA')}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownloadCase(caseItem)
                        }}
                        className="ml-2 bg-green-500 hover:bg-green-600"
                      >
                        📥
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredCases.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <p>Справи не знайдено</p>
                </div>
              )}
            </div>
          </div>

          {/* Case Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Деталі справи
              </h2>
            </div>
            
            <div className="p-4">
              {selectedCase ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {selectedCase.title}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Номер справи:</span>
                        <p className="font-medium">{selectedCase.cause_num}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Суд:</span>
                        <p className="font-medium">{selectedCase.courtLevel}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Дата:</span>
                        <p className="font-medium">
                          {new Date(selectedCase.adjudication_date).toLocaleDateString('uk-UA')}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Рішення:</span>
                        <p className="font-medium">{selectedCase.resolution}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Повний текст рішення:</h4>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto text-sm">
                      <pre className="whitespace-pre-wrap text-gray-700">
                        {selectedCase.fullText}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => window.open(selectedCase.url, '_blank')}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      🔗 Відкрити оригінал
                    </Button>
                    <Button
                      onClick={() => handleDownloadCase(selectedCase)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      📥 Завантажити
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>Оберіть справу для перегляду деталей</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 