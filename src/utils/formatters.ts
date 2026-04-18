/**
 * Formata número decimal para exibição (padrão brasileiro)
 */
export function formatDecimal(value: number | null | undefined, decimals: number = 1): string {
  if (value === null || value === undefined) return '—'
  return value.toFixed(decimals).replace('.', ',')
}

/**
 * Formata número inteiro
 */
export function formatInteger(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return Math.round(value).toString()
}

/**
 * Formata data para exibição
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Formata data com hora
 */
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Calcula diferença entre dois valores
 */
export function calculateDifference(current: number, previous: number): number {
  return current - previous
}

/**
 * Formata diferença com sinal
 */
export function formatDifference(current: number | null, previous: number | null, decimals: number = 1): string {
  if (current === null || previous === null) return '—'

  const diff = current - previous
  const sign = diff > 0 ? '+' : ''
  return `${sign}${diff.toFixed(decimals)}`
}

/**
 * Calcula IMC (Índice de Massa Corporal)
 */
export function calculateIMC(peso: number, altura: number): number {
  if (altura <= 0) return 0
  return peso / (altura * altura)
}

/**
 * Retorna classificação do IMC
 */
export function getIMCClassification(imc: number): string {
  if (imc < 18.5) return 'Abaixo do peso'
  if (imc < 25) return 'Normal'
  if (imc < 30) return 'Sobrepeso'
  if (imc < 35) return 'Obesidade I'
  if (imc < 40) return 'Obesidade II'
  return 'Obesidade III'
}
