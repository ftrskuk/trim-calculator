import { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({
      message: 'OpenAI API key is not configured on the server.',
    })
  }

  try {
    const { deckle, rolls } = req.body as {
      deckle?: { min?: number; max?: number }
      rolls?: Array<{ id: string; width: number; tons: number }>
    }

    if (!deckle || !rolls || !Array.isArray(rolls) || rolls.length === 0) {
      return res.status(400).json({ message: 'Invalid payload: deckle and rolls are required.' })
    }

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: DEFAULT_MODEL,
        temperature: 0.2,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'trim_plan',
            schema: {
              type: 'object',
              required: ['sets'],
              properties: {
                sets: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['combination', 'multiplier'],
                    properties: {
                      combination: {
                        type: 'object',
                        additionalProperties: { type: 'integer', minimum: 0 },
                      },
                      multiplier: { type: 'integer', minimum: 0 },
                    },
                  },
                },
              },
            },
          },
        },
        messages: [
          {
            role: 'system',
            content:
              '당신은 제지 공장의 트림 계획을 최적화하는 전문가입니다. Deckle 범위 내에서 손실을 최소화하도록 세트 조합을 제안하세요. JSON만 반환하세요.',
          },
          {
            role: 'user',
            content: `Deckle 범위: ${deckle.min}~${deckle.max} mm. 요구 롤: ${rolls
              .map((roll) => `${roll.id}=${roll.width}mm/${roll.tons}t`)
              .join(', ')}.`,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      },
    )

    const content = response.data?.choices?.[0]?.message?.content
    if (!content) {
      return res.status(502).json({ message: 'AI 응답이 비어 있습니다.' })
    }

    let parsed
    try {
      parsed = JSON.parse(content)
    } catch (error) {
      return res.status(502).json({ message: 'AI 응답을 JSON으로 파싱할 수 없습니다.' })
    }

    res.json(parsed)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      res.status(error.response?.status ?? 500).json({
        message: error.response?.data?.error?.message ?? 'Failed to fetch AI plan',
      })
    } else if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'Unknown error occurred while contacting OpenAI' })
    }
  }
}
