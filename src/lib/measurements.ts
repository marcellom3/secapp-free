import { supabaseAdmin } from './supabase'

export interface Measurement {
  id?: string
  created_at?: string
  peso: number
  cintura: number
  gordura_corporal?: number | null
  gordura_visceral?: number | null
  massa_muscular?: number | null
  idade_corporal?: number | null
  rm_basal?: number | null
  imc?: number | null
}

/**
 * Busca todas as medições ordenadas por data (mais recente primeiro)
 */
export async function getAllMeasurements(): Promise<Measurement[]> {
  const { data, error } = await supabaseAdmin
    .from('measurements')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Salva uma nova medição
 */
export async function saveMeasurement(measurement: Measurement): Promise<Measurement> {
  const { data, error } = await supabaseAdmin
    .from('measurements')
    .insert([measurement])
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Busca as últimas 3 medições (última, penúltima e primeira)
 */
export async function getComparisonData(): Promise<{
  last: Measurement | null
  previous: Measurement | null
  first: Measurement | null
  total: number
}> {
  const { data, error } = await supabaseAdmin
    .from('measurements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) throw error

  const measurements = data || []

  if (measurements.length === 0) {
    return { last: null, previous: null, first: null, total: 0 }
  }

  return {
    last: measurements[0] || null,
    previous: measurements[1] || null,
    first: measurements[measurements.length - 1] || null,
    total: measurements.length,
  }
}
