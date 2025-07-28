'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Download, 
  Copy, 
  Save, 
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Building
} from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

interface DocumentTemplate {
  id: string
  name: string
  category: string
  description: string
  estimatedTime: string
  complexity: 'easy' | 'medium' | 'hard'
  tags: string[]
}

interface GeneratedDocument {
  id: string
  name: string
  template: string
  status: 'draft' | 'completed' | 'review'
  createdAt: Date
  lastModified: Date
  size: string
}

const documentTemplates: DocumentTemplate[] = [
  {
    id: '1',
    name: 'Позовна заява про виселення',
    category: 'Цивільні справи',
    description: 'Стандартна позовна заява для виселення особи, що втратила право користування житловим приміщенням',
    estimatedTime: '15-20 хв',
    complexity: 'medium',
    tags: ['виселення', 'житло', 'цивільні справи']
  },
  {
    id: '2',
    name: 'Договір оренди житлового приміщення',
    category: 'Договірне право',
    description: 'Типовий договір оренди з урахуванням останніх змін законодавства',
    estimatedTime: '10-15 хв',
    complexity: 'easy',
    tags: ['оренда', 'житло', 'договір']
  },
  {
    id: '3',
    name: 'Заява про встановлення фактів',
    category: 'Особливе провадження',
    description: 'Заява для встановлення юридично значущих фактів у судовому порядку',
    estimatedTime: '20-25 хв',
    complexity: 'hard',
    tags: ['факти', 'особливе провадження', 'суд']
  },
  {
    id: '4',
    name: 'Апеляційна скарга',
    category: 'Апеляція',
    description: 'Стандартна форма апеляційної скарги з детальним обґрунтуванням',
    estimatedTime: '30-45 хв',
    complexity: 'hard',
    tags: ['апеляція', 'скарга', 'суд']
  },
  {
    id: '5',
    name: 'Договір купівлі-продажу нерухомості',
    category: 'Договірне право',
    description: 'Комплексний договір купівлі-продажу з усіма необхідними умовами',
    estimatedTime: '25-35 хв',
    complexity: 'medium',
    tags: ['нерухомість', 'купівля-продаж', 'договір']
  },
  {
    id: '6',
    name: 'Заява про видачу судового наказу',
    category: 'Судовий наказ',
    description: 'Заява для отримання судового наказу у спрощеному порядку',
    estimatedTime: '10-15 хв',
    complexity: 'easy',
    tags: ['судовий наказ', 'спрощений порядок']
  }
]

const generatedDocuments: GeneratedDocument[] = [
  {
    id: '1',
    name: 'Позовна заява_Іванов_виселення.docx',
    template: 'Позовна заява про виселення',
    status: 'completed',
    createdAt: new Date('2024-01-15'),
    lastModified: new Date('2024-01-15'),
    size: '45 KB'
  },
  {
    id: '2',
    name: 'Договір оренди_Петренко_квартира.docx',
    template: 'Договір оренди житлового приміщення',
    status: 'draft',
    createdAt: new Date('2024-01-14'),
    lastModified: new Date('2024-01-16'),
    size: '32 KB'
  },
  {
    id: '3',
    name: 'Апеляційна скарга_Сидоренко_справа_123.docx',
    template: 'Апеляційна скарга',
    status: 'review',
    createdAt: new Date('2024-01-13'),
    lastModified: new Date('2024-01-15'),
    size: '78 KB'
  }
]

