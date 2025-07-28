const WebSocket = require('ws')
const axios = require('axios')
require('dotenv').config({ path: '.env.local' })

const isDevelopment = process.env.NODE_ENV === 'development'
const hasValidApiKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 0

console.log(`[WebSocket Server] 🚀 Starting in ${isDevelopment ? 'development' : 'production'} mode`)
console.log(`[WebSocket Server] 🔑 OpenAI API Key configured: ${hasValidApiKey ? 'Yes' : 'No'}`)

const wss = new WebSocket.Server({ port: 3001 })

// Хранилище для дел в текущей сессии
const sessionCases = new Map()

wss.on('connection', (ws) => {
  console.log('[WebSocket Server] ✅ New client connected')
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message)
      console.log('[WebSocket Server] 📨 Received message type:', data.type, 'messageId:', data.messageId)
      
      if (data.type === 'message') {
        await handleChatMessage(ws, data)
      } else if (data.type === 'analyze') {
        console.log('[WebSocket Server] 🔍 Starting analysis for messageId:', data.messageId)
        await handleAnalyzeRequest(ws, data)
      } else if (data.type === 'getCases') {
        await handleGetCases(ws, data)
      } else {
        console.log('[WebSocket Server] ❓ Unknown message type:', data.type)
      }
      
    } catch (error) {
      console.error('[WebSocket Server] ❌ Error processing message:', error)
      ws.send(JSON.stringify({
        type: 'error',
        error: 'Помилка обробки повідомлення'
      }))
    }
  })
  
  ws.on('close', () => {
    console.log('[WebSocket Server] 👋 Client disconnected')
  })
})

async function handleChatMessage(ws, data) {
  const { message, messageId } = data

  try {
    // Отправляем логи алгоритмов сразу
    const algorithmLogs = [
      'Аналізую запит користувача...',
      'Витягую ключові слова через OpenAI API...',
      'Відправляю запит до Zakon Online API...',
      'Отримую метадані справ...',
      'Аналізую розподіл по судових інстанціях...',
      'Генерую резюме через ChatGPT...',
      'Формую фінальну відповідь...'
    ]

    // Отправляем логи с задержкой для эффекта
    for (let i = 0; i < algorithmLogs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600)) // 600ms между логами
      ws.send(JSON.stringify({
        type: 'algorithmLog',
        messageId: messageId,
        log: algorithmLogs[i]
      }))
    }

    // Небольшая пауза после логов
    await new Promise(resolve => setTimeout(resolve, 500))

    // Вызываем внутренний API route для интеллектуального поиска
    const response = await callIntelligentAPIRoute(message)

    if (response.success) {
      // Сохраняем метаданные в сессии
      if (response.zakonResults) {
        console.log(`[WebSocket Server] 💾 Response contains zakonResults for messageId: ${messageId}`)
        
        // Получаем метаданные из ответа API
        if (response.zakonResults && response.zakonResults.metadata) {
          console.log(`[WebSocket Server] 💾 Saving ${response.zakonResults.metadata.length} metadata records for messageId: ${messageId}`)
          sessionCases.set(messageId, response.zakonResults.metadata)
          console.log(`[WebSocket Server] 💾 Session now contains ${sessionCases.size} messageIds`)
        } else {
          console.log(`[WebSocket Server] ⚠️ No metadata found in response for messageId: ${messageId}`)
        }
      } else {
        console.log(`[WebSocket Server] ⚠️ No zakonResults in response for messageId: ${messageId}`)
      }

      // Симулируем стриминг ответа
      await simulateStreaming(ws, response.message, messageId)

      // Отправляем сигнал завершения
      ws.send(JSON.stringify({
        type: 'complete',
        messageId: messageId,
        zakonResults: response.zakonResults
      }))
    } else {
      ws.send(JSON.stringify({
        type: 'error',
        messageId: messageId,
        error: response.error || 'Помилка обробки запиту'
      }))
    }

  } catch (error) {
    console.error('[WebSocket Server] ❌ Error in chat message:', error)
    ws.send(JSON.stringify({
      type: 'error',
      messageId: messageId,
      error: 'Помилка з\'єднання з AI сервісом'
    }))
  }
}

