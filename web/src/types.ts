export type DeckleRange = {
  min: number
  max: number
}

export type PaperMill = {
  id: string
  name: string
  deckle: DeckleRange
}

export type RollDefinition = {
  id: string
  width: number
  requiredTons: number
}

export type SetColumn = {
  id: string
  label: string
  multiplier: number
  combination: Record<string, number>
}

export type BaseInfo = {
  millId: string | null
  basisWeight: number | null
  rollLength: number | null
}

export type TrimState = {
  baseInfo: BaseInfo
  rolls: RollDefinition[]
  sets: SetColumn[]
  mills: PaperMill[]
  loadingAi: boolean
  aiError: string | null
}

export type TrimStore = TrimState & {
  setMill: (millId: string | null) => void
  updateBaseInfo: (partial: Partial<Omit<BaseInfo, 'millId'>>) => void
  addRoll: () => void
  updateRoll: (id: string, changes: Partial<Omit<RollDefinition, 'id'>>) => void
  removeRoll: (id: string) => void
  addSet: () => void
  removeSet: (id: string) => void
  updateSetCombination: (setId: string, rollId: string, quantity: number) => void
  updateSetMultiplier: (setId: string, multiplier: number) => void
  applyAiPlan: (sets: Array<{ combination: Record<string, number>; multiplier: number }>) => void
  setLoadingAi: (loading: boolean) => void
  setAiError: (message: string | null) => void
  resetPlan: () => void
}

export type AiFillRequest = {
  deckle: DeckleRange
  rolls: Array<{ id: string; width: number; tons: number }>
}

export type AiFillResponse = {
  sets: Array<{
    combination: Record<string, number>
    multiplier: number
  }>
}

export type RollProduction = {
  rolls: number
  tons: number
}

export type SetSummary = {
  id: string
  label: string
  deckleTotal: number
  withinDeckle: boolean
  weightInTons: number
}

export type ExportSnapshot = {
  mill?: PaperMill
  baseInfo: BaseInfo
  rolls: RollDefinition[]
  sets: SetColumn[]
  setSummaries: SetSummary[]
  rollProductions: Array<{
    roll: RollDefinition
    production: RollProduction
  }>
}

