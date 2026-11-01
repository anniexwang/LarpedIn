<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# LarpedIn AI post generator

This app handles Person 3's LLM and post-generation work for LarpedIn.

It uses server-side `/api/generate`, `/api/refine`, and `/api/hooks` endpoints.
Gemini API keys stay on the server and are never exposed to React.

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local`:
   `cp .env.example .env.local`
3. Set `GEMINI_API_KEY` in `.env.local`.
4. Run the app:
   `npm run dev`

## Person 3 handoff

The post generator accepts these profile and calendar fields:

- `archetype`
- `industry`
- `goal`
- `focus_areas`
- `calendar_event`
- `tone`
- `topic`
- `userFacts`
- `hookStyle`

Person 4 can provide calendar context as `calendar_event`, for example:
`"Hackathon presentation at 6 PM today"`.
