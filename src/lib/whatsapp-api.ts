/**
 * Envia mensagem para WhatsApp via Evolution API
 */
export async function sendWhatsAppMessage(message: string): Promise<boolean> {
  const apiUrl = process.env.EVOLUTION_API_URL
  const apiKey = process.env.EVOLUTION_API_KEY
  const instanceName = process.env.EVOLUTION_INSTANCE_NAME
  const phoneNumber = process.env.WHATSAPP_NUMBER

  console.log('=== WhatsApp Debug ===')
  console.log('API URL:', apiUrl)
  console.log('Instance:', instanceName)
  console.log('Phone:', phoneNumber)

  if (!apiUrl || !apiKey || !instanceName || !phoneNumber) {
    console.error('Variáveis de ambiente do WhatsApp não configuradas')
    console.error('EVOLUTION_API_URL:', !!apiUrl)
    console.error('EVOLUTION_API_KEY:', !!apiKey)
    console.error('EVOLUTION_INSTANCE_NAME:', !!instanceName)
    console.error('WHATSAPP_NUMBER:', !!phoneNumber)
    return false
  }

  try {
    // Evolution API v2 format - apikey no header
    const url = `${apiUrl}/message/sendText/${instanceName}`

    console.log('Sending to URL:', url)
    console.log('Request body:', JSON.stringify({
      number: phoneNumber,
      text: message,
    }))

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
      },
      body: JSON.stringify({
        number: phoneNumber,
        text: message,
      }),
    })

    console.log('Response status:', response.status)

    const responseData = await response.json().catch(() => ({}))

    if (!response.ok) {
      console.error('Erro ao enviar WhatsApp:', response.status)
      console.error('Error response:', JSON.stringify(responseData, null, 2))
      return false
    }

    console.log('WhatsApp response:', responseData)
    console.log('=== WhatsApp Success ===')
    return true
  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error)
    return false
  }
}
