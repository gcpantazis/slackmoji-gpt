/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oaigptimageapiprodscus.blob.core.windows.net',
      },
      {
        protocol: 'https',
        hostname: 'gptimageprodsec.blob.core.windows.net',
      },
    ],
  },
}

module.exports = nextConfig