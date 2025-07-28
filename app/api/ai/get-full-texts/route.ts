import { NextRequest, NextResponse } from 'next/server'
import { getFullTextsByIds } from '@/lib/intelligent-search'

export async function POST(request: NextRequest) {
  try {
    const { cases } = await request.json()

    if (!cases || !Array.isArray(cases) || cases.length === 0) {
      return NextResponse.json(
        { error: 'Необхідно надати масив справ для завантаження повних текстів' },
        { status: 400 }
      )
    }

    console.log(`[Get Full Texts] 📄 Loading full texts for ${cases.length} cases`)

    // Загружаем полные тексты
    const fullTexts = await getFullTextsByIds(cases)

    console.log(`[Get Full Texts] ✅ Successfully loaded ${fullTexts.length} full texts`)

    return NextResponse.json({
      success: true,
      fullTexts,
      stats: {
        requested: cases.length,
        loaded: fullTexts.length,
        successRate: Math.round((fullTexts.length / cases.length) * 100)
      }
    })

  } catch (error) {
    console.error('[Get Full Texts] ❌ Error loading full texts:', error)
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера при завантаженні повних текстів' },
      { status: 500 }
    )
  }
} 