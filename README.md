# Pastebin-Lite

A simple Pastebin clone built with Next.js and Vercel KV (Upstash Redis).
Supports TTL expiry and max view limits.

## Running Locally

1. Clone the repository:
   git clone https://github.com/Shivamdev290102/pastebin-lite.git

2. Install dependencies:
   cd pastebin-lite
   npm install

3. Create a `.env.local` file and add your Redis credentials from Vercel Upstash:
   KV_REST_API_URL=...
   KV_REST_API_TOKEN=...
   KV_REST_API_READ_ONLY_TOKEN=...
   KV_URL=...
   REDIS_URL=...

4. Start development server:
   npm run dev

5. Test endpoints:
   GET http://localhost:3000/api/healthz
   POST http://localhost:3000/api/pastes

## Persistence

This app uses Vercel KV backed by Upstash (Redis).
It ensures data persists across deployments and serverless invocations.

## Design Notes

- TTL and max-view logic are enforced in `/api/pastes/[id]`
- The page route `/p/[id]` fetches from the API, not Redis directly.
- Parameters use async destructuring required in Next.js 15.
- All API endpoints return JSON with proper HTTP codes.

