
import { FileText, MessageSquare, TrendingUp, Star } from 'lucide-react';

interface StatsCardsProps {
  userType: 'cliente' | 'prestador';
  stats: {
    solicitacoes: number;
    propostas: number;
    concluidos: number | string;
    avaliacao: number;
  };
  isLoading: boolean;
}

export const StatsCards = ({ userType, stats, isLoading }: StatsCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">
              {userType === 'cliente' ? 'Solicitações' : 'Leads Recebidos'}
            </p>
            <p className="text-2xl font-bold text-gray-900">{stats.solicitacoes}</p>
          </div>
          <FileText className="h-8 w-8 text-primary" />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">
              {userType === 'cliente' ? 'Propostas' : 'Propostas Enviadas'}
            </p>
            <p className="text-2xl font-bold text-gray-900">{stats.propostas}</p>
          </div>
          <MessageSquare className="h-8 w-8 text-success" />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">
              {userType === 'cliente' ? 'Concluídos' : 'Taxa de Conversão'}
            </p>
            <p className="text-2xl font-bold text-gray-900">{stats.concluidos}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-warning" />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Avaliação</p>
            <p className="text-2xl font-bold text-gray-900">{stats.avaliacao}</p>
          </div>
          <Star className="h-8 w-8 text-yellow-500" />
        </div>
      </div>
    </div>
  );
};
