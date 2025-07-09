import sharp from 'sharp'

export async function processEmojiImage(imageBuffer: Buffer): Promise<Buffer> {
  // Process the image with sharp
  // 1. Trim transparent margins
  // 2. Crop to square (centered) without altering aspect ratio
  // 3. Resize to 128x128
  // 4. Optimize for file size
  
  // First, trim transparent pixels
  const trimmedBuffer = await sharp(imageBuffer)
    .trim()
    .toBuffer()
  
  // Get metadata of the trimmed image
  const trimmedMetadata = await sharp(trimmedBuffer).metadata()
  const width = trimmedMetadata.width || 1024
  const height = trimmedMetadata.height || 1024
  
  // Calculate square dimensions that include all content
  // Use the larger dimension to ensure nothing gets clipped
  const squareSize = Math.max(width, height)
  
  // Instead of cropping, we'll resize with contain to preserve all content
  const processedImage = await sharp(trimmedBuffer)
    .resize(128, 128, {
      fit: 'contain', // Preserve aspect ratio and fit within bounds
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