
import { Button } from "@/components/ui/button";
import { User, Star, Phone, Heart } from 'lucide-react';

interface PropostasListProps {
  userType: 'cliente' | 'prestador';
  propostas: any[];
  isLoading: boolean;
}

export const PropostasList = ({ userType, propostas, isLoading }: PropostasListProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-6 w-48"></div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded mb-1 w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {userType === 'cliente' ? 'Propostas Recebidas' : 'Propostas Enviadas'}
      </h2>

      <div className="space-y-4">
        {propostas?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma proposta encontrada</p>
          </div>
        ) : (
          propostas?.map((proposta) => (
            <div key={proposta.id} className="border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {userType === 'cliente' 
                        ? proposta.profissionais?.nome || 'Prestador'
                        : proposta.clientes?.nome || 'Cliente'
                      }
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{proposta.profissionais?.nota_media || 0}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Valor</p>
                    <p className="font-bold text-gray-900">
                      {proposta.valor_proposto ? `R$ ${proposta.valor_proposto}` : 'A combinar'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Prazo</p>
                    <p className="font-bold text-gray-900">{proposta.prazo_estimado || 'A definir'}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {userType === 'cliente' ? (
                      <>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-1" />
                          Contato
                        </Button>
                        <Button size="sm">
                          <Heart className="h-4 w-4 mr-1" />
                          Aceitar
                        </Button>
                      </>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        proposta.status === 'aceita' ? 'bg-green-100 text-green-700' :
                        proposta.status === 'rejeitada' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {proposta.status === 'aceita' ? 'Aceita' :
                         proposta.status === 'rejeitada' ? 'Rejeitada' : 'Pendente'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
