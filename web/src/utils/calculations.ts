import type {
  BaseInfo,
  RollDefinition,
  RollProduction,
  SetColumn,
  SetSummary,
} from '../types'

export const tonPerRoll = (
  roll: RollDefinition,
  baseInfo: BaseInfo,
): number => {
  const { basisWeight, rollLength } = baseInfo
  if (!basisWeight || !rollLength) {
    return 0
  }
  const widthMeters = roll.width / 1000
  const area = widthMeters * rollLength
  const grams = area * basisWeight
  return grams / 1_000_000
}

export const computeRollProduction = (
  roll: RollDefinition,
  sets: SetColumn[],
  baseInfo: BaseInfo,
): RollProduction => {
  const producedRolls = sets.reduce((acc, set) => {
    const quantity = set.combination[roll.id] ?? 0
    return acc + quantity * set.multiplier
  }, 0)

  const perRollTon = tonPerRoll(roll, baseInfo)
  return {
    rolls: producedRolls,
    tons: producedRolls * perRollTon,
  }
}

export const computeSetDeckleTotal = (set: SetColumn, rolls: RollDefinition[]): number =>
  rolls.reduce((acc, roll) => acc + roll.width * (set.combination[roll.id] ?? 0), 0)

export const computeSetWeight = (
  set: SetColumn,
  rolls: RollDefinition[],
  baseInfo: BaseInfo,
): number => {
  const totalPerSet = rolls.reduce((acc, roll) => {
    const quantity = set.combination[roll.id] ?? 0
    const perRollTon = tonPerRoll(roll, baseInfo)
    return acc + quantity * perRollTon
  }, 0)
  return totalPerSet * set.multiplier
}

export const buildSetSummaries = (
  sets: SetColumn[],
  rolls: RollDefinition[],
  baseInfo: BaseInfo,
  deckleRange: { min: number; max: number } | undefined,
): SetSummary[] =>
  sets.map((set) => {
    const deckleTotal = computeSetDeckleTotal(set, rolls)
    const withinDeckle = deckleRange
      ? deckleTotal >= deckleRange.min && deckleTotal <= deckleRange.max
      : true
    const weightInTons = computeSetWeight(set, rolls, baseInfo)
    return {
      id: set.id,
      label: set.label,
      deckleTotal,
      withinDeckle,
      weightInTons,
    }
  })

export const formatNumber = (value: number, digits = 2) =>
  Number.isFinite(value) ? value.toLocaleString(undefined, { maximumFractionDigits: digits }) : '0'

