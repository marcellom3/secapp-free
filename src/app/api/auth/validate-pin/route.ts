import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * Valida o PIN digitado pelo usuário
 */
export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json()

    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { valid: false, error: 'PIN inválido' },
        { status: 400 }
      )
    }

    // Busca o hash armazenado no banco
    const { data: settingData, error: fetchError } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'pin_hash')
      .single()

    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...')
    console.log('Dados do PIN:', settingData)
    console.log('Erro fetch:', fetchError)

    if (fetchError || !settingData) {
      console.error('Erro ao buscar PIN:', fetchError)
      return NextResponse.json(
        { valid: false, error: 'Erro interno: ' + (fetchError?.message || 'unknown') },
        { status: 500 }
      )
    }

    const storedHash = settingData.value

    console.log('PIN recebido:', pin)
    console.log('Hash armazenado:', storedHash?.substring(0, 20) + '...')

    // Valida o PIN usando bcrypt
    const bcrypt = require('bcryptjs')
    const isValid = await bcrypt.compare(pin, storedHash)

    console.log('PIN válido?', isValid)

    if (!isValid) {
      // Registra tentativa falha (para possível auditoria)
      await supabase.from('failed_login_attempts').insert([{
        ip_address: request.ip || 'unknown'
      }])

      return NextResponse.json({ valid: false }, { status: 401 })
    }

    // PIN válido - cria cookie de sessão
    const response = NextResponse.json({ valid: true })
    response.cookies.set('secapp_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 60, // 30 minutos
      path: '/',
    })
    response.cookies.set('secapp_timestamp', Date.now().toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 60,
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Erro na validação do PIN:', error)
    return NextResponse.json(
      { valid: false, error: 'Erro interno' },
      { status: 500 }
    )
  }
}
