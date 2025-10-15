// Utility functions for sending WhatsApp notifications
import { supabase } from '@/integrations/supabase/client';

export const sendWhatsAppMessage = async (recipients: string[], message: string): Promise<void> => {
  try {
    console.log('Enviando WhatsApp para:', recipients);
    console.log('Mensagem:', message);

    // Enviar via Edge Function para cada destinatário
    for (const recipient of recipients) {
      await supabase.functions.invoke('send-whatsapp-notifications', {
        body: {
          whatsapp_number: recipient,
          message: message
        }
      });
    }
    
    console.log('WhatsApp messages enviadas com sucesso');
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
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