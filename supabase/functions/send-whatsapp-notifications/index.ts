
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
    // Esta função será chamada periodicamente para processar notificações pendentes
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    
    // Buscar notificações pendentes
    const response = await fetch(`${supabaseUrl}/rest/v1/whatsapp_notifications?status=eq.pending&limit=10`, {
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json',
      },
    })

    const notifications = await response.json()
    console.log(`Processando ${notifications.length} notificações WhatsApp`)

    // Processar cada notificação
    for (const notification of notifications) {
      try {
        // Enviar mensagem via WhatsApp API
        const whatsappResponse = await fetch('https://7017.bubblewhats.com/recursive-send-message', {
          method: 'POST',
          headers: {
            'Authorization': 'NTExYzUxZGIzMjc2MTAxZjJhNzhkMjAx',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipients: notification.whatsapp_number,
            message: notification.message,
            interval: "1"
          })
        })

        if (whatsappResponse.ok) {
          // Marcar como enviada
          await fetch(`${supabaseUrl}/rest/v1/whatsapp_notifications?id=eq.${notification.id}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${supabaseAnonKey}`,
              'apikey': supabaseAnonKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: 'sent',
              sent_at: new Date().toISOString()
            })
          })
          console.log(`Notificação ${notification.id} enviada com sucesso`)
        } else {
          // Marcar como falhou
          const errorText = await whatsappResponse.text()
          await fetch(`${supabaseUrl}/rest/v1/whatsapp_notifications?id=eq.${notification.id}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${supabaseAnonKey}`,
              'apikey': supabaseAnonKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: 'failed',
              error_message: errorText
            })
          })
          console.error(`Erro ao enviar notificação ${notification.id}:`, errorText)
        }
      } catch (error) {
        console.error(`Erro ao processar notificação ${notification.id}:`, error)
        // Marcar como falhou
        await fetch(`${supabaseUrl}/rest/v1/whatsapp_notifications?id=eq.${notification.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'apikey': supabaseAnonKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'failed',
            error_message: error.message
          })
        })
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: notifications.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Erro geral:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
