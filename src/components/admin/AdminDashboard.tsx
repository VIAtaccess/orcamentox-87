import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminStats } from "@/hooks/useAdminStats";
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Star, 
  Heart, 
  CreditCard,
  TrendingUp,
  Activity
} from 'lucide-react';

export function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total de Usuários",
      value: (stats?.total_clientes || 0) + (stats?.total_profissionais || 0),
      description: `${stats?.total_clientes || 0} clientes, ${stats?.total_profissionais || 0} profissionais`,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Solicitações Ativas",
      value: stats?.solicitacoes_ativas || 0,
      description: `${stats?.total_solicitacoes || 0} total criadas`,
      icon: FileText,
      color: "text-green-600"
    },
    {
      title: "Propostas Enviadas",
      value: stats?.total_propostas || 0,
      description: `Taxa de conversão: ${stats?.taxa_conversao || 0}%`,
      icon: MessageSquare,
      color: "text-purple-600"
    },
    {
      title: "Avaliação Média",
      value: `${stats?.avaliacao_media || 0}/5`,
      description: `${stats?.total_avaliacoes || 0} avaliações`,
      icon: Star,
      color: "text-yellow-600"
    },
    {
      title: "Favoritos",
      value: stats?.total_favoritos || 0,
      description: "Profissionais salvos",
      icon: Heart,
      color: "text-red-600"
    },
    {
      title: "Planos Ativos",
      value: stats?.planos_ativos || 0,
      description: `R$ ${stats?.receita_estimada || 0} estimada/mês`,
      icon: CreditCard,
      color: "text-indigo-600"
    },
    {
      title: "Acessos Hoje",
      value: stats?.acessos_hoje || 0,
      description: `${stats?.acessos_mes || 0} no mês`,
      icon: Activity,
      color: "text-orange-600"
    },
    {
      title: "Crescimento",
      value: `${stats?.crescimento_percentual || 0}%`,
      description: "Usuários no último mês",
      icon: TrendingUp,
      color: "text-teal-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600">Visão geral da plataforma e métricas estratégicas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas ações na plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.atividades_recentes?.map((atividade: any, index: number) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{atividade.descricao}</p>
                    <p className="text-xs text-gray-500">{atividade.tempo}</p>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-sm">Nenhuma atividade recente</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profissionais Mais Favoritados</CardTitle>
            <CardDescription>Top 5 profissionais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.top_profissionais?.map((profissional: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{profissional.nome}</p>
                    <p className="text-xs text-gray-500">{profissional.categoria}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm">{profissional.favoritos}</span>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-sm">Nenhum dado disponível</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}