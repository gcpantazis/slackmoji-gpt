import sharp from 'sharp'

export async function processEmojiImage(imageBuffer: Buffer): Promise<Buffer> {
  // Process the image with sharp
  // 1. Remove white background by making white pixels transparent
  // 2. Resize to 128x128
  // 3. Optimize for file size
  
  // First, resize the image while keeping the white background
  const resized = await sharp(imageBuffer)
    .resize(128, 128, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .toBuffer()

  // Then remove white background
  const withTransparency = await sharp(resized)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { data, info } = withTransparency
  const pixels = new Uint8ClampedArray(data)
  
  // Make white/near-white pixels transparent
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i]
    const g = pixels[i + 1]
    const b = pixels[i + 2]
    
    // If pixel is near-white (threshold: 245)
    if (r > 245 && g > 245 && b > 245) {
      pixels[i + 3] = 0 // Set alpha to 0 (transparent)
    }
  }

  // Create final processed image from modified pixels
  const processedImage = await sharp(Buffer.from(pixels), {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
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