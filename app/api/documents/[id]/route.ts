import { NextRequest, NextResponse } from 'next/server'
import { getFullTextsByIds } from '@/lib/intelligent-search'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Необхідно надати ID документа' },
        { status: 400 }
      )
    }

    console.log(`[Document API] 📄 Loading document with ID: ${id}`)

    // Создаем объект с doc_id для поиска
    const caseToFetch = [{ doc_id: id }]
    
    // Загружаем полный текст из Закон.Онлайн
    const fullTexts = await getFullTextsByIds(caseToFetch)

    if (fullTexts.length === 0) {
      return NextResponse.json(
        { error: 'Документ не знайдено в базі Закон.Онлайн' },
        { status: 404 }
      )
    }

    const document = fullTexts[0]
    
    console.log(`[Document API] ✅ Successfully loaded document: ${document.doc_id}`)

    return NextResponse.json({
      success: true,
      document: {
        id: document.doc_id,
        name: document.name || `Документ ${document.doc_id}`,
        type: document.type || 'Документ',
        category: document.courtLevel || 'Судова справа',
        client: document.parties || 'Не вказано',
        status: 'active',
        size: `${Math.round((document.fullText?.length || 0) / 1024)} KB`,
        createdAt: new Date(document.date || Date.now()),
        lastModified: new Date(document.date || Date.now()),
        tags: document.tags || [],
        isFavorite: false,
        description: document.snippet || 'Документ з бази Закон.Онлайн',
        source: 'downloaded',
        content: document.fullText || 'Текст документа недоступний',
        url: `/documents/${document.doc_id}`,
        metadata: {
          doc_id: document.doc_id,
          cause_num: document.cause_num,
          court: document.court,
          date: document.date,
          parties: document.parties,
          resolution: document.resolution
        }
      }
    })

  } catch (error) {
    console.error('[Document API] ❌ Error loading document:', error)
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера при завантаженні документа' },
      { status: 500 }
    )
  }
} 