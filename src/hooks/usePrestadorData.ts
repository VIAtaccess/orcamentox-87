
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePrestadorData = () => {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Buscar orçamentos disponíveis para o prestador (baseado na categoria e localização)
  const { data: orcamentosDisponiveis = [], isLoading: loadingOrcamentos } = useQuery({
    queryKey: ['orcamentos-disponiveis', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Primeiro buscar dados do prestador
      const { data: prestador } = await supabase
        .from('profissionais')
        .select('categoria_slug, uf, cidade')
        .eq('id', user.id)
        .maybeSingle();

      if (!prestador) return [];

      // Buscar orçamentos ativos na mesma categoria e região
      const { data, error } = await supabase
        .from('solicitacoes_orcamento')
        .select(`
          *,
          categoria:categories!inner(name, slug),
          subcategoria:subcategories(name, slug)
        `)
        .eq('status', 'ativa')
        .eq('uf', prestador.uf)
        .eq('cidade', prestador.cidade)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar orçamentos disponíveis:', error);
        return [];
      }

      // Filtrar por categoria se o prestador tiver uma categoria definida
      if (prestador.categoria_slug) {
        return data?.filter(orcamento => 
          orcamento.categoria?.slug === prestador.categoria_slug
        ) || [];
      }

      return data || [];
    },
    enabled: !!user?.id,
  });

  // Buscar propostas enviadas pelo prestador
  const { data: propostas = [], isLoading: loadingPropostas } = useQuery({
    queryKey: ['propostas-prestador', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('propostas')
        .select(`
          *,
          solicitacao:solicitacoes_orcamento!inner(*)
        `)
        .eq('prestador_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar propostas:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Buscar dados do perfil do prestador
  const { data: prestador } = useQuery({
    queryKey: ['prestador-perfil', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('profissionais')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar prestador:', error);
        return null;
      }
      return data;
    },
    enabled: !!user?.id,
  });

  return {
    user,
    prestador,
    orcamentosDisponiveis,
    propostas,
    loading: loadingOrcamentos || loadingPropostas,
    stats: {
      totalOrcamentosDisponiveis: orcamentosDisponiveis.length,
      totalPropostas: propostas.length,
      proposasAceitas: propostas.filter(p => p.status === 'aceita').length,
      avaliacaoMedia: prestador?.nota_media || 0,
    }
  };
};
