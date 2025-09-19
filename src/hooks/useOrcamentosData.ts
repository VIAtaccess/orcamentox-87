
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOrcamentosData = () => {
  const { data: orcamentos = [], isLoading } = useQuery({
    queryKey: ['orcamentos-publicos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('solicitacoes_orcamento')
        .select(`
          *,
          categoria:categories!inner(name, slug),
          subcategoria:subcategories(name, slug)
        `)
        .eq('status', 'ativa')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar orçamentos:', error);
        return [];
      }
      return data || [];
    },
  });

  return {
    orcamentos,
    loading: isLoading
  };
};
