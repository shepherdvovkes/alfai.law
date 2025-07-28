import OpenAI from 'openai'
import axios from 'axios'

const ZAKON_API_URL = 'https://court.searcher.api.zakononline.com.ua/v1/search'
const ZAKON_TOKEN = process.env.ZAKON_TOKEN

// Initialize OpenAI client conditionally
const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured')
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

// Интеллектуальное извлечение ключевых слов через OpenAI API
export async function extractIntelligentSearchQuery(userText: string): Promise<string> {
  console.log('[Intelligent Search] 🧠 Extracting search query from:', userText)
  
  try {
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Ти експерт з українського права. На основі опису ситуації адвоката сформуй точний пошуковий запит для бази судових рішень.

ПРИКЛАД:
Вхід: "Я адвокат власника житла. Ситуація: колишній мешканець не проживає давно, у приватизації участі не брав, але хоче повторно зареєструвати місце проживання"
Вихід: "про визнання особи такою, що втратила право користування житловим приміщенням" AND "приватизації" AND "зареєструвати місце проживання"

ПРАВИЛА:
1. Використовуй точні юридичні терміни з українського права
2. Комбінуй ключові фрази через AND для точності
3. Уникай загальних слів як "суд", "справа", "рішення"
4. Фокусуйся на специфічних правових категоріях та обставинах
5. Використовуй кавички для точних фраз
6. Максимум 3-4 ключових блоки через AND

Сформуй пошуковий запит:`
        },
        { role: 'user', content: userText }
      ],
      max_tokens: 150,
      temperature: 0.3,
    })
    
    const searchQuery = completion.choices[0]?.message?.content?.trim() || ''
    console.log('[Intelligent Search] 🎯 Generated search query:', searchQuery)
    
    return searchQuery
  } catch (error) {
    console.error('[Intelligent Search] ❌ OpenAI extraction error:', error)
    // Fallback to simple extraction
    return extractFallbackSearchTerms(userText)
  }
}

// Fallback extraction if OpenAI fails
function extractFallbackSearchTerms(userText: string): string {
  const legalPatterns = [
    { pattern: /(виселен|виселил|виселяв)/i, term: 'виселення' },
    { pattern: /(звільнен|звільнил|звільняв)/i, term: 'звільнення' },
    { pattern: /(приватизац)/i, term: 'приватизації' },
    { pattern: /(реєстр|прописк)/i, term: 'реєстрація' },
    { pattern: /(втрати.*право|втратила.*право)/i, term: 'втрата права' },
    { pattern: /(житло|приміщення)/i, term: 'житлове приміщення' }
  ]
  
  const foundTerms: string[] = []
  for (const { pattern, term } of legalPatterns) {
    if (pattern.test(userText)) {
      foundTerms.push(`"${term}"`)
    }
  }
  
  return foundTerms.length > 0 ? foundTerms.join(' AND ') : 'судова практика'
}

// Генерация краткого резюме на основе метаданных
async function generateMetadataSummary(metadata: any[], courtLevels: any): Promise<string> {
  try {
    // Подготавливаем данные для анализа
    const courtStats = Object.entries(courtLevels).map(([level, count]) => `${level}: ${Array.isArray(count) ? count.length : count} справ`).join(', ')
    
    // Выбираем топ-5 самых важных дел (по приоритету суда)
    const topCases = metadata.slice(0, 5).map(caseItem => ({
      title: caseItem.title,
      court: caseItem.courtLevel,
      date: caseItem.adjudication_date,
      resolution: caseItem.resolution
    }))
    
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Ти експерт з аналізу судової практики. На основі метаданих справ створи коротке резюме (2-3 речення) для адвоката.

ПРАВИЛА:
1. Вкажи загальну кількість знайдених справ
2. Згадай розподіл по судових інстанціях
3. Відміть основні тенденції в рішеннях
4. Будь лаконічним та практичним
5. НЕ використовуй емодзі
6. Фокусуйся на практичних висновках для адвоката

ФОРМАТ:
"Знайдено X справ по вашому запиту. Розподіл по інстанціях: [статистика]. Основні тенденції: [ключові моменти]. Рекомендується детальний аналіз для формування стратегії."`
        },
        {
          role: 'user',
          content: `Статистика: ${courtStats}\n\nТоп-5 справ:\n${topCases.map((c, i) => 
            `${i+1}. ${c.title} (${c.court}, ${c.date}) - ${c.resolution}`
          ).join('\n')}`
        }
      ],
      max_tokens: 200,
      temperature: 0.3,
    })
    
    return completion.choices[0]?.message?.content?.trim() || 'Аналіз метаданих завершено.'
  } catch (error) {
    console.error('[Intelligent Search] ❌ Error generating metadata summary:', error)
    return `Знайдено ${metadata.length} справ. Рекомендується детальний аналіз для отримання практичних висновків.`
  }
}