async function handleAnalyzeRequest(ws, data) {
  const { messageId } = data
  
  try {
    console.log('[WebSocket Server] 🔍 Starting analysis for messageId:', messageId)
    
    // Получаем метаданные из сессии
    const metadata = sessionCases.get(messageId) || []
    console.log('[WebSocket Server] 📊 Found metadata in session:', metadata.length, 'cases')
    
    if (metadata.length === 0) {
      console.log('[WebSocket Server] ❌ No metadata found for messageId:', messageId)
      ws.send(JSON.stringify({
        type: 'analyzeError',
        messageId: messageId,
        error: 'Немає справ для аналізу'
      }))
      return
    }
    
    console.log(`[WebSocket Server] 🔍 Starting full analysis of ${metadata.length} cases`)
    
    // Выбираем топ-15 дел для загрузки полных текстов
    const casesToFetch = metadata.slice(0, 15).map(caseItem => ({
      doc_id: caseItem.doc_id || caseItem.id || caseItem.case_number
    }))
    
    console.log(`[WebSocket Server] 📄 Fetching full texts for cases:`, casesToFetch.map(c => c.doc_id))
    
    // Загружаем полные тексты
    const fullTextsResponse = await axios.post('http://localhost:3000/api/ai/get-full-texts', {
      cases: casesToFetch
    })
    
    if (!fullTextsResponse.data.success) {
      ws.send(JSON.stringify({
        type: 'analyzeError',
        messageId: messageId,
        error: 'Помилка завантаження повних текстів'
      }))
      return
    }
    
    const fullTexts = fullTextsResponse.data.fullTexts
    console.log(`[WebSocket Server] 📄 Loaded ${fullTexts.length} full texts`)
    
    // Проверяем, есть ли тексты для анализа
    if (fullTexts.length === 0) {
      console.log(`[WebSocket Server] ⚠️ No full texts available for analysis`)
      
      // Создаем анализ на основе метаданных
      const metadataAnalysis = await createMetadataAnalysis(metadata)
      
      ws.send(JSON.stringify({
        type: 'analyzeComplete',
        messageId: messageId,
        analysis: metadataAnalysis,
        stats: {
          totalCases: metadata.length,
          fullTextsLoaded: 0,
          analysisType: 'metadata-only'
        }
      }))
      return
    }
    
    // Извлекаем тексты для анализа
    const texts = fullTexts.map(caseItem => caseItem.fullText || caseItem.snippet || '').filter(text => text.length > 0)
    
    if (texts.length === 0) {
      console.log(`[WebSocket Server] ⚠️ No valid texts extracted for analysis`)
      
      // Создаем анализ на основе метаданных
      const metadataAnalysis = await createMetadataAnalysis(metadata)
      
      ws.send(JSON.stringify({
        type: 'analyzeComplete',
        messageId: messageId,
        analysis: metadataAnalysis,
        stats: {
          totalCases: metadata.length,
          fullTextsLoaded: 0,
          analysisType: 'metadata-only'
        }
      }))
      return
    }
    
    // Вызываем API анализа
    const response = await axios.post('http://localhost:3000/api/ai/analyze-texts', {
      texts: texts
    })
    
    if (response.data.success) {
      // Отправляем результат анализа
      ws.send(JSON.stringify({
        type: 'analyzeComplete',
        messageId: messageId,
        analysis: response.data.analysis,
        stats: response.data.stats
      }))
      console.log(`[WebSocket Server] ✅ Analysis completed successfully`)
    } else {
      ws.send(JSON.stringify({
        type: 'analyzeError',
        messageId: messageId,
        error: response.data.error || 'Помилка аналізу'
      }))
    }
    
  } catch (error) {
    console.error('[WebSocket Server] ❌ Error in analyze request:', error)
    ws.send(JSON.stringify({
      type: 'analyzeError',
      messageId: messageId,
      error: 'Помилка аналізу текстів'
    }))
  }
}

