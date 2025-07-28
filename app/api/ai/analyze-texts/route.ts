import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

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
    const { texts } = await request.json()

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json(
        { error: 'Необхідно надати масив текстів для аналізу' },
        { status: 400 }
      )
    }

    // Объединяем все тексты
    const combinedText = texts.map((text, index) => 
      `=== ТЕКСТ ${index + 1} ===\n${text}\n`
    ).join('\n')

    const systemPrompt = `Ти — експерт з аналізу юридичних документів. Твоя задача — проаналізувати надані судові рішення та створити стислий звіт для адвоката.

ПРАВИЛА АНАЛІЗУ:
1. **Скоротити тексти в 10 раз** - залишити тільки найважливішу інформацію
2. **Виділити ключові правові позиції** - основні аргументи суду
3. **Визначити результат справи** - задоволено/відмовлено/скасовано
4. **Виділити практичні висновки** - що це означає для адвоката
5. **Створити структурований звіт** з чіткими розділами

СТРУКТУРА ЗВІТУ:
## ЗАГАЛЬНА СТАТИСТИКА
- Кількість проаналізованих справ: X
- Розподіл за результатами: задоволено X%, відмовлено X%, скасовано X%

## КЛЮЧОВІ ПРАВОВІ ПОЗИЦІЇ
1. [Позиція 1] - зустрічається в X справах
2. [Позиція 2] - зустрічається в X справах
3. [Позиція 3] - зустрічається в X справах

## ПРАКТИЧНІ ВИСНОВКИ
- **Для позивача:** [конкретні рекомендації]
- **Для відповідача:** [конкретні рекомендації]
- **Ключові документи:** [які документи важливі]
- **Ризики:** [на що звернути увагу]

## ДЕТАЛЬНИЙ АНАЛІЗ КОЖНОЇ СПРАВИ
### Справа 1: [номер]
- **Результат:** [задоволено/відмовлено]
- **Ключові моменти:** [стислий опис]
- **Практичний висновок:** [що це означає]

Будь лаконічним та практичним. Не використовуй емодзі.`

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Проаналізуй наступні судові рішення:\n\n${combinedText}` }
      ],
      max_tokens: 4000,
      temperature: 0.3,
    })

    const analysis = completion.choices[0]?.message?.content || 'Не вдалося проаналізувати тексти'

    return NextResponse.json({
      success: true,
      analysis,
      stats: {
        totalTexts: texts.length,
        totalCharacters: combinedText.length,
        reducedBy: '10x',
        tokensUsed: completion.usage?.total_tokens || 0
      }
    })

  } catch (error) {
    console.error('Помилка аналізу текстів:', error)
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    )
  }
} 