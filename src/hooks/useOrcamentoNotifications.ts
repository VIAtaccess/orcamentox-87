import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { notifyProvidersNewRequest } from '@/utils/whatsappNotifications';
import { toast } from 'sonner';

export const useOrcamentoNotifications = () => {
  const [isSending, setIsSending] = useState(false);

  const notifyProviders = async (solicitacaoId: string, titulo: string, categoria: string, uf: string, cidade: string) => {
    setIsSending(true);
    
    try {
      console.log('Iniciando busca de prestadores para:', { categoria, uf, cidade });
      
      // Buscar prestadores da mesma categoria e região (sem filtrar por subcategoria)
      const { data: prestadores, error } = await supabase
        .from('profissionais')
        .select('whatsapp, nome')
        .eq('categoria_slug', categoria)
        .eq('uf', uf)
        .eq('cidade', cidade)
        .eq('ativo', true)
        .not('whatsapp', 'is', null)
        .neq('whatsapp', '');

      console.log('Prestadores encontrados:', prestadores);

      if (error) {
        console.error('Erro ao buscar prestadores:', error);
        toast.error('Erro ao buscar prestadores para notificar');
        return;
      }

      if (!prestadores || prestadores.length === 0) {
        console.log('Nenhum prestador encontrado para os critérios:', { categoria, uf, cidade });
        toast.info('Nenhum prestador encontrado na sua região para esta categoria');
        return;
      }

      const whatsappNumbers = prestadores
        .map(p => p.whatsapp)
        .filter(Boolean)
        .map(number => {
          // Remove qualquer formatação e adiciona o código do país 55
          const cleaned = number.replace(/\D/g, '');
          return cleaned.startsWith('55') ? cleaned : `55${cleaned}`;
        });

      console.log('Números WhatsApp formatados:', whatsappNumbers);

      if (whatsappNumbers.length === 0) {
        toast.info('Nenhum prestador com WhatsApp encontrado');
        return;
      }

      console.log('Enviando notificações WhatsApp...');
      await notifyProvidersNewRequest(titulo, solicitacaoId, whatsappNumbers);
      
      toast.success(`${whatsappNumbers.length} prestadores notificados via WhatsApp!`);
    } catch (error) {
      console.error('Erro ao enviar notificações:', error);
      toast.error('Erro ao enviar notificações WhatsApp');
    } finally {
      setIsSending(false);
    }
  };

  return {
    notifyProviders,
    isSending
  };
};