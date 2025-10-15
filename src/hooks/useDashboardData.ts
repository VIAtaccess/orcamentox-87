
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardData = () => {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Só executa as queries se o usuário estiver logado
  const { data: solicitacoes = [], isLoading: loadingSolicitacoes } = useQuery({
    queryKey: ['solicitacoes', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('solicitacoes_orcamento')
        .select('*')
        .or(`cliente_id.eq.${user.id},email_cliente.eq.${user.email}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar solicitações:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: propostas = [], isLoading: loadingPropostas } = useQuery({
    queryKey: ['propostas', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];

      // Buscar propostas relacionadas às solicitações do cliente
      const { data: solicitacoesDoCliente } = await supabase
        .from('solicitacoes_orcamento')
        .select('id')
        .eq('email_cliente', user.email);

      if (!solicitacoesDoCliente || solicitacoesDoCliente.length === 0) {
        return [];
      }

      const solicitacaoIds = solicitacoesDoCliente.map(s => s.id);

      const { data, error } = await supabase
        .from('propostas')
        .select(`
          *,
          solicitacao:solicitacoes_orcamento(*),
          profissionais:prestador_id(nome, nota_media, foto_url)
        `)
        .in('solicitacao_id', solicitacaoIds)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Erro ao buscar propostas:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!user?.email,
  });

  const { data: favoritos = [], isLoading: loadingFavoritos } = useQuery({
    queryKey: ['favoritos', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('favoritos')
        .select('*')
        .eq('cliente_id', user.id);

      if (error) {
        console.error('Erro ao buscar favoritos:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!user?.id,
  });

  return {
    user,
    solicitacoes,
    propostas,
    favoritos,
    loading: loadingSolicitacoes || loadingPropostas || loadingFavoritos,
    stats: {
      totalSolicitacoes: solicitacoes.length,
      solicitacoesAbertas: solicitacoes.filter(s => s.status === 'ativa').length,
      totalPropostas: propostas.length,
      totalFavoritos: favoritos.length,
    }
  };
};
