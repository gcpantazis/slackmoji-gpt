'use client'

import { useState } from 'react'

interface EmojiResult {
  base64Png: string
  suggestedName: string
}

export default function Home() {
  const [word, setWord] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<EmojiResult | null>(null)

  const handleGenerate = async () => {
    if (!word.trim()) {
      setError('Please enter a word or phrase')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/emoji-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word: word.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate emoji')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError('Failed to generate emoji. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!result) return

    // Convert base64 to blob
    const byteCharacters = atob(result.base64Png)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'image/png' })

    // Create download link
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${result.suggestedName.replace(/:/g, '')}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-center mb-2">Slackmoji Maker</h1>
          <p className="text-gray-600 text-center mb-8">
            Generate custom Slack emojis with AI
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="word" className="block text-sm font-medium text-gray-700 mb-2">
                Enter a word or phrase
              </label>
              <input
                id="word"
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g., rocket, celebration, coffee"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !word.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Generating...' : 'Generate Emoji'}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-pulse space-y-4">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
                </div>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4 py-4">
                <div className="text-center">
                  <div className="inline-block p-4 bg-gray-100 rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`data:image/png;base64,${result.base64Png}`}
                      alt="Generated emoji"
                      className="w-32 h-32 pixelated"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Suggested name: <code className="bg-gray-100 px-2 py-1 rounded">{result.suggestedName}</code>
                  </p>
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleDownload}
                    className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Download PNG
                  </button>
                  <a
                    href="https://slack.com/customize/emoji"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-purple-600 text-white py-2 px-6 rounded-md hover:bg-purple-700 transition-colors inline-block"
                  >
                    Open Slack Upload
                  </a>
                </div>

                <div className="text-center text-sm text-gray-500">
                  <p>128×128px • Transparent background • Ready for Slack</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Emojis are generated at 128×128px with transparent backgrounds.</p>
          <p>Maximum file size: 128KB (Slack requirement)</p>
        </div>
      </div>

      <style jsx>{`
        .pixelated {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
      `}</style>
    </main>
  )
}