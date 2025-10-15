
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOrcamentosData = () => {
  const { data: orcamentos = [], isLoading } = useQuery({
    queryKey: ['orcamentos-publicos'],
    queryFn: async () => {
      const { data: orcamentosData, error } = await supabase
        .from('solicitacoes_orcamento')
        .select('*')
        .eq('status', 'ativa')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar orçamentos:', error);
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
      return orcamentosData.map(orcamento => ({
        ...orcamento,
        categoria: categoriasData.data?.find(c => c.id === orcamento.categoria_id),
        subcategoria: subcategoriasData.data?.find(s => s.id === orcamento.subcategoria_id)
      }));
    },
  });

  return {
    orcamentos,
    loading: isLoading
  };
};