export default function DocumentGeneratorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [clientName, setClientName] = useState('')
  const [caseDetails, setCaseDetails] = useState('')

  const categories = Array.from(new Set(documentTemplates.map(t => t.category)))

  const filteredTemplates = documentTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleGenerateDocument = async () => {
    if (!selectedTemplate) return

    setIsGenerating(true)
    
    // Симуляция генерации документа
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsGenerating(false)
    
    // Здесь будет логика генерации документа
    console.log('Generating document:', {
      template: selectedTemplate.name,
      clientName,
      caseDetails
    })
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'easy': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'hard': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400'
      case 'draft': return 'bg-yellow-500/20 text-yellow-400'
      case 'review': return 'bg-blue-500/20 text-blue-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-full max-w-7xl mx-auto">
        {/* Header */}
        <header className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-400" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">Генератор документів</h1>
                <p className="text-text-secondary">Створюйте юридичні документи з використанням AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Plus size={16} className="mr-2" />
                Новий документ
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex gap-6 p-6">
          {/* Left Panel - Templates */}
          <div className="w-1/2 space-y-6">
            <div className="bg-surface-light rounded-lg p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Шаблони документів</h2>
              
              {/* Search and Filter */}
              <div className="flex gap-3 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={16} />
                  <Input
                    placeholder="Пошук шаблонів..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-surface-medium border border-surface-light rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Всі категорії</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Templates List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {filteredTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedTemplate?.id === template.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-surface-light bg-surface-medium hover:bg-surface-light'
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-text-primary">{template.name}</h3>
                          <p className="text-sm text-text-secondary mt-1">{template.description}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-xs text-text-secondary">
                              ⏱️ {template.estimatedTime}
                            </span>
                            <span className={`text-xs ${getComplexityColor(template.complexity)}`}>
                              {template.complexity === 'easy' ? 'Легко' : 
                               template.complexity === 'medium' ? 'Середньо' : 'Складно'}
                            </span>
                            <span className="text-xs text-text-secondary">
                              {template.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Panel - Document Generation */}
          <div className="w-1/2 space-y-6">
            {selectedTemplate ? (
              <div className="bg-surface-light rounded-lg p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                  Генерація документа
                </h2>
                
                <div className="space-y-6">
                  {/* Template Info */}
                  <div className="bg-surface-medium rounded-lg p-4">
                    <h3 className="font-medium text-text-primary mb-2">{selectedTemplate.name}</h3>
                    <p className="text-sm text-text-secondary">{selectedTemplate.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-text-secondary">
                        ⏱️ {selectedTemplate.estimatedTime}
                      </span>
                      <span className={`text-xs ${getComplexityColor(selectedTemplate.complexity)}`}>
                        {selectedTemplate.complexity === 'easy' ? 'Легко' : 
                         selectedTemplate.complexity === 'medium' ? 'Середньо' : 'Складно'}
                      </span>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Ім'я клієнта
                      </label>
                      <Input
                        placeholder="Введіть ім'я клієнта"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Деталі справи
                      </label>
                      <Textarea
                        placeholder="Опишіть деталі справи для більш точної генерації документа..."
                        value={caseDetails}
                        onChange={(e) => setCaseDetails(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerateDocument}
                    disabled={!clientName.trim() || isGenerating}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Генеруємо документ...
                      </>
                    ) : (
                      <>
                        <FileText size={16} className="mr-2" />
                        Згенерувати документ
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-surface-light rounded-lg p-6 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="text-text-secondary mx-auto mb-4" size={48} />
                  <h3 className="text-lg font-medium text-text-primary mb-2">
                    Оберіть шаблон
                  </h3>
                  <p className="text-text-secondary">
                    Виберіть шаблон документа зі списку зліва для початку генерації
                  </p>
                </div>
              </div>
            )}

            {/* Recent Documents */}
            <div className="bg-surface-light rounded-lg p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Останні документи</h2>
              
              <div className="space-y-3">
                {generatedDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-surface-medium rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-text-primary text-sm">{doc.name}</h4>
                      <p className="text-xs text-text-secondary mt-1">{doc.template}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-text-secondary">
                          {doc.lastModified.toLocaleDateString('uk-UA')}
                        </span>
                        <span className="text-xs text-text-secondary">{doc.size}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(doc.status)}`}>
                        {doc.status === 'completed' ? 'Завершено' :
                         doc.status === 'draft' ? 'Чернетка' : 'На перегляді'}
                      </span>
                      <Button size="sm" className="bg-surface-medium hover:bg-surface-light">
                        <Download size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
} 