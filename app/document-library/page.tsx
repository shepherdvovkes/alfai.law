'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Folder, 
  FileText, 
  Download, 
  Edit, 
  Trash2, 
  Share, 
  Search,
  Filter,
  Calendar,
  User,
  Eye,
  Star,
  MoreVertical,
  Grid,
  List,
  Upload,
  Heart,
  Copy,
  ExternalLink,
  Loader2
} from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface Document {
  id: string
  name: string
  type: string
  category: string
  client: string
  status: 'active' | 'archived' | 'draft'
  size: string
  createdAt: Date
  lastModified: Date
  tags: string[]
  isFavorite: boolean
  description: string
  source: 'generated' | 'uploaded' | 'downloaded'
  content?: string
  url?: string
  metadata?: any
}

// Демо документы с реальными ID из Закон.Онлайн
const demoDocuments: Document[] = [
  {
    id: 'test',
    name: 'Позовна заява_Іванов_виселення.docx',
    type: 'Позовна заява',
    category: 'Цивільні справи',
    client: 'Іванов І.І.',
    status: 'active',
    size: '45 KB',
    createdAt: new Date('2024-01-15'),
    lastModified: new Date('2024-01-15'),
    tags: ['виселення', 'житло', 'цивільні справи'],
    isFavorite: true,
    description: 'Позовна заява про виселення особи, що втратила право користування житловим приміщенням',
    source: 'generated',
    content: 'Повний текст позовної заяви...',
    url: '/documents/test'
  },
  {
    id: 'real_case_1',
    name: 'Апеляційна скарга_Сидоренко_справа_123.docx',
    type: 'Апеляційна скарга',
    category: 'Апеляція',
    client: 'Сидоренко С.С.',
    status: 'active',
    size: '78 KB',
    createdAt: new Date('2024-01-13'),
    lastModified: new Date('2024-01-15'),
    tags: ['апеляція', 'скарга', 'суд'],
    isFavorite: true,
    description: 'Апеляційна скарга з детальним обґрунтуванням позиції клієнта',
    source: 'downloaded',
    content: 'Повний текст апеляційної скарги...',
    url: '/documents/real_case_1'
  },
  {
    id: 'real_case_2',
    name: 'Рішення суду_Петренко_виселення.docx',
    type: 'Рішення суду',
    category: 'Цивільні справи',
    client: 'Петренко П.П.',
    status: 'active',
    size: '67 KB',
    createdAt: new Date('2024-01-08'),
    lastModified: new Date('2024-01-10'),
    tags: ['рішення', 'виселення', 'суд'],
    isFavorite: false,
    description: 'Рішення суду про виселення особи, що втратила право користування житлом',
    source: 'downloaded',
    content: 'Повний текст рішення суду...',
    url: '/documents/real_case_2'
  },
  {
    id: 'demo_case_1',
    name: 'Демо документ з Закон.Онлайн',
    type: 'Демо документ',
    category: 'Демо',
    client: 'Демо клієнт',
    status: 'active',
    size: '25 KB',
    createdAt: new Date('2024-01-20'),
    lastModified: new Date('2024-01-20'),
    tags: ['демо', 'тест'],
    isFavorite: false,
    description: 'Демонстраційний документ для тестування завантаження з Закон.Онлайн',
    source: 'downloaded',
    content: 'Це демонстраційний документ для тестування функціональності завантаження повних текстів з бази Закон.Онлайн.',
    url: '/documents/demo_case_1'
  }
]

