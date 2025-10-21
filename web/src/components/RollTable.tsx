import clsx from 'clsx'
import type { ChangeEvent } from 'react'
import { useTrimStore } from '../store/useTrimStore'
import {
  buildSetSummaries,
  computeRollProduction,
  formatNumber,
} from '../utils/calculations'

const numericValue = (event: ChangeEvent<HTMLInputElement>) => {
  const value = Number(event.target.value)
  return Number.isNaN(value) ? 0 : value
}

export const RollTable = () => {
  const rolls = useTrimStore((state) => state.rolls)
  const sets = useTrimStore((state) => state.sets)
  const baseInfo = useTrimStore((state) => state.baseInfo)
  const mills = useTrimStore((state) => state.mills)
  const mill = mills.find((candidate) => candidate.id === baseInfo.millId)

  const updateRoll = useTrimStore((state) => state.updateRoll)
  const removeRoll = useTrimStore((state) => state.removeRoll)
  const addRoll = useTrimStore((state) => state.addRoll)
  const addSet = useTrimStore((state) => state.addSet)
  const removeSet = useTrimStore((state) => state.removeSet)
  const updateSetCombination = useTrimStore((state) => state.updateSetCombination)
  const updateSetMultiplier = useTrimStore((state) => state.updateSetMultiplier)

  const deckleRangeLabel = mill ? `${mill.deckle.min.toLocaleString()} mm ~ ${mill.deckle.max.toLocaleString()} mm` : 'N/A'
  const setSummaries = buildSetSummaries(sets, rolls, baseInfo, mill?.deckle)

  return (
    <section className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">세트 조합 구성</h2>
          <p className="text-sm text-slate-500">Deckle 범위: {deckleRangeLabel}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={addRoll}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
          >
            지폭 추가
          </button>
          <button
            onClick={addSet}
            className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            세트 추가
          </button>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="w-48 rounded-tl-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                지폭 (mm)
              </th>
              <th className="w-32 border border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                필요 수량 (톤)
              </th>
              {sets.map((set) => (
                <th key={set.id} className="border border-slate-200 bg-slate-50 px-4 py-3 text-left">
                  <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                    <span>{set.label}</span>
                    <button
                      onClick={() => removeSet(set.id)}
                      className="rounded-md border border-transparent px-2 py-1 text-xs text-red-500 hover:border-red-100 hover:bg-red-50"
                    >
                      ✖
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    <span>세트 개수</span>
                    <input
                      type="number"
                      min={0}
                      value={set.multiplier}
                      onChange={(event) => updateSetMultiplier(set.id, numericValue(event))}
                      className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                  </div>
                </th>
              ))}
              <th className="w-48 rounded-tr-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                생산량 (롤 / 톤)
              </th>
            </tr>
          </thead>
          <tbody>
            {rolls.map((roll) => {
              const production = computeRollProduction(roll, sets, baseInfo)
              return (
                <tr key={roll.id} className="odd:bg-white even:bg-slate-50">
                  <td className="border border-slate-200 px-4 py-3 align-top">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        value={roll.width}
                        onChange={(event) => updateRoll(roll.id, { width: numericValue(event) })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      />
                      <button
                        onClick={() => removeRoll(roll.id)}
                        className="rounded-md border border-transparent px-2 py-2 text-xs text-red-500 hover:border-red-100 hover:bg-red-50"
                      >
                        ✖
                      </button>
                    </div>
                  </td>
                  <td className="border border-slate-200 px-4 py-3 align-top">
                    <input
                      type="number"
                      min={0}
                      value={roll.requiredTons}
                      onChange={(event) => updateRoll(roll.id, { requiredTons: numericValue(event) })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                  </td>
                  {sets.map((set) => (
                    <td key={set.id} className="border border-slate-200 px-4 py-3 align-top">
                      <input
                        type="number"
                        min={0}
                        value={set.combination[roll.id] ?? 0}
                        onChange={(event) => updateSetCombination(set.id, roll.id, numericValue(event))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      />
                    </td>
                  ))}
                  <td className="border border-slate-200 px-4 py-3 align-top text-sm text-slate-600">
                    <div className="font-medium text-slate-700">{formatNumber(production.rolls, 0)} 롤</div>
                    <div className="text-xs text-slate-500">{formatNumber(production.tons, 3)} 톤</div>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 text-sm text-slate-600">
              <td colSpan={2} className="border border-slate-200 px-4 py-3 font-semibold text-slate-700">
                지폭합
              </td>
              {setSummaries.map((summary) => (
                <td key={summary.id} className="border border-slate-200 px-4 py-3">
                  <span
                    className={clsx(
                      'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                      summary.withinDeckle ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600',
                    )}
                  >
                    {formatNumber(summary.deckleTotal, 0)} mm
                  </span>
                </td>
              ))}
              <td className="border border-slate-200 px-4 py-3 text-sm" />
            </tr>
            <tr className="bg-slate-100 text-sm text-slate-600">
              <td colSpan={2} className="border border-slate-200 px-4 py-3 font-semibold text-slate-700">
                총 무게 (톤)
              </td>
              {setSummaries.map((summary) => (
                <td key={summary.id} className="border border-slate-200 px-4 py-3 font-medium text-slate-700">
                  {formatNumber(summary.weightInTons, 3)} t
                </td>
              ))}
              <td className="border border-slate-200 px-4 py-3 text-sm" />
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}

