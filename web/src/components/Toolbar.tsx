import { useTrimStore } from '../store/useTrimStore'
import { useAiFill } from '../hooks/useAiFill'
import { useExport } from '../hooks/useExport'

export const Toolbar = () => {
  const { requestAiFill } = useAiFill()
  const resetPlan = useTrimStore((state) => state.resetPlan)
  const loadingAi = useTrimStore((state) => state.loadingAi)
  const aiError = useTrimStore((state) => state.aiError)
  const { exportToExcel, exportToPdf } = useExport()

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">작업 도구</h2>
          <p className="text-sm text-slate-500">AI 추천 및 내보내기 기능을 활용해 발주 계획을 완성하세요.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={requestAiFill}
            disabled={loadingAi}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {loadingAi ? 'AI 계산 중...' : 'AI로 채우기'}
          </button>
          <button
            onClick={exportToExcel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Excel로 내보내기
          </button>
          <button
            onClick={exportToPdf}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            PDF로 내보내기
          </button>
          <button
            onClick={resetPlan}
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
          >
            초기화
          </button>
        </div>
      </div>
      {aiError && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {aiError}
        </p>
      )}
    </section>
  )
}

