import clsx from 'clsx'
import { useTrimStore } from '../store/useTrimStore'
import { buildSetSummaries, computeRollProduction, formatNumber } from '../utils/calculations'

export const SetSummaryPanel = () => {
  const baseInfo = useTrimStore((state) => state.baseInfo)
  const mills = useTrimStore((state) => state.mills)
  const mill = mills.find((candidate) => candidate.id === baseInfo.millId)
  const sets = useTrimStore((state) => state.sets)
  const rolls = useTrimStore((state) => state.rolls)

  const setSummaries = buildSetSummaries(sets, rolls, baseInfo, mill?.deckle)
  const rollSummaries = rolls.map((roll) => ({
    roll,
    production: computeRollProduction(roll, sets, baseInfo),
  }))

  return (
    <section className="space-y-6 rounded-xl bg-white p-6 shadow-sm">
      <header>
        <h2 className="text-xl font-semibold">최종 발주 요약</h2>
        <p className="text-sm text-slate-500">필요량 대비 생산량을 확인하고 부족/초과 구간을 파악하세요.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rollSummaries.map(({ roll, production }) => {
          const difference = production.tons - roll.requiredTons
          return (
            <article key={roll.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-700">지폭 {roll.width.toLocaleString()} mm</h3>
              <dl className="mt-3 space-y-1 text-sm text-slate-600">
                <div className="flex justify-between">
                  <dt>필요 (톤)</dt>
                  <dd className="font-medium text-slate-700">{formatNumber(roll.requiredTons, 3)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>생산 (롤 / 톤)</dt>
                  <dd className="font-medium text-slate-700">
                    {formatNumber(production.rolls, 0)}롤 / {formatNumber(production.tons, 3)}t
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>차이 (톤)</dt>
                  <dd
                    className={clsx('font-semibold', {
                      'text-blue-600': difference >= 0.0001,
                      'text-red-500': difference <= -0.0001,
                    })}
                  >
                    {difference > 0 ? '+' : ''}
                    {formatNumber(difference, 3)}
                  </dd>
                </div>
              </dl>
            </article>
          )
        })}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-700">세트별 요약</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2">세트</th>
                <th className="px-3 py-2">지폭합 (mm)</th>
                <th className="px-3 py-2">Deckle 적합 여부</th>
                <th className="px-3 py-2">총 무게 (톤)</th>
              </tr>
            </thead>
            <tbody>
              {setSummaries.map((summary) => (
                <tr key={summary.id} className="rounded-lg bg-slate-50 text-sm text-slate-600">
                  <td className="rounded-l-lg px-3 py-2 font-medium text-slate-700">{summary.label}</td>
                  <td className="px-3 py-2">{formatNumber(summary.deckleTotal, 0)} mm</td>
                  <td className="px-3 py-2">
                    <span
                      className={clsx('rounded-full px-3 py-1 text-xs font-semibold', {
                        'bg-emerald-100 text-emerald-700': summary.withinDeckle,
                        'bg-red-100 text-red-600': !summary.withinDeckle,
                      })}
                    >
                      {summary.withinDeckle ? 'Deckle 적합' : 'Deckle 초과'}
                    </span>
                  </td>
                  <td className="rounded-r-lg px-3 py-2 font-medium text-slate-700">
                    {formatNumber(summary.weightInTons, 3)} t
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

