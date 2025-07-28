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
    const { 
      documentType, 
      caseDetails, 
      clientInfo, 
      requirements,
      model = 'gpt-4o-mini' 
    } = await request.json()

    // Validate input
    if (!documentType || !caseDetails) {
      return NextResponse.json(
        { error: 'Document type and case details are required' },
        { status: 400 }
      )
    }

    // Get OpenAI client
    const openai = getOpenAI()

    // Create prompt for document generation
    const prompt = `
Generate a professional legal ${documentType} document based on the following information:

Case Details:
${caseDetails}

${clientInfo ? `Client Information:
${clientInfo}` : ''}

${requirements ? `Specific Requirements:
${requirements}` : ''}

Please generate a complete, professional legal document that follows standard legal formatting and includes all necessary sections. The document should be ready for use in legal proceedings.
`

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: process.env.DOCUMENT_GENERATION_PROMPT || 
            'You are a professional legal document generator. Generate accurate, well-structured legal documents based on the provided information. Follow standard legal formatting and include all necessary sections.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4000'),
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
    })

    const generatedDocument = completion.choices[0]?.message?.content

    if (!generatedDocument) {
      return NextResponse.json(
        { error: 'No document generated' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      document: generatedDocument,
      documentType,
      usage: completion.usage,
    })

  } catch (error) {
    console.error('Document generation error:', error)
    
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message}` },
        { status: error.status || 500 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 