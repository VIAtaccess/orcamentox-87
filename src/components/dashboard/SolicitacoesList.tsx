
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SolicitacoesListProps {
  userType: 'cliente' | 'prestador';
  solicitacoes: any[];
  isLoading: boolean;
}

export const SolicitacoesList = ({ userType, solicitacoes, isLoading }: SolicitacoesListProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-6 w-48"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-2xl p-6">
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {userType === 'cliente' ? 'Minhas Solicitações' : 'Leads Recentes'}
        </h2>
        <Button variant="outline" asChild>
          <Link to={userType === 'cliente' ? '/minhas-solicitacoes' : '/prestadores'}>
            {userType === 'cliente' ? 'Ver Todas' : 'Ver Todos'}
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {solicitacoes?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma solicitação encontrada</p>
            {userType === 'cliente' && (
              <Button className="mt-4" asChild>
                <Link to="/solicitar-orcamento">
                  Criar primeira solicitação
                </Link>
              </Button>
            )}
          </div>
        ) : (
          solicitacoes?.map((solicitacao) => (
            <div key={solicitacao.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-bold text-gray-900">{solicitacao.titulo}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      solicitacao.urgencia === 'alta' ? 'bg-red-100 text-red-700' :
                      solicitacao.urgencia === 'media' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {solicitacao.urgencia === 'alta' ? 'Urgente' :
                       solicitacao.urgencia === 'media' ? 'Moderado' : 'Baixa Prioridade'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{solicitacao.categories?.name || solicitacao.categoria}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(solicitacao.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {solicitacao.propostas?.length || 0} propostas
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {userType === 'cliente' ? (
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/minhas-solicitacoes">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Propostas
                      </Link>
                    </Button>
                  ) : (
                    <Button className="btn-primary" size="sm">
                      Enviar Proposta
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
