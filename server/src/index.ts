import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import aiRouter from './routes/ai.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, '../.env') })
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

