import { nanoid } from 'nanoid/non-secure'
import { create } from 'zustand'
import { PAPER_MILLS } from '../data'
import type {
  AiFillResponse,
  BaseInfo,
  RollDefinition,
  SetColumn,
  TrimStore,
} from '../types'

const createRoll = (index: number): RollDefinition => ({
  id: nanoid(6),
  width: 1200 + index * 50,
  requiredTons: 10,
})

const createSet = (index: number, rollIds: string[]): SetColumn => ({
  id: nanoid(6),
  label: `Set ${index + 1}`,
  multiplier: 1,
  combination: rollIds.reduce<Record<string, number>>((acc, rollId) => {
    acc[rollId] = 0
    return acc
  }, {}),
})

const INITIAL_ROLLS = [createRoll(0), createRoll(1)]

const initialBaseInfo: BaseInfo = {
  millId: PAPER_MILLS[0]?.id ?? null,
  basisWeight: 80,
  rollLength: 4000,
}

const initialSets: SetColumn[] = [createSet(0, INITIAL_ROLLS.map((roll) => roll.id))]

const syncSetCombinationKeys = (set: SetColumn, rolls: RollDefinition[]): SetColumn => {
  const existingKeys = new Set(Object.keys(set.combination))
  const updatedCombination: Record<string, number> = {}
  for (const roll of rolls) {
    updatedCombination[roll.id] = existingKeys.has(roll.id) ? set.combination[roll.id] ?? 0 : 0
  }
  return {
    ...set,
    combination: updatedCombination,
  }
}

export const useTrimStore = create<TrimStore>((set, get) => ({
  mills: PAPER_MILLS,
  baseInfo: initialBaseInfo,
  rolls: INITIAL_ROLLS,
  sets: initialSets,
  loadingAi: false,
  aiError: null,

  setMill: (millId) => {
    set((state) => ({
      baseInfo: {
        ...state.baseInfo,
        millId,
      },
    }))
  },

  updateBaseInfo: (partial) => {
    set((state) => ({
      baseInfo: {
        ...state.baseInfo,
        ...partial,
      },
    }))
  },

  addRoll: () => {
    const index = get().rolls.length
    const newRoll = createRoll(index)
    set((state) => {
      const rolls = [...state.rolls, newRoll]
      const sets = state.sets.map((setItem) => syncSetCombinationKeys(setItem, rolls))
      return { rolls, sets }
    })
  },

  updateRoll: (id, changes) => {
    set((state) => ({
      rolls: state.rolls.map((roll) =>
        roll.id === id
          ? {
              ...roll,
              ...changes,
            }
          : roll,
      ),
    }))
  },

  removeRoll: (id) => {
    set((state) => {
      const rolls = state.rolls.filter((roll) => roll.id !== id)
      const sets = state.sets.map((setItem) => syncSetCombinationKeys(setItem, rolls))
      return { rolls, sets }
    })
  },

  addSet: () => {
    set((state) => {
      const sets = [
        ...state.sets,
        createSet(state.sets.length, state.rolls.map((roll) => roll.id)),
      ]
      return { sets }
    })
  },

  removeSet: (id) => {
    set((state) => ({
      sets: state.sets.filter((setItem) => setItem.id !== id),
    }))
  },

  updateSetCombination: (setId, rollId, quantity) => {
    set((state) => ({
      sets: state.sets.map((setItem) =>
        setItem.id === setId
          ? {
              ...setItem,
              combination: {
                ...setItem.combination,
                [rollId]: Math.max(0, quantity),
              },
            }
          : setItem,
      ),
    }))
  },

  updateSetMultiplier: (setId, multiplier) => {
    set((state) => ({
      sets: state.sets.map((setItem) =>
        setItem.id === setId
          ? {
              ...setItem,
              multiplier: Math.max(0, multiplier),
            }
          : setItem,
      ),
    }))
  },

  applyAiPlan: (sets) => {
    set((state) => {
      const rollIds = state.rolls.map((roll) => roll.id)
      const plan: SetColumn[] = sets.map((setData, index) => ({
        id: nanoid(6),
        label: `AI Set ${index + 1}`,
        multiplier: setData.multiplier,
        combination: rollIds.reduce<Record<string, number>>((acc, rollId) => {
          acc[rollId] = setData.combination[rollId] ?? 0
          return acc
        }, {}),
      }))
      return {
        sets: plan.length > 0 ? plan : state.sets,
      }
    })
  },

  setLoadingAi: (loading) => {
    set({ loadingAi: loading })
  },

  setAiError: (message) => {
    set({ aiError: message })
  },

  resetPlan: () => set({
    baseInfo: initialBaseInfo,
    rolls: INITIAL_ROLLS,
    sets: initialSets,
    loadingAi: false,
    aiError: null,
  }),
}))

export const buildAiPayload = () => {
  const state = useTrimStore.getState()
  const mill = state.mills.find((mill) => mill.id === state.baseInfo.millId)
  if (!mill) {
    throw new Error('No paper mill selected')
  }
  return {
    deckle: mill.deckle,
    rolls: state.rolls.map((roll) => ({
      id: roll.id,
      width: roll.width,
      tons: roll.requiredTons,
    })),
  }
}

export const parseAiResponse = (response: AiFillResponse) => response.sets

