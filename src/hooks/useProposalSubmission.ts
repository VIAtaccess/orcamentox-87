import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { notifyClientNewProposal } from '@/utils/whatsappNotifications';

export const useProposalSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitProposal = async (proposalData: {
    solicitacao_id: string;
    prestador_id: string;
    valor_proposto?: number;
    prazo_estimado?: string;
    descricao_proposta: string;
    materiais_inclusos?: boolean;
    garantia?: string;
  }) => {
    setIsSubmitting(true);
    
    try {
      // Insert the proposal
      const { data: proposal, error: proposalError } = await supabase
        .from('propostas')
        .insert([proposalData])
        .select()
        .single();

      if (proposalError) {
        throw proposalError;
      }

      // Get solicitacao details and provider info to send WhatsApp notification
      const { data: solicitacao, error: solicitacaoError } = await supabase
        .from('solicitacoes_orcamento')
        .select('titulo, whatsapp_cliente, email_cliente, cliente_id, clientes(whatsapp)')
        .eq('id', proposalData.solicitacao_id)
        .single();

      // Get provider details from user metadata
      const { data: userData } = await supabase.auth.getUser();
      let provider: any = null;
      
      if (userData?.user?.id === proposalData.prestador_id) {
        // User is the same as prestador, use user metadata
        provider = {
          nome: userData.user.user_metadata?.nome,
          whatsapp: userData.user.user_metadata?.whatsapp
        };
      }

      if (solicitacaoError) {
        console.error('Error fetching solicitacao:', solicitacaoError);
      }

      // Send WhatsApp notification to client
      try {
        let clientWhatsApp = null;
        if (solicitacao?.clientes?.whatsapp) {
          clientWhatsApp = solicitacao.clientes.whatsapp;
        } else if (solicitacao?.whatsapp_cliente) {
          clientWhatsApp = solicitacao.whatsapp_cliente;
        }

        console.log('Cliente WhatsApp encontrado:', clientWhatsApp);

        if (clientWhatsApp && provider) {
          const proposalValue = proposalData.valor_proposto ? `R$ ${proposalData.valor_proposto}` : 'Valor a negociar';
          const deadline = proposalData.prazo_estimado || 'A definir';
          
          // Formatacao do numero com codigo do pais
          const cleanedWhatsApp = clientWhatsApp.replace(/\D/g, '');
          const formattedWhatsApp = cleanedWhatsApp.startsWith('55') ? cleanedWhatsApp : `55${cleanedWhatsApp}`;
          
          // Formatacao do WhatsApp do profissional
          const providerWhatsApp = provider.whatsapp ? provider.whatsapp.replace(/\D/g, '') : '';
          const formattedProviderWhatsApp = providerWhatsApp.startsWith('55') ? providerWhatsApp : `55${providerWhatsApp}`;
          
          console.log('Enviando notificação WhatsApp para cliente:', formattedWhatsApp);
          console.log('Dados do profissional:', provider.nome, formattedProviderWhatsApp);
          
          await notifyClientNewProposal(
            formattedWhatsApp,
            proposalValue,
            deadline,
            proposalData.descricao_proposta,
            solicitacao.titulo,
            provider.nome || 'Profissional',
            formattedProviderWhatsApp,
            proposalData.materiais_inclusos,
            proposalData.garantia
          );
          
          toast.success('Proposta enviada e cliente notificado via WhatsApp!');
        } else {
          console.log('WhatsApp do cliente ou dados do profissional não encontrados');
          toast.success('Proposta enviada! (Dados para notificação WhatsApp não encontrados)');
        }
      } catch (notificationError) {
        console.error('Error sending WhatsApp notification:', notificationError);
        toast.warning('Proposta enviada, mas notificação WhatsApp falhou');
      }

      return proposal;
    } catch (error) {
      console.error('Error submitting proposal:', error);
      toast.error('Erro ao enviar proposta');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitProposal,
    isSubmitting
  };
};