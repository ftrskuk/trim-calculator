# Trim Calculator

AI-assisted web application that helps paper mills and converters plan roll combinations within machine deckle limits while minimizing trim loss. The project ships with a React/Tailwind front-end and an Express-based API that wraps OpenAI's Chat Completions endpoint for automated set planning.

## Features

- Trim planning workspace with interactive tables and real-time roll/tonnage calculations
- "AI로 채우기" workflow that requests optimal combinations from OpenAI and populates the UI automatically
- Health-checked Express API with JSON schema validation of AI responses
- Export hooks (Excel/PDF) and Zustand-powered state management for fast client-side updates
- Fully typed TypeScript codebase across client and server

## Tech Stack

- Frontend: React 19, Vite, TypeScript, Tailwind CSS, Zustand
- Backend: Express, TypeScript, Axios, dotenv, OpenAI Chat Completions API
- Tooling: ESLint, Prettier, ts-node, npm

## Project Structure

```
trim-calculator/
├─ docs/              # Product requirements and design notes
├─ server/            # Express API service
│  ├─ src/            # TypeScript source (routes, bootstrap)
│  └─ tsconfig.json
├─ web/               # React front-end (Vite)
│  ├─ src/            # Components, hooks, store, utilities
│  └─ README.md       # Vite template docs (kept for reference)
└─ README.md          # ← you are here
```

## Prerequisites

- Node.js 20 LTS or newer (npm included)
- OpenAI API key with access to the configured model (default `gpt-4o-mini`)

## Environment Variables

Create `server/.env` from the example file:

```
OPENAI_API_KEY=replace-me
```

Optional: provide `VITE_API_BASE` when serving the front-end from a different origin (defaults to same-origin requests).

```
VITE_API_BASE=http://localhost:5174
```

## Installation

Install dependencies for both workspaces (run from repository root):

```
cd server
npm install

cd ../web
npm install
```

## Running Locally

Start the API server (port defaults to `5174`):

```
cd server
npm run dev
```

In a separate terminal, run the Vite development server (defaults to `5173`):

```
cd web
npm run dev
```

Open the UI at `http://localhost:5173`. Configure `VITE_API_BASE` if the API runs on a non-default host/port.

## Production Builds

- API: `cd server && npm run build` produces `dist/`. Run with `npm start` (requires environment variables).
- Web: `cd web && npm run build` outputs static assets to `dist/`. Preview locally with `npm run preview` or deploy the `dist/` folder to any static host.

## API Reference

- `GET /health` → `{ "status": "ok" }`
- `POST /api/ai/fill`
  - Request body: `{ deckle: { min: number, max: number }, rolls: [{ id: string, width: number, tons: number }] }`
  - Response body: `{ sets: [{ combination: Record<string, number>, multiplier: number }] }`
  - Requires `OPENAI_API_KEY` server-side environment variable.

## Troubleshooting

- `OPENAI_API_KEY is not set at server startup`: ensure `server/.env` exists and the key is valid.
- Cross-origin requests blocked: set `VITE_API_BASE` to the fully qualified API origin, or proxy requests through Vite config.
- AI response parse errors: the OpenAI model must support the JSON schema response format specified in `server/src/routes/ai.ts`.

## Roadmap

- Persist trim plans for later retrieval
- Admin UI for managing paper mill and deckle metadata
- Cost analysis that translates trim loss into monetary impact

## License

This project is distributed under the ISC license. See `package.json` for details.


