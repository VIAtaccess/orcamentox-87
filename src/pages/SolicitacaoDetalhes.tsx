
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar, 
  User,
  Phone,
  Mail,
  AlertCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from "@/components/ui/skeleton";
import Header from '@/components/Header';

const SolicitacaoDetalhes = () => {
  const { id } = useParams();

  const { data: solicitacao, isLoading } = useQuery({
    queryKey: ['solicitacao', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('solicitacoes_orcamento')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar solicitação:', error);
        return null;
      }
      return data;
    },
    enabled: !!id,
  });

  const { data: propostas = [] } = useQuery({
    queryKey: ['propostas', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('propostas')
        .select('*')
        .eq('solicitacao_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar propostas:', error);
        return [];
      }
      return data;
    },
    enabled: !!id,
  });

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

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-8 w-48 mb-6" />
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!solicitacao) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Solicitação não encontrada</h2>
            <p className="text-gray-600 mb-6">A solicitação que você está procurando não existe ou foi removida.</p>
            <Link to="/minhas-solicitacoes">
              <Button>Voltar às Minhas Solicitações</Button>
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
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Link to="/minhas-solicitacoes" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar às Minhas Solicitações
            </Link>

            {/* Header da Solicitação */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{solicitacao.titulo}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Criado em {new Date(solicitacao.created_at).toLocaleDateString('pt-BR')}
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
                <p className="text-gray-700 mb-6">{solicitacao.descricao}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Informações do Serviço</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Endereço:</span>
                        <p className="text-gray-600">{solicitacao.endereco}</p>
                      </div>
                      {solicitacao.orcamento_estimado && (
                        <div>
                          <span className="font-medium flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            Orçamento Estimado:
                          </span>
                          <p className="text-gray-600">
                            {solicitacao.orcamento_estimado === 'ate-100' && 'Até R$ 100'}
                            {solicitacao.orcamento_estimado === '100-300' && 'R$ 100 - R$ 300'}
                            {solicitacao.orcamento_estimado === '300-500' && 'R$ 300 - R$ 500'}
                            {solicitacao.orcamento_estimado === '500-1000' && 'R$ 500 - R$ 1.000'}
                            {solicitacao.orcamento_estimado === '1000-plus' && 'Acima de R$ 1.000'}
                          </p>
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Máximo de Propostas:</span>
                        <p className="text-gray-600">{solicitacao.max_propostas}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Informações de Contato</h4>
                    <div className="space-y-2 text-sm">
                      {solicitacao.nome_cliente && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{solicitacao.nome_cliente}</span>
                        </div>
                      )}
                      {solicitacao.email_cliente && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{solicitacao.email_cliente}</span>
                        </div>
                      )}
                      {solicitacao.whatsapp_cliente && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{solicitacao.whatsapp_cliente}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Propostas Recebidas */}
            <Card>
              <CardHeader>
                <CardTitle>Propostas Recebidas ({propostas.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {propostas.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Nenhuma proposta recebida ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {propostas.map((proposta) => (
                      <Card key={proposta.id} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-semibold text-lg">
                                {proposta.valor_proposto ? 
                                  `R$ ${Number(proposta.valor_proposto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
                                  : 'Valor a combinar'
                                }
                              </p>
                              <p className="text-sm text-gray-600">
                                Recebida em {new Date(proposta.created_at).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                            <Badge variant="outline">
                              {proposta.status === 'enviada' && 'Enviada'}
                              {proposta.status === 'aceita' && 'Aceita'}
                              {proposta.status === 'rejeitada' && 'Rejeitada'}
                            </Badge>
                          </div>
                          <p className="text-gray-700 mb-3">{proposta.descricao_proposta}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            {proposta.prazo_estimado && (
                              <div>
                                <span className="font-medium">Prazo:</span>
                                <p className="text-gray-600">{proposta.prazo_estimado}</p>
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Materiais:</span>
                              <p className="text-gray-600">
                                {proposta.materiais_inclusos ? 'Inclusos' : 'Não inclusos'}
                              </p>
                            </div>
                            {proposta.garantia && (
                              <div>
                                <span className="font-medium">Garantia:</span>
                                <p className="text-gray-600">{proposta.garantia}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default SolicitacaoDetalhes;