export default function DocumentLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedSource, setSelectedSource] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date')
  const [showPreview, setShowPreview] = useState<string | null>(null)
  const [showMenu, setShowMenu] = useState<string | null>(null)
  const [documents, setDocuments] = useState<Document[]>(demoDocuments)
  const [loadingDocuments, setLoadingDocuments] = useState<{[key: string]: boolean}>({})
  const [realDocuments, setRealDocuments] = useState<{[key: string]: Document}>({})

  const categories = Array.from(new Set(documents.map(d => d.category)))
  const statuses = Array.from(new Set(documents.map(d => d.status)))
  const sources = Array.from(new Set(documents.map(d => d.source)))

  // Функция для загрузки реального документа из Закон.Онлайн
  const loadRealDocument = async (docId: string) => {
    if (realDocuments[docId]) {
      return realDocuments[docId]
    }

    setLoadingDocuments(prev => ({ ...prev, [docId]: true }))

    try {
      const response = await fetch(`/api/documents/${docId}`)
      const data = await response.json()

      if (data.success && data.document) {
        const realDoc = data.document
        setRealDocuments(prev => ({ ...prev, [docId]: realDoc }))
        setLoadingDocuments(prev => ({ ...prev, [docId]: false }))
        return realDoc
      } else {
        console.error('Failed to load document:', data.error)
        setLoadingDocuments(prev => ({ ...prev, [docId]: false }))
        return null
      }
    } catch (error) {
      console.error('Error loading document:', error)
      setLoadingDocuments(prev => ({ ...prev, [docId]: false }))
      return null
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         doc.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus
    const matchesSource = selectedSource === 'all' || doc.source === selectedSource
    return matchesSearch && matchesCategory && matchesStatus && matchesSource
  })

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'date':
        return b.lastModified.getTime() - a.lastModified.getTime()
      case 'size':
        return parseInt(a.size) - parseInt(b.size)
      default:
        return 0
    }
  })

  const handleDocumentSelect = (docId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    )
  }

  const handleSelectAll = () => {
    if (selectedDocuments.length === sortedDocuments.length) {
      setSelectedDocuments([])
    } else {
      setSelectedDocuments(sortedDocuments.map(doc => doc.id))
    }
  }

  // Реальные функции для иконок
  const handleViewDocument = async (doc: Document) => {
    // Если это реальный документ из Закон.Онлайн, загружаем его
    if (doc.id.startsWith('real_case_')) {
      const realDoc = await loadRealDocument(doc.id)
      if (realDoc) {
        setShowPreview(doc.id)
        console.log('Перегляд документа з Закон.Онлайн:', realDoc.name)
      } else {
        alert('Не вдалося завантажити документ з Закон.Онлайн')
      }
    } else {
      setShowPreview(doc.id)
      console.log('Перегляд документа:', doc.name)
    }
  }

  const handleDownloadDocument = async (doc: Document) => {
    let content = doc.content || ''
    
    // Если это реальный документ, загружаем его из Закон.Онлайн
    if (doc.id.startsWith('real_case_')) {
      const realDoc = await loadRealDocument(doc.id)
      if (realDoc) {
        content = realDoc.content || ''
      }
    }

    // Создаем ссылку для загрузки
    const link = document.createElement('a')
    link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`
    link.download = doc.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    console.log('Завантаження документа:', doc.name)
  }

  const handleEditDocument = (doc: Document) => {
    console.log('Редагування документа:', doc.name)
    // Здесь можно открыть редактор или перейти на страницу редактирования
    window.open(`/document-editor/${doc.id}`, '_blank')
  }

  const handleShareDocument = (doc: Document) => {
    if (navigator.share) {
      navigator.share({
        title: doc.name,
        text: doc.description,
        url: doc.url || window.location.href
      })
    } else {
      // Fallback для браузеров без поддержки Web Share API
      navigator.clipboard.writeText(doc.url || window.location.href)
      alert('Посилання скопійовано в буфер обміну')
    }
    console.log('Поділ документа:', doc.name)
  }

  const handleCopyDocument = async (doc: Document) => {
    let content = doc.content || ''
    
    // Если это реальный документ, загружаем его из Закон.Онлайн
    if (doc.id.startsWith('real_case_')) {
      const realDoc = await loadRealDocument(doc.id)
      if (realDoc) {
        content = realDoc.content || ''
      }
    }

    navigator.clipboard.writeText(content)
    console.log('Копіювання документа:', doc.name)
  }

  const handleToggleFavorite = (doc: Document) => {
    console.log('Зміна статусу улюбленого для документа:', doc.name)
    // Здесь можно обновить состояние в базе данных
  }

  const handleDeleteDocument = (doc: Document) => {
    if (confirm(`Ви впевнені, що хочете видалити документ "${doc.name}"?`)) {
      console.log('Видалення документа:', doc.name)
      // Здесь можно удалить документ из базы данных
    }
  }

  const handleUploadDocument = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.doc,.docx,.pdf,.txt'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        console.log('Завантаження файлу:', file.name)
        // Здесь можно загрузить файл на сервер
      }
    }
    input.click()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400'
      case 'draft': return 'bg-yellow-500/20 text-yellow-400'
      case 'archived': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активний'
      case 'draft': return 'Чернетка'
      case 'archived': return 'Архів'
      default: return status
    }
  }

  const getSourceText = (source: string) => {
    switch (source) {
      case 'generated': return 'Згенерований'
      case 'uploaded': return 'Завантажений'
      case 'downloaded': return 'Завантажений'
      default: return source
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'generated': return 'bg-blue-500/20 text-blue-400'
      case 'uploaded': return 'bg-green-500/20 text-green-400'
      case 'downloaded': return 'bg-purple-500/20 text-purple-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  // Получаем актуальный документ (демо или реальный)
  const getCurrentDocument = (doc: Document) => {
    if (doc.id.startsWith('real_case_') && realDocuments[doc.id]) {
      return realDocuments[doc.id]
    }
    return doc
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-full max-w-7xl mx-auto">
        {/* Header */}
        <header className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Folder className="text-purple-400" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">Бібліотека документів</h1>
                <p className="text-text-secondary">Управління та організація юридичних документів</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                className="bg-purple-500 hover:bg-purple-600"
                onClick={handleUploadDocument}
              >
                <Upload size={16} className="mr-2" />
                Завантажити
              </Button>
            </div>
          </div>
        </header>

        {/* Filters and Search */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={16} />
              <Input
                placeholder="Пошук документів..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-surface-medium border border-surface-light rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Всі категорії</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-surface-medium border border-surface-light rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Всі статуси</option>
              {statuses.map(status => (
                <option key={status} value={status}>{getStatusText(status)}</option>
              ))}
            </select>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-3 py-2 bg-surface-medium border border-surface-light rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Всі джерела</option>
              {sources.map(source => (
                <option key={source} value={source}>{getSourceText(source)}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'size')}
              className="px-3 py-2 bg-surface-medium border border-surface-light rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="date">За датою</option>
              <option value="name">За назвою</option>
              <option value="size">За розміром</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className={selectedDocuments.length === sortedDocuments.length ? 'bg-purple-500/20' : ''}
              >
                {selectedDocuments.length === sortedDocuments.length ? 'Зняти виділення' : 'Вибрати всі'}
              </Button>
              {selectedDocuments.length > 0 && (
                <span className="text-sm text-text-secondary">
                  Вибрано: {selectedDocuments.length} документів
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-purple-500/20' : ''}
              >
                <Grid size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-purple-500/20' : ''}
              >
                <List size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Documents Grid/List */}
        <div className="flex-1 p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence>
                {sortedDocuments.map((doc) => {
                  const currentDoc = getCurrentDocument(doc)
                  const isLoading = loadingDocuments[doc.id]
                  
                  return (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`bg-surface-light rounded-lg p-4 border cursor-pointer transition-all ${
                        selectedDocuments.includes(doc.id) 
                          ? 'border-purple-500 bg-purple-500/10' 
                          : 'border-surface-light hover:border-purple-500/50'
                      }`}
                      onClick={() => handleDocumentSelect(doc.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          {isLoading ? (
                            <Loader2 className="text-purple-400 animate-spin" size={20} />
                          ) : (
                            <FileText className="text-purple-400" size={20} />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="p-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleFavorite(doc)
                            }}
                          >
                            {currentDoc.isFavorite ? (
                              <Heart className="text-red-400" size={14} fill="currentColor" />
                            ) : (
                              <Star className="text-yellow-400" size={14} />
                            )}
                          </Button>
                          <div className="relative">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="p-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowMenu(showMenu === doc.id ? null : doc.id)
                              }}
                            >
                              <MoreVertical size={14} />
                            </Button>
                            {showMenu === doc.id && (
                              <div className="absolute right-0 top-8 bg-surface-dark border border-surface-light rounded-lg shadow-lg z-10 min-w-[150px]">
                                <div className="p-1">
                                  <button
                                    className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-light rounded flex items-center gap-2"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleViewDocument(doc)
                                      setShowMenu(null)
                                    }}
                                  >
                                    <Eye size={14} />
                                    Переглянути
                                  </button>
                                  <button
                                    className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-light rounded flex items-center gap-2"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleEditDocument(doc)
                                      setShowMenu(null)
                                    }}
                                  >
                                    <Edit size={14} />
                                    Редагувати
                                  </button>
                                  <button
                                    className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-light rounded flex items-center gap-2"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDownloadDocument(doc)
                                      setShowMenu(null)
                                    }}
                                  >
                                    <Download size={14} />
                                    Завантажити
                                  </button>
                                  <button
                                    className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-light rounded flex items-center gap-2"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleShareDocument(doc)
                                      setShowMenu(null)
                                    }}
                                  >
                                    <Share size={14} />
                                    Поділитися
                                  </button>
                                  <button
                                    className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-light rounded flex items-center gap-2"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleCopyDocument(doc)
                                      setShowMenu(null)
                                    }}
                                  >
                                    <Copy size={14} />
                                    Копіювати
                                  </button>
                                  <hr className="my-1 border-surface-light" />
                                  <button
                                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-surface-light rounded flex items-center gap-2"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteDocument(doc)
                                      setShowMenu(null)
                                    }}
                                  >
                                    <Trash2 size={14} />
                                    Видалити
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="font-medium text-text-primary text-sm mb-1 truncate">{currentDoc.name}</h3>
                      <p className="text-xs text-text-secondary mb-2 line-clamp-2">{currentDoc.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-secondary">Клієнт:</span>
                          <span className="text-text-primary">{currentDoc.client}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-secondary">Розмір:</span>
                          <span className="text-text-primary">{currentDoc.size}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-secondary">Дата:</span>
                          <span className="text-text-primary">
                            {currentDoc.lastModified.toLocaleDateString('uk-UA')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-light">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(currentDoc.status)}`}>
                            {getStatusText(currentDoc.status)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getSourceColor(currentDoc.source)}`}>
                            {getSourceText(currentDoc.source)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="p-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewDocument(doc)
                            }}
                          >
                            <Eye size={12} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="p-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownloadDocument(doc)
                            }}
                          >
                            <Download size={12} />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {sortedDocuments.map((doc) => {
                  const currentDoc = getCurrentDocument(doc)
                  const isLoading = loadingDocuments[doc.id]
                  
                  return (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`bg-surface-light rounded-lg p-4 border cursor-pointer transition-all ${
                        selectedDocuments.includes(doc.id) 
                          ? 'border-purple-500 bg-purple-500/10' 
                          : 'border-surface-light hover:border-purple-500/50'
                      }`}
                      onClick={() => handleDocumentSelect(doc.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            {isLoading ? (
                              <Loader2 className="text-purple-400 animate-spin" size={20} />
                            ) : (
                              <FileText className="text-purple-400" size={20} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-text-primary truncate">{currentDoc.name}</h3>
                              {currentDoc.isFavorite && <Star className="text-yellow-400" size={14} fill="currentColor" />}
                            </div>
                            <p className="text-sm text-text-secondary truncate">{currentDoc.description}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-xs text-text-secondary">{currentDoc.client}</span>
                              <span className="text-xs text-text-secondary">{currentDoc.category}</span>
                              <span className="text-xs text-text-secondary">{currentDoc.size}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(currentDoc.status)}`}>
                            {getStatusText(currentDoc.status)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getSourceColor(currentDoc.source)}`}>
                            {getSourceText(currentDoc.source)}
                          </span>
                          <span className="text-xs text-text-secondary">
                            {currentDoc.lastModified.toLocaleDateString('uk-UA')}
                          </span>
                          <div className="flex items-center gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="p-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewDocument(doc)
                              }}
                            >
                              <Eye size={14} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="p-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditDocument(doc)
                              }}
                            >
                              <Edit size={14} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="p-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDownloadDocument(doc)
                              }}
                            >
                              <Download size={14} />
                            </Button>
                            <div className="relative">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="p-1"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowMenu(showMenu === doc.id ? null : doc.id)
                                }}
                              >
                                <MoreVertical size={14} />
                              </Button>
                              {showMenu === doc.id && (
                                <div className="absolute right-0 top-8 bg-surface-dark border border-surface-light rounded-lg shadow-lg z-10 min-w-[150px]">
                                  <div className="p-1">
                                    <button
                                      className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-light rounded flex items-center gap-2"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleShareDocument(doc)
                                        setShowMenu(null)
                                      }}
                                    >
                                      <Share size={14} />
                                      Поділитися
                                    </button>
                                    <button
                                      className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-light rounded flex items-center gap-2"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleCopyDocument(doc)
                                        setShowMenu(null)
                                      }}
                                    >
                                      <Copy size={14} />
                                      Копіювати
                                    </button>
                                    <hr className="my-1 border-surface-light" />
                                    <button
                                      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-surface-light rounded flex items-center gap-2"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteDocument(doc)
                                        setShowMenu(null)
                                      }}
                                    >
                                      <Trash2 size={14} />
                                      Видалити
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}

          {sortedDocuments.length === 0 && (
            <div className="text-center py-12">
              <Folder className="text-text-secondary mx-auto mb-4" size={48} />
              <h3 className="text-lg font-medium text-text-primary mb-2">
                Документи не знайдено
              </h3>
              <p className="text-text-secondary">
                Спробуйте змінити фільтри або пошуковий запит
              </p>
            </div>
          )}
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-surface-dark border border-surface-light rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-text-primary">
                  {(() => {
                    const doc = documents.find(d => d.id === showPreview)
                    const currentDoc = doc ? getCurrentDocument(doc) : null
                    return currentDoc?.name || 'Документ'
                  })()}
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowPreview(null)}
                >
                  ✕
                </Button>
              </div>
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-text-primary bg-surface-light p-4 rounded">
                  {(() => {
                    const doc = documents.find(d => d.id === showPreview)
                    if (!doc) return 'Документ не знайдено'
                    
                    const currentDoc = getCurrentDocument(doc)
                    return currentDoc?.content || 'Вміст документа недоступний'
                  })()}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
} 