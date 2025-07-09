# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Slackmoji Maker is a Next.js application that generates custom Slack emojis using OpenAI's DALL-E 3 API. Users input a word or phrase, and the app generates a 128×128px transparent PNG emoji suitable for Slack upload.

Key features:
- AI-powered emoji generation using OpenAI's DALL-E 3
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