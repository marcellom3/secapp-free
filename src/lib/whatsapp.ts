import { Measurement } from './measurements'

/**
 * Formata a mensagem comparativa para WhatsApp
 */
export function formatWhatsAppMessage(data: {
  last: Measurement
  previous: Measurement | null
  first: Measurement | null
  total: number
}): string {
  const { last, previous, first, total } = data

  const daysSinceStart = first?.created_at
    ? Math.ceil((Date.now() - new Date(first.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  let message = `🏋️ Medições Corporais • ${formatDate(last.created_at)}\n`
  message += `⏱️ Balança: OMRON HBF-214\n`
  message += `🗓️ *${daysSinceStart} dias de Projeto*\n\n`

  // Comparação com o início do projeto
  message += `📋 *Desde o início do projeto*\n`
  message += `─────────────────────────\n`

  if (first) {
    message += formatComparisonLine('⚖️', 'Peso', last.peso, first.peso, ' kg', 2)
    message += formatComparisonLine('📏', 'Cintura', last.cintura, first.cintura, ' cm', 2)

    if (last.gordura_corporal && first.gordura_corporal) {
      message += formatComparisonLine('🎯', 'Gord. corp.', last.gordura_corporal, first.gordura_corporal, '%', 2)
    }
    if (last.gordura_visceral && first.gordura_visceral) {
      message += formatComparisonLine('🔴', 'Gord. visceral', last.gordura_visceral, first.gordura_visceral, '', 0, true)
    }
    if (last.massa_muscular && first.massa_muscular) {
      message += formatComparisonLine('💪', 'Massa musc.', last.massa_muscular, first.massa_muscular, '%', 2)
    }
    if (last.idade_corporal && first.idade_corporal) {
      message += formatComparisonLine('🧬', 'Idade corporal', last.idade_corporal, first.idade_corporal, ' anos', 0, true)
    }
    if (last.rm_basal && first.rm_basal) {
      message += formatComparisonLine('🔥', 'RM Basal', last.rm_basal, first.rm_basal, ' kcal', 0, true)
    }
    if (last.imc && first.imc) {
      const imcStatus = getIMCStatus(last.imc)
      message += formatComparisonLineWithStatus('📊', 'IMC', last.imc, first.imc, ' kg/m²', 2, imcStatus)
    }
  }

  // Comparação com a medição anterior
  message += `\n📋 *Comparado à semana passada*\n`
  message += `─────────────────────────\n`

  if (previous) {
    message += formatDifferenceLine('⚖️', 'Peso', last.peso, previous.peso, ' kg', 2)
    message += formatDifferenceLine('📏', 'Cintura', last.cintura, previous.cintura, ' cm', 2)

    if (last.gordura_corporal && previous.gordura_corporal) {
      message += formatDifferenceLine('🎯', 'Gord. corp.', last.gordura_corporal, previous.gordura_corporal, '%', 2)
    }
    if (last.gordura_visceral !== null && previous.gordura_visceral !== null && last.gordura_visceral !== undefined && previous.gordura_visceral !== undefined) {
      message += formatDifferenceLine('🔴', 'Gord. visceral', last.gordura_visceral, previous.gordura_visceral, '', 0)
    }
    if (last.massa_muscular && previous.massa_muscular) {
      message += formatDifferenceLine('💪', 'Massa musc.', last.massa_muscular, previous.massa_muscular, '%', 2)
    }
    if (last.idade_corporal && previous.idade_corporal) {
      message += formatDifferenceLine('🧬', 'Idade corporal', last.idade_corporal, previous.idade_corporal, ' anos', 0)
    }
    if (last.rm_basal && previous.rm_basal) {
      message += formatDifferenceLine('🔥', 'RM Basal', last.rm_basal, previous.rm_basal, ' kcal', 0)
    }
    if (last.imc && previous.imc) {
      message += formatDifferenceLine('📊', 'IMC', last.imc, previous.imc, ' kg/m²', 2)
    }
  } else {
    message += `_Primeira medição registrada!_\n`
  }

  return message
}

/**
 * Formata uma linha de comparação (valor inicial → valor final)
 */
function formatComparisonLine(
  emoji: string,
  label: string,
  currentValue: number | undefined,
  initialValue: number | undefined,
  unit: string,
  decimals: number,
  isInteger: boolean = false
): string {
  if (currentValue === undefined || initialValue === undefined) return ''

  const diff = (currentValue as number) - (initialValue as number)
  const diffFormatted = diff > 0 ? `(+${diff.toFixed(decimals).replace('.', ',')})` : `(${diff.toFixed(decimals).replace('.', ',')})`
  const currentFormatted = isInteger ? Math.round(currentValue as number) : (currentValue as number).toFixed(decimals).replace('.', ',')
  const initialFormatted = isInteger ? Math.round(initialValue as number) : (initialValue as number).toFixed(decimals).replace('.', ',')

  return `${emoji} ${label}: ${initialFormatted} → ${currentFormatted} ${unit} ${diffFormatted}\n`
}

/**
 * Formata uma linha de comparação com status (para IMC)
 */
function formatComparisonLineWithStatus(
  emoji: string,
  label: string,
  currentValue: number | undefined,
  initialValue: number | undefined,
  unit: string,
  decimals: number,
  status: string
): string {
  if (currentValue === undefined || initialValue === undefined) return ''

  const diff = currentValue - initialValue
  const diffFormatted = diff > 0 ? `(+${diff.toFixed(decimals).replace('.', ',')})` : `(${diff.toFixed(decimals).replace('.', ',')})`

  return `${emoji} ${label}: ${initialValue.toFixed(decimals).replace('.', ',')} → ${currentValue.toFixed(decimals).replace('.', ',')} ${unit} ${diffFormatted} | ${status}\n`
}

/**
 * Formata uma linha de diferença (apenas a variação)
 */
function formatDifferenceLine(
  emoji: string,
  label: string,
  currentValue: number | undefined,
  previousValue: number | undefined,
  unit: string,
  decimals: number = 1
): string {
  if (currentValue === undefined || previousValue === undefined) return ''

  const diff = (currentValue as number) - (previousValue as number)
  const diffFormatted = diff.toFixed(decimals).replace('.', ',')

  return `${emoji} ${label}: ${diff > 0 ? '+' : ''}${diffFormatted} ${unit}\n`
}

/**
 * Formata a data para exibição
 */
function formatDate(dateString?: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

/**
 * Retorna o status do IMC
 */
function getIMCStatus(imc: number): string {
  if (imc < 18.5) return 'Abaixo do peso'
  if (imc < 25) return 'Normal'
  if (imc < 30) return 'Sobrepeso'
  if (imc < 35) return 'Obesidade I'
  if (imc < 40) return 'Obesidade II'
  return 'Obesidade III'
}
