import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      // Buscar estatísticas de todas as tabelas
      const [
        clientesData,
        profissionaisData,
        solicitacoesData,
        propostasData,
        avaliacoesData,
        favoritosData,
        planosData,
        acessosData
      ] = await Promise.all([
        supabase.from("clientes").select("id, created_at").order("created_at", { ascending: false }),
        supabase.from("profissionais").select("id, nome, categoria_slug, created_at").order("created_at", { ascending: false }),
        supabase.from("solicitacoes_orcamento").select("id, status, created_at").order("created_at", { ascending: false }),
        supabase.from("propostas").select("id, status, created_at").order("created_at", { ascending: false }),
        supabase.from("avaliacoes").select("nota, created_at").order("created_at", { ascending: false }),
        supabase.from("favoritos").select("prestador_id, created_at").order("created_at", { ascending: false }),
        supabase.from("planos").select("id, valor, ativo").eq("ativo", true),
        supabase.from("acessos").select("created_at").order("created_at", { ascending: false })
      ]);

      // Calcular métricas
      const hoje = new Date();
      const umMesAtras = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const clientesNovosMes = clientesData.data?.filter(c => new Date(c.created_at) > umMesAtras).length || 0;
      const profissionaisNovosMes = profissionaisData.data?.filter(p => new Date(p.created_at) > umMesAtras).length || 0;
      const crescimentoPercentual = Math.round(((clientesNovosMes + profissionaisNovosMes) / Math.max(1, (clientesData.data?.length || 0) + (profissionaisData.data?.length || 0))) * 100);

      const solicitacoesAtivas = solicitacoesData.data?.filter(s => s.status === 'ativa').length || 0;
      const propostasAceitas = propostasData.data?.filter(p => p.status === 'aceita').length || 0;
      const taxaConversao = Math.round((propostasAceitas / Math.max(1, propostasData.data?.length || 0)) * 100);

      const notaMedia = avaliacoesData.data?.reduce((acc, av) => acc + (av.nota || 0), 0) / Math.max(1, avaliacoesData.data?.length || 0);
      
      // Contar favoritos por profissional
      const favoritosPorProfissional = favoritosData.data?.reduce((acc: any, fav) => {
        acc[fav.prestador_id] = (acc[fav.prestador_id] || 0) + 1;
        return acc;
      }, {}) || {};

      const topProfissionais = profissionaisData.data?.map(p => ({
        ...p,
        favoritos: favoritosPorProfissional[p.id] || 0
      })).sort((a, b) => b.favoritos - a.favoritos).slice(0, 5) || [];

      const receita = planosData.data?.reduce((acc, plano) => acc + Number(plano.valor || 0), 0) || 0;
      
      const acessosHoje = acessosData.data?.filter(a => 
        new Date(a.created_at).toDateString() === hoje.toDateString()
      ).length || 0;
      
      const acessosMes = acessosData.data?.filter(a => new Date(a.created_at) > umMesAtras).length || 0;

      return {
        total_clientes: clientesData.data?.length || 0,
        total_profissionais: profissionaisData.data?.length || 0,
        crescimento_percentual: crescimentoPercentual,
        total_solicitacoes: solicitacoesData.data?.length || 0,
        solicitacoes_ativas: solicitacoesAtivas,
        total_propostas: propostasData.data?.length || 0,
        taxa_conversao: taxaConversao,
        total_avaliacoes: avaliacoesData.data?.length || 0,
        avaliacao_media: Number(notaMedia.toFixed(1)),
        total_favoritos: favoritosData.data?.length || 0,
        planos_ativos: planosData.data?.length || 0,
        receita_estimada: receita,
        acessos_hoje: acessosHoje,
        acessos_mes: acessosMes,
        top_profissionais: topProfissionais,
        atividades_recentes: [
          { descricao: "Nova solicitação de orçamento", tempo: "há 2 minutos" },
          { descricao: "Profissional cadastrado", tempo: "há 15 minutos" },
          { descricao: "Proposta aceita", tempo: "há 1 hora" }
        ]
      };
    },
    refetchInterval: 30000, // Atualiza a cada 30 segundos
  });
};