// Быстрый поиск только метаданных (Этап 1)
export async function performQuickMetadataSearch(searchQuery: string): Promise<{
  metadata: any[],
  totalFound: number,
  courtLevels: any,
  summary: string
}> {
  console.log('[Intelligent Search] 🔍 Starting quick metadata search with query:', searchQuery)
  
  // Получение метаданных по всем инстанциям
  const { allMetadata, resultsByLevel } = await getCaseMetadata(searchQuery)
  
  if (allMetadata.length === 0) {
    console.log('[Intelligent Search] ❌ No metadata found.')
    return { 
      metadata: [], 
      totalFound: 0, 
      courtLevels: {}, 
      summary: 'За вашим запитом не знайдено жодної справи в базі даних.'
    }
  }
  
  // Сортируем все найденные дела по приоритету суда
  allMetadata.sort((a, b) => a.courtPriority - b.courtPriority)
  const totalFound = allMetadata.length
  
  // Генерируем краткое резюме на основе метаданных
  const summary = await generateMetadataSummary(allMetadata, resultsByLevel)
  
  return {
    metadata: allMetadata,
    totalFound,
    courtLevels: resultsByLevel,
    summary
  }
}

// Двухэтапный поиск в Zakon Online: 1. Метаданные -> 2. Полные тексты
export async function performIntelligentZakonSearch(searchQuery: string): Promise<{
  metadata: any[],
  fullTexts: any[],
  totalFound: number,
  courtLevels: any
}> {
  console.log('[Intelligent Search] 🔍 Starting 2-phase search with query:', searchQuery)
  
  // Этап 1: Получение метаданных по всем инстанциям
  const { allMetadata, resultsByLevel } = await getCaseMetadata(searchQuery)
  
  if (allMetadata.length === 0) {
    console.log('[Intelligent Search] ❌ No metadata found. Aborting.')
    return { metadata: [], fullTexts: [], totalFound: 0, courtLevels: {} }
  }
  
  // Сортируем все найденные дела по приоритету суда
  allMetadata.sort((a, b) => a.courtPriority - b.courtPriority)
  const totalFound = allMetadata.length
  
  // Этап 2: Выбираем топ-15 дел для загрузки полных текстов
  const casesToFetch = allMetadata.slice(0, 15)
  console.log(`[Intelligent Search] 📄 Fetching full texts for ${casesToFetch.length} top cases...`)
  const fullTextResults = await getFullTextsByIds(casesToFetch)
  
  console.log(`[Intelligent Search] ✅ 2-phase search complete. Found ${totalFound} cases, fetched ${fullTextResults.length} full texts.`)
  
  return {
    metadata: allMetadata,
    fullTexts: fullTextResults,
    totalFound,
    courtLevels: resultsByLevel
  }
}

