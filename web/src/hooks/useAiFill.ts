import axios from 'axios'
import { useCallback } from 'react'
import { buildAiPayload, parseAiResponse, useTrimStore } from '../store/useTrimStore'

const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/$/, '') ?? ''
const AI_ENDPOINT = `${API_BASE}/api/ai/fill`

export const useAiFill = () => {
  const applyAiPlan = useTrimStore((state) => state.applyAiPlan)
  const setLoadingAi = useTrimStore((state) => state.setLoadingAi)
  const setAiError = useTrimStore((state) => state.setAiError)

  const requestAiFill = useCallback(async () => {
    try {
      setAiError(null)
      setLoadingAi(true)
      const payload = buildAiPayload()

      const response = await axios.post(AI_ENDPOINT, payload)
      const data = parseAiResponse(response.data)
      applyAiPlan(data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setAiError(error.response?.data?.message ?? 'AI 요청에 실패했습니다.')
      } else if (error instanceof Error) {
        setAiError(error.message)
      } else {
        setAiError('AI 요청 처리 중 알 수 없는 오류가 발생했습니다.')
      }
    } finally {
      setLoadingAi(false)
    }
  }, [applyAiPlan, setAiError, setLoadingAi])

  return { requestAiFill }
}

export const AI_ENDPOINT_URL = AI_ENDPOINT

