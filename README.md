# Slackmoji Maker

Generate custom Slack emojis with AI! This Next.js application uses OpenAI's GPT-IMAGE-1 to create 128×128px transparent PNG emojis that meet Slack's requirements.

## Features

- 🎨 AI-powered emoji generation using OpenAI's GPT-IMAGE-1
- 🪄 Automatic white background removal for transparency
- 📏 Optimized for Slack (128×128px, ≤128KB)
- 💾 One-click download
- 🔗 Direct link to Slack's emoji upload page

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/slackmoji-maker.git
   cd slackmoji-maker
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   Then add your OpenAI API key to `.env.local`

4. **Run the development server:**
   ```bash
   yarn dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## How It Works

1. Enter a word or phrase (e.g., "rocket", "celebration", "coffee")
2. AI generates a flat, minimal emoji icon
3. The app removes the white background and optimizes the image
4. Download the emoji and upload to Slack!

## Technical Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** OpenAI GPT-IMAGE-1 API
- **Image Processing:** Sharp

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add `OPENAI_API_KEY` environment variable
4. Deploy!

### Self-hosted

See deployment notes in CLAUDE.md for Docker and other hosting options.

## License

MIT