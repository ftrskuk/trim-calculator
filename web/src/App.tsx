import { BaseInfoForm } from './components/BaseInfoForm'
import { RollTable } from './components/RollTable'
import { SetSummaryPanel } from './components/SetSummaryPanel'
import { Toolbar } from './components/Toolbar'

const App = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8">
        <header className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">AI 기반 초지기 트림 사이즈 계산기</h1>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
              v1.0
            </span>
          </div>
          <p className="max-w-3xl text-sm text-slate-600">
            제지사의 Deckle에 맞춰 지폭 조합을 구성하고, GPT-5 추천을 통해 최적의 생산 계획을 세울 수 있는 도구입니다.
          </p>
        </header>

        <BaseInfoForm />
        <Toolbar />
        <RollTable />
        <SetSummaryPanel />
      </div>
    </div>
  )
}

export default App
