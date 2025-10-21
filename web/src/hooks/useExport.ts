import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { utils, writeFileXLSX } from 'xlsx'
import { useTrimStore } from '../store/useTrimStore'
import {
  buildSetSummaries,
  computeRollProduction,
} from '../utils/calculations'

export const useExport = () => {
  const state = useTrimStore()
  const mill = state.mills.find((candidate) => candidate.id === state.baseInfo.millId)

  const rollSummaries = state.rolls.map((roll) => ({
    roll,
    production: computeRollProduction(roll, state.sets, state.baseInfo),
  }))

  const setSummaries = buildSetSummaries(state.sets, state.rolls, state.baseInfo, mill?.deckle)

  const exportToExcel = () => {
    const workbook = utils.book_new()

    const baseSheetData = [
      ['제지사', mill?.name ?? '미선택'],
      ['평량 (g/m²)', state.baseInfo.basisWeight ?? '-'],
      ['롤 길이 (m)', state.baseInfo.rollLength ?? '-'],
    ]
    const baseSheet = utils.aoa_to_sheet(baseSheetData)
    utils.book_append_sheet(workbook, baseSheet, '기본 정보')

    const rollSheetData = [
      ['지폭 (mm)', '필요 톤', '생산 롤', '생산 톤', '차이 톤'],
      ...rollSummaries.map(({ roll, production }) => [
        roll.width,
        roll.requiredTons,
        production.rolls,
        Number(production.tons.toFixed(3)),
        Number((production.tons - roll.requiredTons).toFixed(3)),
      ]),
    ]
    const rollSheet = utils.aoa_to_sheet(rollSheetData)
    utils.book_append_sheet(workbook, rollSheet, '지폭 요약')

    const setSheetData = [
      ['세트', '지폭합 (mm)', 'Deckle 적합', '세트 개수', '총 무게 (톤)'],
      ...state.sets.map((set) => {
        const summary = setSummaries.find((candidate) => candidate.id === set.id)
        return [
          set.label,
          summary?.deckleTotal ?? 0,
          summary?.withinDeckle ? 'Y' : 'N',
          set.multiplier,
          Number((summary?.weightInTons ?? 0).toFixed(3)),
        ]
      }),
    ]
    const setSheet = utils.aoa_to_sheet(setSheetData)
    utils.book_append_sheet(workbook, setSheet, '세트 요약')

    writeFileXLSX(workbook, 'trim-calculator.xlsx')
  }

  const exportToPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape' })
    doc.setFontSize(16)
    doc.text('Trim Size Calculator Summary', 14, 20)

    doc.setFontSize(12)
    doc.text(`제지사: ${mill?.name ?? '미선택'}`, 14, 30)
    doc.text(`평량 (g/m²): ${state.baseInfo.basisWeight ?? '-'}`, 80, 30)
    doc.text(`롤 길이 (m): ${state.baseInfo.rollLength ?? '-'}`, 140, 30)

    autoTable(doc, {
      head: [['지폭 (mm)', '필요 톤', '생산 롤', '생산 톤', '차이 톤']],
      body: rollSummaries.map(({ roll, production }) => [
        roll.width,
        roll.requiredTons,
        production.rolls,
        production.tons.toFixed(3),
        (production.tons - roll.requiredTons).toFixed(3),
      ]),
      startY: 40,
      styles: { fontSize: 10 },
    })

    const lastTable = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
    const nextStartY = (lastTable?.finalY ?? 40) + 10

    autoTable(doc, {
      head: [['세트', '지폭합 (mm)', 'Deckle 적합', '세트 개수', '총 무게 (톤)']],
      body: state.sets.map((set) => {
        const summary = setSummaries.find((candidate) => candidate.id === set.id)
        return [
          set.label,
          summary?.deckleTotal ?? 0,
          summary?.withinDeckle ? 'Yes' : 'No',
          set.multiplier,
          (summary?.weightInTons ?? 0).toFixed(3),
        ]
      }),
      startY: nextStartY,
      styles: { fontSize: 10 },
    })

    doc.save('trim-calculator.pdf')
  }

  return { exportToExcel, exportToPdf }
}

