import sharp from 'sharp'

export async function processEmojiImage(imageBuffer: Buffer): Promise<Buffer> {
  // Process the image with sharp
  // 1. Resize to 128x128
  // 2. Optimize for file size
  
  // Resize the image to 128x128
  const processedImage = await sharp(imageBuffer)
    .resize(128, 128, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background for padding
    })
    .png({
      quality: 100,
      compressionLevel: 9,
      palette: true, // Use palette to reduce file size
    })
    .toBuffer()

  // Check if the image is under 128KB
  if (processedImage.length > 128 * 1024) {
    // If too large, try additional compression
    return sharp(processedImage)
      .png({
        quality: 90,
        compressionLevel: 9,
        palette: true,
        colors: 128 // Reduce color palette
      })
      .toBuffer()
  }

  return processedImage
}

export async function fetchImageBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`)
  }
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}