async function handleGetCases(ws, data) {
  const { messageId } = data
  
  try {
    const cases = sessionCases.get(messageId) || []
    
    ws.send(JSON.stringify({
      type: 'casesData',
      messageId: messageId,
      cases: cases
    }))
    
  } catch (error) {
    console.error('[WebSocket Server] ❌ Error getting cases:', error)
    ws.send(JSON.stringify({
      type: 'error',
      messageId: messageId,
      error: 'Помилка отримання справ'
    }))
  }
}

async function callIntelligentAPIRoute(userMessage) {
  try {
    const response = await axios.post('http://localhost:3000/api/ai/chat', {
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ],
      model: 'gpt-4o-mini'
    })
    
    return response.data
  } catch (error) {
    console.error('[WebSocket Server] ❌ Error calling API route:', error)
    throw error
  }
}

async function simulateStreaming(ws, fullResponse, messageId) {
  const words = fullResponse.split(' ')
  const chunkSize = 3 // Отправляем по 3 слова
  
  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join(' ')
    
    ws.send(JSON.stringify({
      type: 'message',
      messageId: messageId,
      content: chunk + ' '
    }))
    
    // Небольшая задержка для эффекта стриминга
    await new Promise(resolve => setTimeout(resolve, 50))
  }
}

// Создаем анализ на основе метаданных
async function createMetadataAnalysis(metadata) {
  try {
    console.log(`[WebSocket Server] 📊 Creating metadata analysis for ${metadata.length} cases`)
    
    // Группируем дела по судебным инстанциям
    const courtLevels = {}
    metadata.forEach(caseItem => {
      const level = caseItem.courtLevel || 'Неизвестная инстанция'
      if (!courtLevels[level]) {
        courtLevels[level] = []
      }
      courtLevels[level].push(caseItem)
    })
    
    // Создаем анализ на основе метаданных
    let analysis = `## АНАЛІЗ НА ОСНОВІ МЕТАДАНИХ\n\n`
    analysis += `**Загальна кількість справ:** ${metadata.length}\n\n`
    
    // Статистика по инстанциям
    analysis += `**Розподіл за судовими інстанціями:**\n`
    Object.entries(courtLevels).forEach(([level, cases]) => {
      analysis += `- ${level}: ${cases.length} справ\n`
    })
    
    analysis += `\n**Детальний список справ:**\n`
    metadata.slice(0, 20).forEach((caseItem, index) => {
      analysis += `${index + 1}. **Справа ${caseItem.doc_id || caseItem.cause_num || 'N/A'}**\n`
      analysis += `   - Інстанція: ${caseItem.courtLevel || 'Неизвестная'}\n`
      if (caseItem.snippet) {
        const snippet = caseItem.snippet.replace(/<[^>]*>/g, '').substring(0, 200)
        analysis += `   - Опис: ${snippet}...\n`
      }
      analysis += `\n`
    })
    
    if (metadata.length > 20) {
      analysis += `... та ще ${metadata.length - 20} справ\n\n`
    }
    
    analysis += `**Примітка:** Повні тексти справ недоступні через обмеження API. Аналіз проведено на основі метаданих.\n\n`
    analysis += `**Рекомендації:**\n`
    analysis += `- Для детального аналізу необхідно налаштувати доступ до повних текстів справ\n`
    analysis += `- Використовуйте надані метадані для попереднього оцінювання справ\n`
    analysis += `- Зверніться до адміністратора для налаштування API ключів\n`
    
    return analysis
  } catch (error) {
    console.error('[WebSocket Server] ❌ Error creating metadata analysis:', error)
    return 'Помилка створення аналізу на основі метаданих'
  }
}

console.log('[WebSocket Server] 🎯 Server running on ws://localhost:3001') 