// Utility functions for sending WhatsApp notifications
import { supabase } from '@/integrations/supabase/client';

export const sendWhatsAppMessage = async (recipients: string[], message: string): Promise<{ success: number; failed: number }> => {
  try {
    console.log('Enviando WhatsApp para:', recipients.length, 'destinatários');

    let success = 0;
    let failed = 0;

    // Enviar via Edge Function para cada destinatário
    for (const recipient of recipients) {
      try {
        const { error } = await supabase.functions.invoke('send-whatsapp-notifications', {
          body: {
            whatsapp_number: recipient,
            message: message
          }
        });
        
        if (error) {
          console.error('Erro ao enviar para', recipient, ':', error);
          failed++;
        } else {
          success++;
        }
      } catch (err) {
        console.error('Erro ao enviar para', recipient, ':', err);
        failed++;
      }
    }
    
    console.log(`WhatsApp: ${success} enviadas com sucesso, ${failed} falharam`);
    return { success, failed };
  } catch (error) {
    console.error('Error sending WhatsApp messages:', error);
    throw error;
  }
};

export const notifyProvidersNewRequest = async (
  titulo: string,
  solicitacaoId: string,
  providersWhatsApp: string[]
): Promise<{ success: number; failed: number }> => {
  const message = `🎯 Novo orçamento disponível! "${titulo}" 
  
📋 Acesse agora e envie sua proposta: https://orcamentox.lovable.app/orcamento/${solicitacaoId}

⏰ Seja rápido! As melhores oportunidades são aproveitadas primeiro! 💼✨`;

  return await sendWhatsAppMessage(providersWhatsApp, message);
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