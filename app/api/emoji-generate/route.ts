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

    // Generate image using OpenAI
    let imageBase64: string | undefined

    if (referenceImages && referenceImages.length > 0) {
      // First, analyze the reference images to extract key elements
      const visionResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze these reference images and describe the key visual elements that should be incorporated into a simple emoji design for "${word}". Focus on colors, shapes, and distinctive features. Keep the description concise and suitable for an emoji prompt.`
              },
              ...referenceImages.map((image: string) => ({
                type: 'image_url' as const,
                image_url: {
                  url: image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`
                }
              }))
            ]
          }
        ],
        max_tokens: 200
      })

      const imageAnalysis = visionResponse.choices[0]?.message?.content || ''
      
      // Generate the emoji with enhanced prompt based on image analysis
      const enhancedPrompt = `${prompt}\n\nIncorporate these visual elements from reference images: ${imageAnalysis}\n\nMaintain simplicity suitable for a 128x128 emoji while capturing the essence of the reference images.`
      
      const imageResponse = await openai.images.generate({
        model: 'gpt-image-1',
        prompt: enhancedPrompt,
      })

      if (!imageResponse.data || imageResponse.data.length === 0) {
        throw new Error('No image generated')
      }

      imageBase64 = imageResponse.data[0].b64_json
    } else {
      // Use the standard image generation for text-only requests
      const response = await openai.images.generate({
        model: 'gpt-image-1',
        prompt,
      })

      if (!response.data || response.data.length === 0) {
        throw new Error('No image generated')
      }

      imageBase64 = response.data[0].b64_json
    }

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