// Генерация fallback стратегий из основного запроса
function generateSearchStrategies(originalQuery: string): string[] {
  const strategies: string[] = []
  
  // Стратегия 1: Оригинальный запрос
  strategies.push(originalQuery)
  
  // Стратегия 2: Разбиваем на части и берем первые две через AND
  const parts = originalQuery.split(' AND ')
  if (parts.length >= 2) {
    strategies.push(`${parts[0]} AND ${parts[1]}`)
  }
  
  // Стратегия 3: Только самая длинная фраза в кавычках
  const quotedParts = parts.filter(part => part.includes('"'))
  if (quotedParts.length > 0) {
    const longestPart = quotedParts.reduce((a, b) => a.length > b.length ? a : b)
    strategies.push(longestPart)
  }
  
  // Стратегия 4: Извлекаем ключевые слова без кавычек и AND
  const keywords = originalQuery
    .replace(/"/g, '')
    .split(/\s+AND\s+/)
    .map(part => part.trim())
    .filter(Boolean)
  
  if (keywords.length > 0) {
    strategies.push(`"${keywords[0]}"`) // Первое ключевое слово
  }
  
  // Стратегия 5: Простые правовые термины как fallback
  const legalTerms = ['виселення', 'приватизація', 'реєстрація', 'житлове право']
  for (const term of legalTerms) {
    if (originalQuery.toLowerCase().includes(term.toLowerCase())) {
      strategies.push(term)
      break
    }
  }
  
  // Удаляем дубликаты и пустые строки
  return Array.from(new Set(strategies)).filter(Boolean)
}

// Этап 1: Получение метаданных по всем инстанциям
async function getCaseMetadata(searchQuery: string) {
  const searchStrategies = generateSearchStrategies(searchQuery)
  
  const courtLevels = [
    { instance: '4', name: 'Верховний суд / Касаційні суди', priority: 1, limit: 30 },
    { instance: '2', name: 'Апеляційні суди', priority: 2, limit: 25 },
    { instance: '1', name: 'Суди першої інстанції', priority: 3, limit: 25 }
  ]
  
  let allMetadata: any[] = []
  let resultsByLevel: any = {}

  for (const strategy of searchStrategies) {
    console.log(`[Intelligent Search] 🎯 Trying strategy: "${strategy}"`)
    
    for (const court of courtLevels) {
      const levelResults = await makeApiRequest({
        search: strategy,
        instance: court.instance,
        limit: String(court.limit),
        results: 'metadata' // Запрашиваем только метаданные
      })
      
      if (levelResults.length > 0) {
        const enrichedResults = levelResults.map((item: any) => ({
          ...item,
          courtLevel: court.name,
          courtPriority: court.priority
        }))
        
        if (!resultsByLevel[court.name]) {
          resultsByLevel[court.name] = []
        }
        resultsByLevel[court.name].push(...enrichedResults)
        allMetadata.push(...enrichedResults)
      }
    }
    
    // Если первая стратегия дала результаты, остальные не используем
    if (allMetadata.length > 0) {
      console.log(`[Intelligent Search] ✅ Strategy "${strategy}" successful. Found ${allMetadata.length} total metadata records.`)
      break
    }
  }
  
  // Удаляем дубликаты по doc_id
  const uniqueMetadata = Array.from(new Map(allMetadata.map(item => [item.doc_id, item])).values())
  
  return { allMetadata: uniqueMetadata, resultsByLevel }
}

// Этап 2: Загрузка полных текстов по ID с правильной логикой
export async function getFullTextsByIds(cases: any[]): Promise<any[]> {
  const fullTexts = []
  for (const caseMeta of cases) {
    let fullText = null
    
    // Попытка 1: Поиск по doc_id (основной метод)
    if (caseMeta.doc_id) {
      console.log(`[Intelligent Search]   - Завантаження повного тексту для doc_id: ${caseMeta.doc_id}`)
      const results = await makeApiRequest({
        search: `doc_id:${caseMeta.doc_id}`,
        limit: '1',
        results: 'standart'
      })
      
      if (results.length > 0 && results[0].text) {
        fullText = results[0].text
        console.log(`[Intelligent Search]   - ✅ Успішно завантажено повний текст для doc_id: ${caseMeta.doc_id}`)
      }
    }
    
    // Попытка 2: Fallback на cause_num, если doc_id не сработал
    if (!fullText && caseMeta.cause_num) {
      console.log(`[Intelligent Search]   - Fallback: пошук за номером справи: ${caseMeta.cause_num}`)
      const results = await makeApiRequest({
        search: `"${caseMeta.cause_num}"`,
        limit: '1',
        results: 'standart'
      })
      
      if (results.length > 0 && results[0].text) {
        fullText = results[0].text
        console.log(`[Intelligent Search]   - ✅ Успішно завантажено повний текст за номером справи: ${caseMeta.cause_num}`)
      }
    }
    
    // Попытка 3: Используем сниппет как fallback
    if (!fullText && caseMeta.snippet) {
      console.log(`[Intelligent Search]   - Fallback: використання сниппета для doc_id: ${caseMeta.doc_id}`)
      fullText = caseMeta.snippet
        .replace(/<[^>]*>/g, '') // Удаляем HTML теги
        .replace(/\s+/g, ' ') // Нормализуем пробелы
        .trim()
    }
    
    if (fullText) {
      fullTexts.push({
        ...caseMeta,
        fullText: fullText
      })
    } else {
      console.log(`[Intelligent Search]   - ❌ Не вдалося отримати повний текст для doc_id: ${caseMeta.doc_id}`)
    }
    
    // Небольшая задержка для API
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  
  console.log(`[Intelligent Search]   - Загалом завантажено ${fullTexts.length} повних текстів з ${cases.length} спроб`)
  return fullTexts
}

// Универсальная функция для запросов к API
async function makeApiRequest(params: Record<string, string>): Promise<any[]> {
  const payload = {
    mode: 'sph04',
    target: 'text',
    namespace: 'sudreyestr',
    page: '1',
    instance: params.instance || '3',
    judgement: '3',
    ...params
  }
  
  try {
    console.log(`[Intelligent Search]   - API запит: ${params.search}`)
    const response = await axios.get(ZAKON_API_URL, {
      headers: { 'X-App-Token': ZAKON_TOKEN },
      params: payload,
      timeout: 30000, // Увеличиваем таймаут для загрузки полных текстов
    })
    
    const data = Array.isArray(response.data) ? response.data : []
    console.log(`[Intelligent Search]   - API відповідь: ${data.length} результатів`)
    
    return data
  } catch (err: any) {
    console.error(`[Intelligent Search] ❌ Помилка API запиту для "${params.search}":`, err.message)
    return []
  }
}

// Форматирование результатов для AI анализа
export function formatZakonResultsForAI(results: {
  metadata: any[],
  fullTexts: any[],
  totalFound: number,
  courtLevels: any
}): string {
  if (results.totalFound === 0) {
    return '\n**ПОШУК У БАЗІ ЗАКОН ОНЛАЙН**: Нічого не знайдено за вашим запитом.'
  }
  
  const statsText = `**РЕЗУЛЬТАТИ ПОШУКУ В БАЗІ ЗАКОН ОНЛАЙН**: Знайдено ${results.totalFound} справ, для глибокого аналізу завантажено ${results.fullTexts.length} повних текстів.\n`
  
  const courtStats = Object.keys(results.courtLevels)
    .map(level => `• **${level}**: ${results.courtLevels[level].length} справ`)
    .join(' | ')
  
  const levelsSummary = courtStats ? `**Розподіл по інстанціях**: ${courtStats}\n` : ''

  const detailedAnalysis = results.fullTexts.length > 0 ? 
    '## ДЕТАЛЬНИЙ АНАЛІЗ НАЙВАЖЛИВІШИХ СПРАВ:\n' +
    results.fullTexts.map((item, index) => {
      const textPreview = item.fullText ? 
        item.fullText.substring(0, 800).replace(/\s+/g, ' ').trim() + '...' :
        'Текст недоступний'
      
      // Извлекаем ключевые правовые моменты
      const keyPoints = extractKeyLegalPoints(textPreview)
      
      // Определяем результат дела
      const caseResult = determineCaseResult(item.resolution, textPreview)
      
      return `### Справа ${index + 1}: ${item.title || 'Без назви'}\n` +
             `**Номер справи:** ${item.cause_num || 'Не вказано'}\n` +
             `**Суд:** ${item.courtLevel} • **Дата:** ${item.adjudication_date?.split('T')[0] || 'Не вказано'}\n` +
             `**Результат:** ${caseResult}\n` +
             `**Рішення:** ${item.resolution || 'Не вказано'}\n` +
             `**Ключові правові моменти:**\n${keyPoints}\n` +
             `**Повний текст:** ${textPreview}\n` +
             `**Посилання:** [Переглянути рішення](${item.url || '#'})\n`
    }).join('\n') : ''
  
  return statsText + levelsSummary + '\n' + detailedAnalysis
}

// Функция для извлечения ключевых правовых моментов
function extractKeyLegalPoints(text: string): string {
  const keyPhrases = [
    'визнання особи такою, що втратила право користування',
    'приватизація',
    'реєстрація місця проживання',
    'право користування житловим приміщенням',
    'відмова',
    'задоволення позову',
    'скасування',
    'визнання недійсним',
    'зняття з реєстрації',
    'виселення',
    'тривала відсутність',
    'фактичне проживання'
  ]
  
  const foundPoints = keyPhrases
    .filter(phrase => text.toLowerCase().includes(phrase.toLowerCase()))
    .map(phrase => `• ${phrase}`)
    .slice(0, 4) // Увеличиваем до 4 ключевых моментов
  
  return foundPoints.length > 0 ? foundPoints.join('\n') : '• Ключові моменти не виявлені'
}

// Функция для определения результата дела
function determineCaseResult(resolution: string, text: string): string {
  const lowerText = text.toLowerCase()
  const lowerResolution = resolution?.toLowerCase() || ''
  
  if (lowerText.includes('задоволення') || lowerText.includes('задоволено') || lowerText.includes('визнати')) {
    return '✅ Задоволено позов'
  } else if (lowerText.includes('відмова') || lowerText.includes('відмовлено') || lowerText.includes('відхилити')) {
    return '❌ Відмовлено в задоволенні позову'
  } else if (lowerText.includes('скасування') || lowerText.includes('скасовано')) {
    return '🔄 Скасовано попереднє рішення'
  } else if (lowerText.includes('частково')) {
    return '⚖️ Задоволено частково'
  } else {
    return '❓ Результат не визначено'
  }
} 