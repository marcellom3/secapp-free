'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  // Verifica se já tem sessão válida
  useEffect(() => {
    const session = sessionStorage.getItem('secapp_auth')
    const timestamp = sessionStorage.getItem('secapp_timestamp')

    if (session === 'true' && timestamp) {
      const elapsed = Date.now() - parseInt(timestamp)
      const thirtyMinutes = 30 * 60 * 1000

      if (elapsed < thirtyMinutes) {
        router.push('/dashboard')
        return
      }
    }
    sessionStorage.removeItem('secapp_auth')
    sessionStorage.removeItem('secapp_timestamp')
  }, [router])

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num
      setPin(newPin)

      // Auto-submit quando completar 4 dígitos
      if (newPin.length === 4) {
        setTimeout(() => validatePin(newPin), 100)
      }
    }
  }

  const handleBackspace = () => {
    setPin(pin.slice(0, -1))
    setError('')
  }

  const validatePin = async (pinToValidate: string = pin) => {
    if (pinToValidate.length !== 4) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/validate-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinToValidate }),
      })

      const data = await response.json()

      if (response.ok && data.valid) {
        // Salva sessão
        sessionStorage.setItem('secapp_auth', 'true')
        sessionStorage.setItem('secapp_timestamp', Date.now().toString())
        router.push('/dashboard')
      } else {
        // PIN inválido
        setShake(true)
        setError('PIN inválido')
        setTimeout(() => {
          setShake(false)
          setPin('')
        }, 500)
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
      setPin('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-dark-bg">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚖️</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Medições Corporais
          </h1>
          <p className="text-gray-400 text-sm">
            OMRON HBF-214 • Projeto MCE
          </p>
        </div>

        {/* PIN Container */}
        <div className={`bg-dark-card rounded-2xl p-6 shadow-xl border border-gray-700 ${shake ? 'animate-shake' : ''}`}>
          <p className="text-gray-400 text-xs uppercase tracking-widest text-center mb-4">
            PIN de Acesso
          </p>

          {/* PIN Display */}
          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                  index < pin.length
                    ? 'bg-primary border-primary'
                    : 'border-gray-600 bg-transparent'
                }`}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-400 text-sm text-center mb-4">
              {error}
            </p>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                disabled={loading}
                className="h-16 rounded-xl bg-dark-input hover:bg-gray-600
                         text-white text-2xl font-semibold transition-all
                         active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                         border border-gray-600"
              >
                {num}
              </button>
            ))}

            {/* Bottom Row */}
            <button
              onClick={handleBackspace}
              disabled={loading || pin.length === 0}
              className="h-16 rounded-xl bg-dark-input hover:bg-gray-600
                       text-white text-xl transition-all active:scale-95
                       disabled:opacity-30 disabled:cursor-not-allowed
                       border border-gray-600 flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
              </svg>
            </button>

            <button
              onClick={() => handleNumberClick('0')}
              disabled={loading}
              className="h-16 rounded-xl bg-dark-input hover:bg-gray-600
                       text-white text-2xl font-semibold transition-all
                       active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                       border border-gray-600"
            >
              0
            </button>

            <button
              onClick={() => validatePin()}
              disabled={loading || pin.length !== 4}
              className="h-16 rounded-xl bg-primary hover:bg-primary-dark
                       text-white text-lg font-semibold transition-all
                       active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? '...' : 'OK'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-gray-500 text-xs text-center mt-6">
          Sistema seguro de medições
        </p>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </main>
  )
}
