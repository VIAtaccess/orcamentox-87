import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, MapPin, Clock, DollarSign, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import PropostaModal from "@/components/PropostaModal";

const OrcamentoDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [showPropostaModal, setShowPropostaModal] = useState(false);

  // Auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // SEO
  useEffect(() => {
    document.title = "Detalhes do Orçamento | Prestador";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Visualize os detalhes do orçamento e envie sua proposta.");
    else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = "Visualize os detalhes do orçamento e envie sua proposta.";
      document.head.appendChild(m);
    }
  }, []);

  const { data: orcamento, isLoading, error } = useQuery({
    queryKey: ['orcamento-detalhes', id],
    queryFn: async () => {
      if (!id) throw new Error('ID do orçamento não fornecido');
      
      const { data, error } = await supabase
        .from('solicitacoes_orcamento')
        .select(`
          *,
          categoria:categories!inner(name, slug),
          subcategoria:subcategories(name, slug)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const handleEnviarProposta = () => {
    if (!user) {
      // Redirecionar para login se não estiver logado
      navigate('/login');
      return;
    }
    
    // Abrir modal de proposta se estiver logado
    setShowPropostaModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Carregando detalhes do orçamento...</div>
      </div>
    );
  }

  if (error || !orcamento) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Orçamento não encontrado</h2>
          <p className="text-gray-600 mb-4">Este orçamento pode ter sido removido ou não existe.</p>
          <Button onClick={() => navigate('/orcamentos')}>
            Ver Outros Orçamentos
          </Button>
        </div>
      </div>
    );
  }

  const getUrgenciaStyle = (urgencia: string) => {
    switch (urgencia) {
      case 'alta':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getUrgenciaText = (urgencia: string) => {
    switch (urgencia) {
      case 'alta':
        return 'Urgente';
      case 'media':
        return 'Moderado';
      default:
        return 'Baixa Prioridade';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/orcamentos')} 
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {orcamento.titulo}
          </h1>
          <p className="text-gray-600 mt-1">
            Detalhes completos do orçamento solicitado
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna principal - Detalhes */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">Descrição do Serviço</CardTitle>
                  <Badge 
                    variant="outline" 
                    className={getUrgenciaStyle(orcamento.urgencia)}
                  >
                    {getUrgenciaText(orcamento.urgencia)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  {orcamento.descricao}
                </p>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Criado em {new Date(orcamento.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {orcamento.cidade} - {orcamento.uf}
                    </span>
                  </div>
                  {orcamento.orcamento_estimado && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Orçamento estimado: {orcamento.orcamento_estimado}
                      </span>
                    </div>
                  )}
                  {orcamento.prazo_resposta && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Prazo até: {new Date(orcamento.prazo_resposta).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {orcamento.endereco && (
              <Card>
                <CardHeader>
                  <CardTitle>Localização</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{orcamento.endereco}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Categoria e Ação */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary" className="text-sm">
                    {orcamento.categoria?.name}
                  </Badge>
                  {orcamento.subcategoria && (
                    <div>
                      <span className="text-sm text-gray-600">
                        Subcategoria: {orcamento.subcategoria.name}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enviar Proposta</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Interessado neste projeto? Envie sua proposta com valores e prazos.
                </p>
                <Button 
                  onClick={handleEnviarProposta}
                  className="w-full"
                  size="lg"
                >
                  Enviar Proposta
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações Importantes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Status:</span>
                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">
                    {orcamento.status === 'ativa' ? 'Ativo' : orcamento.status}
                  </Badge>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Máximo de propostas:</span>
                  <span className="ml-2 text-gray-600">{orcamento.max_propostas}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Proposta */}
      {user && orcamento && (
        <PropostaModal
          open={showPropostaModal}
          onClose={() => setShowPropostaModal(false)}
          orcamento={orcamento}
          prestadorId={user.id}
        />
      )}
    </div>
  );
};

export default OrcamentoDetalhes;