import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { 
  extractIntelligentSearchQuery, 
  performQuickMetadataSearch,
  performIntelligentZakonSearch, 
  formatZakonResultsForAI 
} from '@/lib/intelligent-search'

// Initialize OpenAI client conditionally
const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured')
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, model = 'gpt-4o-mini', caseCreation = false } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const userMessage = messages[messages.length - 1].content;
    let intelligentSearchQuery = '';
    let zakonResults: any = null;
    let zakonText = '';

    // Проверяем, нужен ли поиск судебной практики
    const searchKeywords = [
      'практика', 'справи', 'рішення', 'судові', 'закон онлайн', 
      'виселення', 'договір', 'трудові спори', 'приватизац', 'реєстрац',
      'звільнили', 'звільнення', 'працівник', 'відпустка', 'незаконно',
      'відновлення', 'аліменти', 'моральна шкода', 'компенсація',
      'спадщина', 'майно', 'позов', 'суд', 'адвокат', 'представляю'
    ];
    const shouldSearchZakon = searchKeywords.some(keyword => userMessage.toLowerCase().includes(keyword));

    if (shouldSearchZakon) {
      console.log('[AI Assistant] 🧠 Activating intelligent search module for:', userMessage);
      
      // Этап 1: Интеллектуальное извлечение поискового запроса через OpenAI
      intelligentSearchQuery = await extractIntelligentSearchQuery(userMessage);
      
      if (intelligentSearchQuery && intelligentSearchQuery !== 'судова практика') {
        console.log('[AI Assistant] 🎯 Using intelligent search query:', intelligentSearchQuery);
        
        // Этап 1: Быстрый поиск только метаданных
        const quickResults = await performQuickMetadataSearch(intelligentSearchQuery);
        
        // Формируем краткий ответ на основе метаданных
        const courtStats = Object.entries(quickResults.courtLevels)
          .map(([level, count]) => `${level}: ${Array.isArray(count) ? count.length : count} справ`)
          .join(', ');
          
        zakonText = `РЕЗУЛЬТАТИ ПОШУКУ В БАЗІ ЗАКОН ОНЛАЙН:
Знайдено: ${quickResults.totalFound} справ
Розподіл по інстанціях: ${courtStats}

КРАТКЕ РЕЗЮМЕ:
${quickResults.summary}

ДЕТАЛЬНИЙ АНАЛІЗ:
Для отримання детального аналізу з практичними рекомендаціями натисніть кнопку "Проанализировать" після цієї відповіді.`;
        
        // Сохраняем метаданные для последующего анализа
        zakonResults = {
          metadata: quickResults.metadata,
          fullTexts: [],
          totalFound: quickResults.totalFound,
          courtLevels: quickResults.courtLevels
        };
        
        console.log('[AI Assistant] ✅ Quick metadata search completed:', {
          query: intelligentSearchQuery,
          totalFound: quickResults.totalFound,
          summary: quickResults.summary.substring(0, 100) + '...'
        });
      } else {
        console.log('[AI Assistant] ⚠️ Fallback to basic search or no search needed');
        zakonText = '\n\nНе вдалося сформувати специфічний пошуковий запит для бази судових рішень.';
      }
    }

    // Формируем system prompt с результатами поиска
    let systemPrompt =
      'Ти — професійний юридичний AI-асистент. Твоя задача — надати практичний аналіз судової практики з конкретними рекомендаціями для адвокатів.\n\n' +
      'ПРАВИЛА ВІДПОВІДІ:\n' +
      '1. **ПОЧНИ СВОЮ ВІДПОВІДЬ ТОЧНО З БЛОКУ РЕЗУЛЬТАТІВ ПОШУКУ**, який надано нижче. Не змінюй його.\n' +
      '2. **ДЕТАЛЬНИЙ АНАЛІЗ КОЖНОЇ СПРАВИ**: Для кожної справи надай:\n' +
      '   - Номер справи та дату рішення\n' +
      '   - Конкретний результат (задоволено/відмовлено/скасовано)\n' +
      '   - Ключові правові позиції суду\n' +
      '   - Фактори, які вплинули на рішення\n' +
      '   - Аргументи, які спрацювали/не спрацювали\n' +
      '   - Практичний висновок для адвоката\n' +
      '3. **СТРАТЕГІЧНІ РЕКОМЕНДАЦІЇ**: Надай:\n' +
      '   - Конкретні дії для адвоката (покроково)\n' +
      '   - Які документи збирати (список)\n' +
      '   - Які аргументи використовувати (з прикладами)\n' +
      '   - Які ризики враховувати та як їх мінімізувати\n' +
      '4. **ПОДІЛ НА КАТЕГОРІЇ**: Розділи справи на:\n' +
      '   - Позитивні прецеденти (на користь вашого клієнта)\n' +
      '   - Негативні прецеденти (проти вашого клієнта)\n' +
      '   - Нейтральні/інформативні\n' +
      '5. **КОНКРЕТНІ ВИСНОВКИ**: Замість загальних фраз дай практичні поради з прикладами.\n' +
      '6. **СТРУКТУРА ВІДПОВІДІ**: Використовуй чітку структуру з заголовками та підзаголовками.\n' +
      '7. Не додавай зайвих порожніх рядків. Будь лаконічним.\n' +
      '8. Не використовуй емодзі.\n\n' +
      '--- НАДАНИЙ БЛОК РЕЗУЛЬТАТІВ ПОШУКУ ---\n' +
      zakonText +
      '\n--- КІНЕЦЬ БЛОКУ РЕЗУЛЬТАТІВ ПОШУКУ ---\n\n' +
      (caseCreation ? 'Якщо запит неясний, задай уточнюючі питання.' : '');

    console.log('[AI Assistant] 📝 System prompt prepared with Zakon results');

    const systemMessage = { role: 'system' as const, content: systemPrompt };
    const conversationMessages = [systemMessage, ...messages];

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model,
      messages: conversationMessages,
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4000'),
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
    });

    const response = completion.choices[0]?.message?.content;

    console.log('[AI Assistant] 🤖 OpenAI response generated');

    if (!response) {
      return NextResponse.json({ error: 'No response from OpenAI' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: response,
      usage: completion.usage,
      intelligentSearchQuery,
      zakonResults: zakonResults ? {
        totalFound: zakonResults.totalFound,
        metadata: zakonResults.metadata, // Возвращаем полные метаданные
        metadataCount: zakonResults.metadata.length,
        fullTextsAnalyzed: zakonResults.fullTexts.length,
        courtLevels: zakonResults.courtLevels
      } : null,
    });

  } catch (error: any) {
    console.error('OpenAI API error:', error);
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message}` },
        { status: error.status || 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 