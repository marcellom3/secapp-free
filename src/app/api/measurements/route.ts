import { NextRequest, NextResponse } from 'next/server'
import { saveMeasurement, getComparisonData, Measurement } from '@/lib/measurements'
import { formatWhatsAppMessage } from '@/lib/whatsapp'
import { sendWhatsAppMessage } from '@/lib/whatsapp-api'

/**
 * GET - Busca todas as medições
 */
export async function GET() {
  try {
    const measurements = await getComparisonData()
    return NextResponse.json(measurements)
  } catch (error) {
    console.error('Erro ao buscar medições:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar medições' },
      { status: 500 }
    )
  }
}

/**
 * POST - Salva nova medição e envia WhatsApp
 */
export async function POST(request: NextRequest) {
  try {
    const body: Measurement = await request.json()

    console.log('=== Measurements API Debug ===')
    console.log('Received body:', body)

    // Valida campos obrigatórios
    if (!body.peso || !body.cintura) {
      return NextResponse.json(
        { error: 'Peso e cintura são obrigatórios' },
        { status: 400 }
      )
    }

    // Salva a medição
    const savedMeasurement = await saveMeasurement(body)
    console.log('Saved measurement:', savedMeasurement)

    // Busca dados para comparação
    const comparisonData = await getComparisonData()
    console.log('Comparison data:', {
      hasLast: !!comparisonData.last,
      hasFirst: !!comparisonData.first,
      hasPrevious: !!comparisonData.previous,
      total: comparisonData.total,
    })

    // Envia mensagem no WhatsApp (se houver dados para comparar)
    if (comparisonData.last && comparisonData.first) {
      const message = formatWhatsAppMessage({
        last: comparisonData.last,
        previous: comparisonData.previous,
        first: comparisonData.first,
        total: comparisonData.total ?? 0,
      })

      console.log('WhatsApp message generated, length:', message.length)
      console.log('First 200 chars:', message.substring(0, 200))

      const sent = await sendWhatsAppMessage(message)

      console.log('WhatsApp sent:', sent)

      if (!sent) {
        console.warn('Mensagem não enviada no WhatsApp')
      }
    } else {
      console.log('Skipping WhatsApp: missing comparison data')
    }

    return NextResponse.json({
      success: true,
      measurement: savedMeasurement,
      whatsappSent: true,
    })

  } catch (error) {
    console.error('Erro ao salvar medição:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar medição' },
      { status: 500 }
    )
  }
}
