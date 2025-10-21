import type { ChangeEvent } from 'react'
import { useTrimStore } from '../store/useTrimStore'

const numericValue = (event: ChangeEvent<HTMLInputElement>) => {
  const value = Number(event.target.value)
  return Number.isNaN(value) ? null : value
}

export const BaseInfoForm = () => {
  const mills = useTrimStore((state) => state.mills)
  const baseInfo = useTrimStore((state) => state.baseInfo)
  const setMill = useTrimStore((state) => state.setMill)
  const updateBaseInfo = useTrimStore((state) => state.updateBaseInfo)

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">기본 정보 설정</h2>
          <p className="text-sm text-slate-500">Deckle 정보와 무게 계산 기준을 입력하세요.</p>
        </div>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-600">제지사 선택</span>
          <select
            value={baseInfo.millId ?? ''}
            onChange={(event) => setMill(event.target.value || null)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            {mills.map((mill) => (
              <option key={mill.id} value={mill.id}>
                {mill.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-600">평량 (g/m²)</span>
          <input
            type="number"
            min={0}
            value={baseInfo.basisWeight ?? ''}
            onChange={(event) => updateBaseInfo({ basisWeight: numericValue(event) })}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-600">롤 길이 (m)</span>
          <input
            type="number"
            min={0}
            value={baseInfo.rollLength ?? ''}
            onChange={(event) => updateBaseInfo({ rollLength: numericValue(event) })}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </label>
      </div>
    </section>
  )
}

