import { NextRequest, NextResponse } from 'next/server'
import openai from '@/lib/openai'
import { processEmojiImage, fetchImageBuffer } from '@/lib/process'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { word, referenceImages } = await request.json()

    if (!word || typeof word !== 'string') {
      return NextResponse.json(
        { error: 'Word is required' },
        { status: 400 }
      )
    }

    // Validate reference images if provided
    if (referenceImages && !Array.isArray(referenceImages)) {
      return NextResponse.json(
        { error: 'Reference images must be an array' },
        { status: 400 }
      )
    }

    // Build the prompt for OpenAI
    const basePrompt = referenceImages && referenceImages.length > 0
      ? `Create a flat emoji-style illustration based on the provided reference images. The subject should be: **${word}**.
    
    Incorporate elements from the reference images into a single, cohesive emoji design.`
      : `Flat emoji-style illustration of: **${word}**.`;

    const prompt = `
    ${basePrompt}
    
    Canvas:
    • Square, 1024 × 1024 px, RGBA, background white.
    
    Object:
    • Centered and fills 80–90 % of the image (minimal even margin).
    • No border or outline stroke.
    • No background color or card.
    • No text, no other elements.
    • No drop shadow.
    • No glow.
    • No gradient.
    • No checkerboard.
    `;

    // Generate image using OpenAI with the new combined format
    const userContent: any[] = [
      { type: 'input_text', text: prompt }
    ]

    // Add reference images if provided
    if (referenceImages && referenceImages.length > 0) {
      referenceImages.forEach((image: string) => {
        userContent.push({
          type: 'input_image',
          image_url: image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`
        })
      })
    }

    const response = await openai.responses.create({
      model: 'gpt-4o',
      input: [
        {
          role: 'user',
          content: userContent
        }
      ],
      tools: [{ type: 'image_generation', background: "transparent" }]
    })

    const imageData = response.output
      .filter((output: any) => output.type === 'image_generation_call')
      .map((output: any) => output.result)

    if (imageData.length === 0) {
      throw new Error('No image generated')
      console.log(response.output)
    }

    const imageBase64 = imageData[0]

    if (!imageBase64) {
      throw new Error('No base64 image data returned')
    }

    // Convert base64 to buffer
    const rawImageBuffer = Buffer.from(imageBase64, 'base64')

    // Process the image: remove white background, resize, optimize
    const processedImageBuffer = await processEmojiImage(rawImageBuffer)

    // Convert to base64 for frontend display
    const base64Png = processedImageBuffer.toString('base64')

    // Suggest a name for the emoji (lowercase, replace spaces with dashes)
    const suggestedName = word.toLowerCase().replace(/\s+/g, '-')

    return NextResponse.json({
      base64Png,
      suggestedName: `:${suggestedName}:`
    })

  } catch (error) {
    console.error('Error generating emoji:', error)
    return NextResponse.json(
      { error: 'Failed to generate emoji' },
      { status: 500 }
    )
  }
}