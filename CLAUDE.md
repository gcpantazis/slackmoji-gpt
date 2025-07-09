# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Slackmoji Maker is a Next.js application that generates custom Slack emojis using OpenAI's GPT-IMAGE-1 API. Users input a word or phrase, and the app generates a 128×128px transparent PNG emoji suitable for Slack upload.

Key features:
- AI-powered emoji generation using OpenAI's GPT-IMAGE-1
- Automatic white background removal for transparency
- Image optimization to meet Slack's requirements (≤128KB, 128×128px)
- One-click download of generated emojis
- Direct link to Slack's emoji upload page

## Development Commands

Once the Next.js project is initialized, typical commands will be:
```bash
yarn run dev      # Start development server
yarn run build    # Build for production
yarn run start    # Start production server
yarn run lint     # Run ESLint
yarn run test     # Run tests (when implemented)
```

Note that we use `yarn` for npm package management.

## Developer Notes

### Commenting
It's very important that we add comments explaining the purpose of each function. If we're doing several things in a method, particularly when dealing with third-party APIs, be careful to document the sequence of events and why things are happening the way that they are.

### Git Management
- The user will handle all git operations (commits, diffs, etc.)
- Do not attempt to run git commands

### Testing
- Use `yarn dev` to run the development server for testing
- The application runs on http://localhost:3000 when in development mode
- **Testing Workflow**: Claude will implement features and provide testing instructions. The user will run `yarn dev` and verify the implementation works as expected.

## Code Quality Standards

### Type Safety
- **No `as` casting**: We prefer to never use TypeScript `as` castings as it's an antipattern that bypasses type safety
- All types should be properly inferred or explicitly declared

## Environment Setup

1. **Copy the environment template:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Add your OpenAI API key:**
   - Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Add it to `.env.local`:
     ```
     OPENAI_API_KEY=your_actual_api_key_here
     ```

3. **Install dependencies:**
   ```bash
   yarn install
   ```

4. **Run the development server:**
   ```bash
   yarn dev
   ```

The application will be available at http://localhost:3000

<CLAUDE_CONTEXT_PATROL_DO_NOT_EDIT>
[git_hash:38c625407bbbb88655d3bad3b86fd4d3e22a6cbb]
Based on the files provided, here's a comprehensive context for the `app` and `lib` folders:

## app Folder

### (app/api/emoji-generate/route.ts):
- Server-side API route for emoji generation
- Handles POST requests to create custom emojis
- Uses OpenAI's GPT-IMAGE-1 model to generate images
- Detailed image generation process with specific requirements:
  - Creates a 1024x1024px square image
  - Generates a centered, minimal emoji representation
  - Ensures no text, background, or additional elements
- Processes the generated image to:
  - Convert base64 image to buffer
  - Remove white background
  - Resize to 128x128 pixels
- Returns base64 PNG and a suggested emoji name

### (app/globals.css):
- Global CSS file for the application
- Imports Tailwind CSS base, components, and utility classes
- Sets up foundational styling for the entire application

### (app/layout.tsx):
- Root layout component for the Next.js application
- Sets global metadata:
  - Title: "Slackmoji Maker"
  - Description: "Generate custom Slack emojis with AI"
- Uses Inter font from Google Fonts
- Provides basic HTML structure with language and body configuration

### (app/page.tsx):
- Main client-side page component for Slackmoji Maker
- Features a comprehensive UI for emoji generation:
  - Input field for word/phrase
  - Generate button with loading state
  - Error handling
  - Emoji preview section
  - Download and Slack upload options
- State management for:
  - User input
  - Loading state
  - Error messages
  - Generated emoji results
- Responsive design using Tailwind CSS
- Includes pixel-perfect image rendering
- Provides download functionality for generated emojis
- Direct link to Slack emoji upload page

## lib Folder

### (lib/openai.ts):
- Initializes OpenAI client
- Configures OpenAI instance using API key from environment variables
- Provides a centralized OpenAI client for API interactions

### (lib/process.ts):
- Contains advanced image processing utilities
- `processEmojiImage` function with multiple steps:
  - Resize image to 128x128 pixels
  - Remove white/near-white background
  - Convert to transparent PNG
  - Optimize file size for Slack upload
- Implements sophisticated pixel manipulation to ensure transparency
- Includes compression and size optimization
- `fetchImageBuffer` utility to retrieve images from URLs

This documentation provides a comprehensive overview of the Slackmoji Maker application's structure, focusing on the functionality and purpose of each file in the `app` and `lib` directories.
</CLAUDE_CONTEXT_PATROL_DO_NOT_EDIT>