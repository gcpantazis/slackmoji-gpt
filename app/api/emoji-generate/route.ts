import { NextRequest, NextResponse } from 'next/server'
import openai from '@/lib/openai'
import { processEmojiImage, fetchImageBuffer } from '@/lib/process'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { word } = await request.json()

    if (!word || typeof word !== 'string') {
      return NextResponse.json(
        { error: 'Word is required' },
        { status: 400 }
      )
    }

    // Build the prompt for OpenAI
    const prompt = `Flat, minimal emoji icon for "${word}", centered, no text, white background, square, high contrast`

    // Generate image using OpenAI's new gpt-image-1 model
    const response = await openai.images.generate({
      model: 'dall-e-3', // Using DALL-E 3 as gpt-image-1 is not yet available
      prompt,
      size: '1024x1024', // DALL-E 3 only supports 1024x1024 or larger
      n: 1,
      quality: 'standard',
      style: 'vivid'
    })

    if (!response.data || response.data.length === 0) {
      throw new Error('No image generated')
    }

    const imageUrl = response.data[0].url
    if (!imageUrl) {
      throw new Error('No image URL returned')
    }

    // Fetch the image from OpenAI
    const rawImageBuffer = await fetchImageBuffer(imageUrl)

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