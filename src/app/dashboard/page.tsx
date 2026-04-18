'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface MeasurementData {
  peso: string
  cintura: string
  gordura_corporal: string
  gordura_visceral: string
  massa_muscular: string
  idade_corporal: string
  rm_basal: string
  imc: string
}

interface FieldConfig {
  label: string
  unit: string
  placeholder: string
  inputMode: 'decimal' | 'numeric'
  maxLength: number
  maxDecimals: number
  maxValue: number
  optional?: boolean
}

const fieldConfigs: Record<keyof MeasurementData, FieldConfig> = {
  peso: { label: 'Peso', unit: 'kg', placeholder: '0,0', inputMode: 'decimal', maxLength: 5, maxDecimals: 2, maxValue: 999.99 },
  cintura: { label: 'Cintura', unit: 'cm', placeholder: '0,0', inputMode: 'decimal', maxLength: 5, maxDecimals: 2, maxValue: 999.99 },
  gordura_corporal: { label: 'Gordura', unit: '%', placeholder: '—', inputMode: 'decimal', maxLength: 5, maxDecimals: 2, maxValue: 99.99, optional: true },
  gordura_visceral: { label: 'Gordura Visceral', unit: 'nív', placeholder: '—', inputMode: 'numeric', maxLength: 2, maxDecimals: 0, maxValue: 99, optional: true },
  massa_muscular: { label: 'Massa Muscular', unit: '%', placeholder: '—', inputMode: 'decimal', maxLength: 5, maxDecimals: 2, maxValue: 99.99, optional: true },
  idade_corporal: { label: 'Idade Corporal', unit: 'anos', placeholder: '—', inputMode: 'numeric', maxLength: 3, maxDecimals: 0, maxValue: 150, optional: true },
  rm_basal: { label: 'RM Basal', unit: 'kcal', placeholder: '—', inputMode: 'decimal', maxLength: 5, maxDecimals: 0, maxValue: 9999, optional: true },
  imc: { label: 'IMC', unit: 'IMC', placeholder: '—', inputMode: 'decimal', maxLength: 5, maxDecimals: 2, maxValue: 99.99, optional: true },
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<MeasurementData>({
    peso: '',
    cintura: '',
    gordura_corporal: '',
    gordura_visceral: '',
    massa_muscular: '',
    idade_corporal: '',
    rm_basal: '',
    imc: '',
  })

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof MeasurementData, string>>>({})

  // Verifica autenticação
  useEffect(() => {
    const session = sessionStorage.getItem('secapp_auth')
    const timestamp = sessionStorage.getItem('secapp_timestamp')

    if (session !== 'true' || !timestamp) {
      router.push('/')
      return
    }

    const elapsed = Date.now() - parseInt(timestamp)
    const thirtyMinutes = 30 * 60 * 1000

    if (elapsed > thirtyMinutes) {
      sessionStorage.removeItem('secapp_auth')
      sessionStorage.removeItem('secapp_timestamp')
      router.push('/')
      return
    }

    // Atualiza timestamp para renovar sessão
    sessionStorage.setItem('secapp_timestamp', Date.now().toString())
  }, [router])

  const validateField = (field: keyof MeasurementData, value: string): string | null => {
    if (!value) return null // Campo vazio é OK para opcionais

    const config = fieldConfigs[field]
    const numValue = parseFloat(value.replace(',', '.'))

    if (isNaN(numValue)) return 'Valor inválido'
    if (numValue > config.maxValue) return `Máximo: ${config.maxValue}`
    if (value.replace(',', '.').length > config.maxLength) return `Máximo ${config.maxLength} dígitos`

    return null
  }

  const handleInputChange = (field: keyof MeasurementData, value: string) => {
    // Permite apenas números, ponto e vírgula decimal
    if (value && !/^[\d.,]*$/.test(value)) return

    // Normaliza para ponto decimal
    const normalizedValue = value.replace(',', '.')

    // Limita casas decimais
    const config = fieldConfigs[field]
    if (normalizedValue.includes('.')) {
      const parts = normalizedValue.split('.')
      if (parts[1]?.length > config.maxDecimals) {
        value = parts[0] + '.' + parts[1].slice(0, config.maxDecimals)
      }
    }

    // Converte vírgula para ponto internamente
    const finalValue = value.replace(',', '.')

    setFormData(prev => ({
      ...prev,
      [field]: finalValue,
    }))

    // Valida e atualiza erro do campo
    const errorMsg = validateField(field, finalValue)
    setFieldErrors(prev => ({
      ...prev,
      [field]: errorMsg || undefined,
    }))
  }

  const handleLogout = () => {
    sessionStorage.removeItem('secapp_auth')
    sessionStorage.removeItem('secapp_timestamp')
    router.push('/')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    // Valida todos os campos antes de enviar
    const newErrors: Partial<Record<keyof MeasurementData, string>> = {}
    let hasError = false

    // Valida obrigatórios
    if (!formData.peso || parseFloat(formData.peso) === 0) {
      newErrors.peso = 'Obrigatório'
      hasError = true
    }
    if (!formData.cintura || parseFloat(formData.cintura) === 0) {
      newErrors.cintura = 'Obrigatório'
      hasError = true
    }

    // Valida opcionais preenchidos
    (Object.keys(formData) as Array<keyof MeasurementData>).forEach(field => {
      if (field !== 'peso' && field !== 'cintura' && formData[field]) {
        const errorMsg = validateField(field, formData[field])
        if (errorMsg) {
          newErrors[field] = errorMsg
          hasError = true
        }
      }
    })

    if (hasError) {
      setFieldErrors(newErrors)
      setError('Corrija os campos em vermelho')
      setLoading(false)
      return
    }

    try {
      // Prepara dados para envio
      const measurementData = {
        peso: parseFloat(formData.peso),
        cintura: parseFloat(formData.cintura),
        gordura_corporal: formData.gordura_corporal ? parseFloat(formData.gordura_corporal) : null,
        gordura_visceral: formData.gordura_visceral ? parseInt(formData.gordura_visceral) : null,
        massa_muscular: formData.massa_muscular ? parseFloat(formData.massa_muscular) : null,
        idade_corporal: formData.idade_corporal ? parseInt(formData.idade_corporal) : null,
        rm_basal: formData.rm_basal ? parseFloat(formData.rm_basal) : null,
        imc: formData.imc ? parseFloat(formData.imc) : null,
      }

      const response = await fetch('/api/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(measurementData),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Limpa formulário
        setFormData({
          peso: '',
          cintura: '',
          gordura_corporal: '',
          gordura_visceral: '',
          massa_muscular: '',
          idade_corporal: '',
          rm_basal: '',
          imc: '',
        })
        setFieldErrors({})

        // Esconde mensagem de sucesso após 5 segundos
        setTimeout(() => setSuccess(false), 5000)
      } else {
        setError(result.error || 'Erro ao salvar medidas')
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const renderField = (field: keyof MeasurementData) => {
    const config = fieldConfigs[field]
    const value = formData[field]
    const hasError = fieldErrors[field]

    return (
      <div>
        <label className="block text-xs text-white font-medium mb-1">
          {config.label} {!config.optional && <span className="text-red-400">*</span>}
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode={config.inputMode}
            value={value.replace('.', ',')}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={config.placeholder}
            maxLength={config.maxLength}
            className={`w-full bg-dark-input border rounded-lg
              px-3 py-2 text-white text-right pr-10
              focus:outline-none focus:ring-1
              placeholder-gray-500 text-sm
              ${hasError
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-600 focus:border-primary focus:ring-primary'
              }`}
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
            {config.unit}
          </span>
        </div>
        {hasError && (
          <p className="text-[10px] text-red-400 mt-0.5">{hasError}</p>
        )}
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-dark-bg p-2">
      <div className="max-w-2xl mx-auto">
        {/* Header Compacto */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <div>
              <h1 className="text-base font-bold text-white">Lançamento Semanal</h1>
              <p className="text-[10px] text-gray-400">
                {new Date().toLocaleDateString('pt-BR', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs text-gray-300 bg-dark-card rounded-lg
                     hover:bg-dark-input transition-colors border border-gray-700"
          >
            Sair
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Dados Obrigatórios */}
          <div className="bg-dark-card rounded-xl p-3 border border-gray-700">
            <h2 className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wide">
              Dados Obrigatórios
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {renderField('peso')}
              {renderField('cintura')}
            </div>
          </div>

          {/* Composição Corporal (Opcional) */}
          <div className="bg-dark-card rounded-xl p-3 border border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                Composição Corporal
              </h2>
              <span className="px-1.5 py-0.5 text-[10px] bg-gray-700 text-gray-300 rounded">
                OPCIONAL
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {renderField('gordura_corporal')}
              {renderField('gordura_visceral')}
              {renderField('massa_muscular')}
              {renderField('idade_corporal')}
              {renderField('rm_basal')}
              {renderField('imc')}
            </div>
          </div>

          {/* Mensagens de Erro/Sucesso */}
          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-2 text-red-400 text-xs">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-2 text-green-400 text-xs">
              ✅ Medidas salvas! WhatsApp enviado.
            </div>
          )}

          {/* Botão Salvar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-primary hover:bg-primary-dark disabled:bg-gray-600
                     text-white font-semibold rounded-xl transition-all
                     active:scale-[0.98] disabled:cursor-not-allowed
                     flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
          >
            {loading ? (
              <span className="animate-pulse text-sm">Salvando...</span>
            ) : (
              <>
                <span>💾</span>
                <span className="text-sm">Salvar Medidas</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-[10px] mt-4">
          Dados seguros e armazenados localmente
        </p>
      </div>
    </main>
  )
}
