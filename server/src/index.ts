import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'
import aiRouter from './routes/ai.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Try to load .env from multiple locations
const envPaths = [
  join(__dirname, '../.env'),           // server/.env
  join(__dirname, '../../.env'),        // root/.env  
  join(__dirname, '../../env.server')   // root/env.server
]

let envLoaded = false
for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    config({ path: envPath })
    envLoaded = true
    console.log(`Loaded environment from: ${envPath}`)
    break
  }
}

if (!envLoaded) {
  console.warn('No .env file found in server/, root/, or env.server. Using default dotenv behavior.')
  config() // fallback to default dotenv behavior
}

if (!process.env.OPENAI_API_KEY) {
  // eslint-disable-next-line no-console
  console.warn('OPENAI_API_KEY is not set at server startup')
}

const app = express()

app.use(cors({ origin: true }))
app.use(express.json())

app.use('/api/ai', aiRouter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

const PORT = Number(process.env.PORT ?? 5174)

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${PORT}`)
})

