// Utility functions for sending WhatsApp notifications
import { supabase } from '@/integrations/supabase/client';

const WHATSAPP_API_URL = 'https://7167.bubblewhats.com/recursive-send-message';
const WHATSAPP_AUTH_TOKEN = 'MWE1YzViMzlkMWUxYmY1ZDIzODQwZjhl';

interface WhatsAppMessage {
  recipients: string;
  message: string;
  interval: string;
}

export const sendWhatsAppMessage = async (recipients: string[], message: string): Promise<void> => {
  try {
    console.log('Enviando WhatsApp para:', recipients);
    console.log('Mensagem:', message);

    // Tentar enviar via API direta primeiro
    const payload: WhatsAppMessage = {
      recipients: recipients.join(', '),
      message,
      interval: "1"
    };

    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': WHATSAPP_AUTH_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('WhatsApp API Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('WhatsApp API Error Response:', errorText);
      
      // Se a API direta falhar, tentar usar a Edge Function como fallback
      console.log('Tentando via Edge Function...');
      await sendViaEdgeFunction(recipients, message);
    } else {
      const responseData = await response.text();
      console.log('WhatsApp message sent successfully:', responseData);
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    
    // Fallback para Edge Function
    try {
      console.log('Fallback: Tentando via Edge Function...');
      await sendViaEdgeFunction(recipients, message);
    } catch (fallbackError) {
      console.error('Fallback também falhou:', fallbackError);
      throw error;
    }
  }
};

// Função fallback usando Edge Function
const sendViaEdgeFunction = async (recipients: string[], message: string): Promise<void> => {
  for (const recipient of recipients) {
    await supabase.functions.invoke('send-whatsapp-notifications', {
      body: {
        whatsapp_number: recipient,
        message: message
      }
    });
  }
};

export const notifyProvidersNewRequest = async (
  titulo: string,
  solicitacaoId: string,
  providersWhatsApp: string[]
): Promise<void> => {
  const message = `🎯 Novo orçamento disponível! "${titulo}" 
  
📋 Acesse agora e envie sua proposta: https://orcamentox.lovable.app/orcamento/${solicitacaoId}

⏰ Seja rápido! As melhores oportunidades são aproveitadas primeiro! 💼✨`;

  await sendWhatsAppMessage(providersWhatsApp, message);
};

export const notifyClientNewProposal = async (
  clientWhatsApp: string,
  proposalValue: string,
  deadline: string,
  description: string,
  serviceTitle: string,
  providerName: string,
  providerWhatsApp: string,
  materialsIncluded?: boolean,
  warranty?: string
): Promise<void> => {
  const materialsText = materialsIncluded ? 'Sim' : 'Não';
  const warrantyText = warranty || 'Não informado';
  
  const message = `🎉 Nova proposta recebida para "${serviceTitle}"!

👨‍🔧 Profissional: ${providerName}
📱 WhatsApp do profissional: ${providerWhatsApp}

💰 Valor proposto: ${proposalValue}
⏰ Prazo estimado: ${deadline}

📋 Descrição da proposta:
${description}

🔧 Materiais inclusos: ${materialsText}
🛡️ Garantia oferecida: ${warrantyText}

💬 Entre em contato direto com o profissional pelo WhatsApp: ${providerWhatsApp}

✨ Obrigado por usar o ORÇAMENTOX!`;

  await sendWhatsAppMessage([clientWhatsApp], message);
};