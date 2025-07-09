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
[git_hash:fdaccb6987fcca28006aa75b68506de9f008cb10]
I'll provide context for the folders `app` and `lib` based on the files found:

## app Folder

### (app/api/emoji-generate/route.ts):
- Handles server-side emoji generation API endpoint
- Uses OpenAI's GPT-IMAGE-1 model to create emoji images
- Processes input word into a minimal, centered emoji icon
- Generates image, removes white background, and returns base64 PNG
- Includes error handling for invalid inputs or generation failures

### (app/globals.css):
- Tailwind CSS configuration file
- Imports Tailwind's base, components, and utilities styles
- Sets up global CSS styling for the application

### (app/layout.tsx):
- Root layout component for the Next.js application
- Sets metadata for the Slackmoji Maker app
- Uses Inter font from Google Fonts
- Provides basic HTML structure with language and body configuration

### (app/page.tsx):
- Main page component for Slackmoji Maker
- Client-side React component with state management
- Provides UI for emoji generation:
  - Input field for word/phrase
  - Generate button
  - Loading state handling
  - Error message display
  - Generated emoji preview
  - Download and Slack upload options
- Handles image generation request to the `/api/emoji-generate` endpoint
- Supports downloading generated emoji as PNG
- Includes responsive design with Tailwind CSS

## lib Folder

### (lib/openai.ts):
- Initializes OpenAI client with API key from environment variables
- Provides configured OpenAI instance for API interactions

### (lib/process.ts):
- Contains image processing utilities for emoji generation
- `processEmojiImage` function:
  - Resizes image to 128x128 pixels
  - Removes white/near-white background
  - Converts to transparent PNG
  - Optimizes file size for Slack upload
- `fetchImageBuffer` function to retrieve image from URL

This documentation provides an overview of the Slackmoji Maker application's structure and key functionalities across the `app` and `lib` directories.
</CLAUDE_CONTEXT_PATROL_DO_NOT_EDIT>