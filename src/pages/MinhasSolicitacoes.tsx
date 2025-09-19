import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, MapPin, Clock, DollarSign, Calendar, FileText, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';

const MinhasSolicitacoes = () => {
  const { user } = useDashboardData();
  const { toast } = useToast();

  const { data: solicitacoes = [], isLoading, refetch } = useQuery({
    queryKey: ['minhas-solicitacoes', user?.id],
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

  const excluirSolicitacao = async (id: string) => {
    try {
      const { error } = await supabase
        .from('solicitacoes_orcamento')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Solicitação excluída!",
        description: "A solicitação foi removida com sucesso.",
      });

      refetch();
    } catch (error) {
      console.error('Erro ao excluir solicitação:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a solicitação.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa':
        return 'bg-green-100 text-green-800';
      case 'em_andamento':
        return 'bg-blue-100 text-blue-800';
      case 'finalizada':
        return 'bg-gray-100 text-gray-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativa':
        return 'Ativa';
      case 'em_andamento':
        return 'Em Andamento';
      case 'finalizada':
        return 'Finalizada';
      case 'cancelada':
        return 'Cancelada';
      default:
        return 'Desconhecido';
    }
  };

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'alta':
        return 'text-red-600';
      case 'media':
        return 'text-yellow-600';
      case 'baixa':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getUrgenciaText = (urgencia: string) => {
    switch (urgencia) {
      case 'alta':
        return 'Urgente';
      case 'media':
        return 'Média';
      case 'baixa':
        return 'Baixa';
      default:
        return 'Não definida';
    }
  };

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h2>
            <p className="text-gray-600 mb-4">Você precisa estar logado para ver suas solicitações.</p>
            <Link to="/login">
              <Button>Fazer Login</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <Link to="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Minhas Solicitações</h1>
            <p className="text-gray-600 mt-2">Acompanhe o status das suas solicitações de orçamento</p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Actions */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Total: {solicitacoes.length} solicitações
              </h2>
              <Link to="/solicitar-orcamento">
                <Button className="btn-primary">
                  <FileText className="h-4 w-4 mr-2" />
                  Nova Solicitação
                </Button>
              </Link>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && solicitacoes.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhuma solicitação encontrada
                </h3>
                <p className="text-gray-600 mb-6">
                  Você ainda não fez nenhuma solicitação de orçamento.
                </p>
                <Link to="/solicitar-orcamento">
                  <Button className="btn-primary">
                    Criar Primeira Solicitação
                  </Button>
                </Link>
              </div>
            )}

            {/* Solicitações List */}
            {!isLoading && solicitacoes.length > 0 && (
              <div className="grid gap-6">
                {solicitacoes.map((solicitacao) => (
                  <Card key={solicitacao.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{solicitacao.titulo}</CardTitle>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(solicitacao.created_at).toLocaleDateString('pt-BR')}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {solicitacao.cidade}, {solicitacao.uf}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(solicitacao.status)}>
                            {getStatusText(solicitacao.status)}
                          </Badge>
                          <Badge variant="outline" className={getUrgenciaColor(solicitacao.urgencia)}>
                            <Clock className="h-3 w-3 mr-1" />
                            {getUrgenciaText(solicitacao.urgencia)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4 line-clamp-2">
                        {solicitacao.descricao}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-gray-900">Endereço</div>
                          <div className="text-gray-600">{solicitacao.endereco}</div>
                        </div>
                        
                        {solicitacao.orcamento_estimado && (
                          <div>
                            <div className="font-medium text-gray-900 flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              Orçamento Estimado
                            </div>
                            <div className="text-gray-600">
                              {solicitacao.orcamento_estimado === 'ate-100' && 'Até R$ 100'}
                              {solicitacao.orcamento_estimado === '100-300' && 'R$ 100 - R$ 300'}
                              {solicitacao.orcamento_estimado === '300-500' && 'R$ 300 - R$ 500'}
                              {solicitacao.orcamento_estimado === '500-1000' && 'R$ 500 - R$ 1.000'}
                              {solicitacao.orcamento_estimado === '1000-plus' && 'Acima de R$ 1.000'}
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <div className="font-medium text-gray-900">Max. Propostas</div>
                          <div className="text-gray-600">{solicitacao.max_propostas}</div>
                        </div>
                      </div>

                      <div className="flex justify-end mt-4 gap-2">
                        <Link to={`/solicitacao/${solicitacao.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </Link>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta solicitação? Esta ação não pode ser desfeita.
                                Todas as propostas relacionadas também serão removidas.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => excluirSolicitacao(solicitacao.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MinhasSolicitacoes;
