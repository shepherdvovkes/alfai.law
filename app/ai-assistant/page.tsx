'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Bot,
  User,
  Settings
} from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Message } from '@/types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ExtendedMessage extends Message {
  showSuggestions?: boolean
  analysis?: string
  stats?: any
  isAnalyzing?: boolean
  analysisStatus?: string
  algorithmLogs?: string[]
  showAlgorithmLogs?: boolean
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ExtendedMessage[]>([
    {
      id: '1',
      content: "Привіт! Я ваш персональний юридичний AI-асистент. Чим я можу допомогти вам сьогодні?",
      sender: 'ai',
      timestamp: new Date(),
      showSuggestions: false
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [ws, setWs] = useState<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null)
  const [analysisSteps] = useState([
    'Завантажую повні тексти справ...',
    'Аналізую ключові правові позиції...',
    'Виділяю практичні висновки...',
    'Формую стратегічні рекомендації...',
    'Створюю детальний звіт...',
    'Завершую аналіз...'
  ])
  const [algorithmLogs] = useState([
    'Аналізую запит користувача...',
    'Витягую ключові слова через OpenAI API...',
    'Відправляю запит до Zakon Online API...',
    'Отримую метадані справ...',
    'Аналізую розподіл по судових інстанціях...',
    'Генерую резюме через ChatGPT...',
    'Формую фінальну відповідь...'
  ])

  // Единая функция для плавной прокрутки
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // useEffect для прокрутки при обновлении сообщений
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // useEffect для авто-ресайза textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  useEffect(() => {
    let reconnectAttempts = 0
    const maxReconnectAttempts = 5
    
    const connectWebSocket = () => {
      console.log('[AI Assistant] 🔌 Attempting WebSocket connection...')
      const websocket = new WebSocket('ws://localhost:3001')
      
      websocket.onopen = () => {
        console.log('[AI Assistant] ✅ WebSocket connected successfully')
        reconnectAttempts = 0
      }
      
      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        console.log('[AI Assistant] 📨 Received WebSocket message:', data.type, 'messageId:', data.messageId)
        
        if (data.type === 'message') {
          setMessages(prev => prev.map(msg => 
            msg.id === data.messageId 
              ? { ...msg, content: msg.content + data.content }
              : msg
          ))
        } else if (data.type === 'algorithmLog') {
          setMessages(prev => prev.map(msg => 
            msg.id === data.messageId 
              ? { 
                  ...msg, 
                  algorithmLogs: [...(msg.algorithmLogs || []), data.log],
                  showAlgorithmLogs: true
                }
              : msg
          ))
        } else if (data.type === 'complete') {
          console.log('[AI Assistant] ✅ Chat complete for messageId:', data.messageId)
          setIsLoading(false)
          setMessages(prev => prev.map(msg => 
            msg.id === data.messageId 
              ? { ...msg, showSuggestions: true, showAlgorithmLogs: false }
              : msg
          ))
        } else if (data.type === 'analyzeComplete') {
          console.log('[AI Assistant] ✅ Analysis complete for messageId:', data.messageId)
          setMessages(prev => prev.map(msg => 
            msg.id === data.messageId 
              ? { ...msg, analysis: data.analysis, stats: data.stats, isAnalyzing: false, analysisStatus: undefined }
              : msg
          ))
        } else if (data.type === 'analyzeError') {
          console.error('[AI Assistant] ❌ Analysis error for messageId:', data.messageId, 'error:', data.error)
          setMessages(prev => prev.map(msg => 
            msg.id === data.messageId 
              ? { ...msg, isAnalyzing: false, analysisStatus: undefined }
              : msg
          ))
        } else {
          console.log('[AI Assistant] ❓ Unknown message type:', data.type)
        }
      }
      
      websocket.onerror = (error) => {
        console.error('[AI Assistant] ❌ WebSocket error:', error)
      }
      
      websocket.onclose = (event) => {
        console.log('[AI Assistant] 🔌 WebSocket closed:', event.code, event.reason)
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++
          console.log(`[AI Assistant] 🔄 Reconnecting... Attempt ${reconnectAttempts}/${maxReconnectAttempts}`)
          setTimeout(connectWebSocket, 2000)
        } else {
          console.error('[AI Assistant] ❌ Max reconnection attempts reached')
        }
      }
      
      setWs(websocket)
    }
    
    connectWebSocket()
    
    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    const userMessage: ExtendedMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      showSuggestions: false
    };

    const aiMessageId = (Date.now() + 1).toString();
    
    // Добавляем сообщение пользователя и пустое сообщение AI для стриминга
    setMessages(prev => [
      ...prev, 
      userMessage,
      {
        id: aiMessageId,
        content: '',
        sender: 'ai',
        timestamp: new Date(),
        showSuggestions: false,
        showAlgorithmLogs: true,
        algorithmLogs: []
      }
    ]);
    
    setInputMessage('');
    setIsLoading(true);
    setCurrentMessageId(aiMessageId);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'message',
        message: inputMessage,
        messageId: aiMessageId
      }));
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleViewFullText = (messageId?: string) => {
    // Переход на страницу Document Library в том же окне
    window.location.href = '/document-library'
  }

  const handleAnalyze = (messageId?: string) => {
    const targetMessageId = messageId || currentMessageId
    console.log('[AI Assistant] 🔍 Analyze button clicked:', { messageId, currentMessageId, targetMessageId, wsReady: ws?.readyState })
    
    if (!targetMessageId) {
      console.error('[AI Assistant] ❌ No messageId available for analysis')
      return
    }
    
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error('[AI Assistant] ❌ WebSocket not ready:', ws?.readyState)
      return
    }
    
    // Отправляем запрос на анализ
    console.log('[AI Assistant] 📤 Sending analyze request for messageId:', targetMessageId)
    ws.send(JSON.stringify({
      type: 'analyze',
      messageId: targetMessageId
    }))
    
    // Показываем индикатор загрузки анализа
    setMessages(prev => prev.map(msg => 
      msg.id === targetMessageId 
        ? { ...msg, isAnalyzing: true, analysisStatus: analysisSteps[0] }
        : msg
    ))
    
    // Запускаем анимацию статусов
    let stepIndex = 0
    const statusInterval = setInterval(() => {
      stepIndex++
      if (stepIndex < analysisSteps.length) {
        setMessages(prev => prev.map(msg => 
          msg.id === targetMessageId 
            ? { ...msg, analysisStatus: analysisSteps[stepIndex] }
            : msg
        ))
      } else {
        clearInterval(statusInterval)
      }
    }, 2000) // Меняем статус каждые 2 секунды
  }

  const handleExpressGratitude = (messageId?: string) => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  // Компонент анимации шариков
  const ConfettiAnimation = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: -20,
            scale: 0
          }}
          animate={{
            y: window.innerHeight + 20,
            scale: [0, 1, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: 3,
            delay: Math.random() * 0.5,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  )

  // Компонент логов алгоритмов
  const AlgorithmLogs = ({ logs }: { logs: string[] }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 pt-4 border-t border-white/10"
    >
      <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20 w-full">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
          <h4 className="text-blue-400 text-sm font-medium">Внутрішні алгоритми</h4>
        </div>
        <div className="space-y-2 max-h-32 overflow-y-auto w-full">
          {logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="flex items-start space-x-2 w-full"
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 mt-1"></div>
              <span className="text-blue-300 text-xs break-words w-full">{log}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )

  // Компонент спиннера анализа
  const AnalysisSpinner = ({ status }: { status: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 pt-4 border-t border-white/10"
    >
      <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-6 h-6 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-6 h-6 border-2 border-transparent border-t-orange-400 rounded-full animate-spin" style={{ animationDelay: '-0.5s' }}></div>
          </div>
          <div className="flex-1">
            <motion.p
              key={status}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="text-orange-300 text-sm font-medium"
            >
              {status}
            </motion.p>
            <div className="mt-1 w-full bg-orange-500/20 rounded-full h-1">
              <motion.div
                className="bg-orange-500 h-1 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <AppLayout>
      <div className="flex flex-col h-full max-w-4xl mx-auto">
        {/* Header */}
        <header className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent-green rounded-lg flex items-center justify-center">
              <Bot className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-text-primary">AI Legal Assistant</h1>
              <p className="text-sm text-text-secondary">Ваш надійний юридичний помічник</p>
            </div>
          </div>
          <button className="p-2 hover:bg-surface-light/50 rounded-lg transition-colors">
            <Settings size={20} />
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                layout
                className={`flex items-start gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-accent-green flex-shrink-0 flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div className={`rounded-lg p-4 max-w-4xl w-full ${
                  message.sender === 'user' 
                  ? 'bg-primary-500/20' 
                  : 'bg-surface-light'
                }`}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="prose prose-sm prose-invert max-w-none text-text-primary whitespace-pre-wrap"
                  >
                    {message.content}
                  </ReactMarkdown>
                  
                  {/* Логи алгоритмов */}
                  {message.showAlgorithmLogs && message.algorithmLogs && message.algorithmLogs.length > 0 && (
                    <AlgorithmLogs logs={message.algorithmLogs} />
                  )}
                  
                  {/* Спиннер анализа */}
                  {message.isAnalyzing && message.analysisStatus && (
                    <AnalysisSpinner status={message.analysisStatus} />
                  )}
                  
                  {/* Результат анализа */}
                  {message.analysis && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                        <h4 className="font-semibold text-blue-400 mb-2">Результат аналізу:</h4>
                        <div className="text-sm text-blue-300 whitespace-pre-wrap">
                          {message.analysis}
                        </div>
                        {message.stats && (
                          <div className="mt-2 text-xs text-blue-400">
                            Проаналізовано: {message.stats.totalTexts} текстів, 
                            скорочено в {message.stats.reducedBy}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Подсказки после ответа AI */}
                  {message.sender === 'ai' && message.showSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => handleViewFullText(message.id)}
                          size="sm"
                          className="bg-surface-medium hover:bg-surface-light text-text-primary"
                        >
                          Посмотреть полный текст дела
                        </Button>
                        
                        <Button
                          onClick={() => handleAnalyze(message.id)}
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          Проанализировать
                        </Button>
                        
                        <Button
                          onClick={() => handleExpressGratitude(message.id)}
                          size="sm"
                          className="bg-pink-500 hover:bg-pink-600 text-white"
                        >
                          Выразить восхищение
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary-500 flex-shrink-0 flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <div className="flex justify-start items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-accent-green flex-shrink-0 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="rounded-lg p-4 bg-surface-light">
                <div className="flex items-center space-x-2">
                  <div className="spinner" />
                  <span className="text-text-secondary text-sm">Аналізую...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <footer className="p-4 border-t border-white/10">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder="Запитайте що небудь, наприклад: 'знайди практику по виселенню...'"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
              className="w-full p-3 pr-12 rounded-lg bg-surface-medium border border-surface-light focus:ring-2 focus:ring-primary-500 transition-all resize-none"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="absolute right-2.5 bottom-2.5 h-8 w-8"
              size="icon"
            >
              <Send size={16} />
            </Button>
          </div>
        </footer>
      </div>

      {/* Анимация шариков */}
      <AnimatePresence>
        {showConfetti && <ConfettiAnimation />}
      </AnimatePresence>
    </AppLayout>
  )
} 