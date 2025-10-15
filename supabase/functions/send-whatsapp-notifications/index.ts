
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { whatsapp_number, message } = await req.json()
    
    console.log('Enviando WhatsApp para:', whatsapp_number)
    console.log('Mensagem:', message)

    if (!whatsapp_number || !message) {
      return new Response(
        JSON.stringify({ error: 'whatsapp_number e message são obrigatórios' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Enviar mensagem via WhatsApp API
    const whatsappResponse = await fetch('https://7167.bubblewhats.com/recursive-send-message', {
      method: 'POST',
      headers: {
        'Authorization': 'MWE1YzViMzlkMWUxYmY1ZDIzODQwZjhl',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipients: whatsapp_number,
        message: message,
        interval: "1"
      })
    })

    const responseText = await whatsappResponse.text()
    console.log('WhatsApp API Response:', responseText)

    if (!whatsappResponse.ok) {
      console.error('WhatsApp API Error:', responseText)
      return new Response(
        JSON.stringify({ 
          error: 'Falha ao enviar WhatsApp',
          details: responseText 
        }),
        { 
          status: whatsappResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'WhatsApp enviado com sucesso'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
