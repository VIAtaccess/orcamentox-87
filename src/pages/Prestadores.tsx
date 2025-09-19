import React from 'react';
import { Button } from "@/components/ui/button";
import { Star, MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Profissional {
  id: string;
  nome: string;
  descricao?: string | null;
  cidade?: string | null;
  uf?: string | null;
  foto_url?: string | null;
  nota_media?: number | null;
  total_avaliacoes?: number | null;
}

const Prestadores = () => {
  const { data: prestadores = [], isLoading } = useQuery<Profissional[]>({
    queryKey: ['profissionais-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profissionais')
        .select('id, nome, descricao, cidade, uf, foto_url, nota_media, total_avaliacoes')
        .eq('ativo', true)
        .order('nota_media', { ascending: false });
      if (error) {
        console.error('Erro ao buscar profissionais:', error);
        return [];
      }
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Prestadores de Serviço</h1>
          <p className="text-gray-600 mt-2">Encontre profissionais qualificados para seus projetos</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <p className="text-gray-600">Carregando profissionais...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prestadores.map((prestador) => (
              <div key={prestador.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-lg">
                          {prestador.nome?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{prestador.nome}</h3>
                        <p className="text-sm text-gray-600">{prestador.descricao ? prestador.descricao.slice(0, 40) + (prestador.descricao.length > 40 ? '…' : '') : 'Profissional'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-yellow-500 mb-1">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 text-sm font-medium text-gray-900">
                          {prestador.nota_media ?? 0}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {(prestador.total_avaliacoes ?? 0)} avaliações
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {prestador.descricao || 'Sem descrição informada.'}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {prestador.cidade || 'Cidade não informada'}, {prestador.uf || '--'}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link to={`/prestador/${prestador.id}`} className="flex-1 btn-primary text-center">
                      Ver Perfil
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Prestadores;
