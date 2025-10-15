
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
    queryKey: ['orcamentos-disponiveis', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      
      // Primeiro buscar dados do prestador pelo email
      const { data: prestador } = await supabase
        .from('profissionais')
        .select('categoria_slug, uf, cidade, id')
        .eq('email', user.email)
        .maybeSingle();

      if (!prestador) return [];

      // Buscar orçamentos ativos na mesma categoria e região
      const { data: orcamentosData, error } = await supabase
        .from('solicitacoes_orcamento')
        .select('*')
        .eq('status', 'ativa')
        .eq('uf', prestador.uf)
        .eq('cidade', prestador.cidade)
        .order('created_at', { ascending: false })
        .limit(20); // Buscar mais para filtrar por categoria depois

      if (error) {
        console.error('Erro ao buscar orçamentos disponíveis:', error);
        return [];
      }

      if (!orcamentosData || orcamentosData.length === 0) {
        return [];
      }

      // Buscar dados de categorias e subcategorias
      const categoriaIds = orcamentosData.map(o => o.categoria_id).filter(Boolean);
      const subcategoriaIds = orcamentosData.map(o => o.subcategoria_id).filter(Boolean);

      const [categoriasData, subcategoriasData] = await Promise.all([
        categoriaIds.length > 0 
          ? supabase.from('categories').select('id, name, slug').in('id', categoriaIds)
          : Promise.resolve({ data: [] }),
        subcategoriaIds.length > 0
          ? supabase.from('subcategories').select('id, name, slug').in('id', subcategoriaIds)
          : Promise.resolve({ data: [] })
      ]);

      // Combinar os dados
      let orcamentosComDados = orcamentosData.map(orcamento => ({
        ...orcamento,
        categoria: categoriasData.data?.find(c => c.id === orcamento.categoria_id),
        subcategoria: subcategoriasData.data?.find(s => s.id === orcamento.subcategoria_id)
      }));

      // Filtrar por categoria se o prestador tiver uma categoria definida
      if (prestador.categoria_slug) {
        orcamentosComDados = orcamentosComDados.filter(orcamento => 
          orcamento.categoria?.slug === prestador.categoria_slug
        );
      }

      return orcamentosComDados.slice(0, 5);
    },
    enabled: !!user?.email,
  });

  // Buscar propostas enviadas pelo prestador
  const { data: propostas = [], isLoading: loadingPropostas } = useQuery({
    queryKey: ['propostas-prestador', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];

      // Primeiro buscar ID do prestador pelo email
      const { data: prestador } = await supabase
        .from('profissionais')
        .select('id')
        .eq('email', user.email)
        .maybeSingle();

      if (!prestador) return [];

      const { data: propostasData, error } = await supabase
        .from('propostas')
        .select('*')
        .eq('prestador_id', prestador.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Erro ao buscar propostas:', error);
        return [];
      }
      
      // Buscar dados das solicitações
      const solicitacaoIds = propostasData?.map(p => p.solicitacao_id).filter(Boolean) || [];
      
      if (solicitacaoIds.length === 0) {
        return propostasData || [];
      }
      
      const { data: solicitacoesData } = await supabase
        .from('solicitacoes_orcamento')
        .select('*')
        .in('id', solicitacaoIds);
      
      // Combinar os dados
      return propostasData?.map(proposta => ({
        ...proposta,
        solicitacao: solicitacoesData?.find(s => s.id === proposta.solicitacao_id)
      })) || [];
    },
    enabled: !!user?.email,
  });

  // Buscar dados do perfil do prestador
  const { data: prestador } = useQuery({
    queryKey: ['prestador-perfil', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;

      const { data, error } = await supabase
        .from('profissionais')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar prestador:', error);
        return null;
      }
      return data;
    },
    enabled: !!user?.email,
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
