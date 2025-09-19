import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, MapPin, Phone, Mail, CheckCircle, Calendar, Award } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const PrestadorPerfilPublico = () => {
  const { id, cidade, categoria } = useParams();

  const { data: prestador, isLoading } = useQuery({
    queryKey: ['prestador-perfil-publico', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('profissionais')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) {
        console.error('Erro ao carregar prestador:', error);
        return null;
      }
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!prestador) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Link to="/prestadores" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos prestadores
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Profissional não encontrado</h1>
          <p className="text-gray-600 mt-2">Tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Link to="/prestadores" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos prestadores
          </Link>
        </div>

        {/* Profile Content */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          {/* Top Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{prestador.nome}</h1>
              <p className="text-gray-600">{prestador.cidade}{prestador.uf ? ` - ${prestador.uf}` : ''}</p>
            </div>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500 mr-1" />
              <span className="font-semibold text-gray-900">{prestador.nota_media ?? 0}</span>
              <span className="text-gray-500 ml-1">({prestador.total_avaliacoes ?? 0} avaliações)</span>
            </div>
          </div>

          {/* Location and Verification */}
          <div className="flex items-center gap-6 mb-6">
            {prestador.endereco && (
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700">{prestador.endereco}{prestador.cidade ? `, ${prestador.cidade}` : ''}</span>
              </div>
            )}
            {prestador.verificado && (
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-green-500 font-semibold">Perfil Verificado</span>
              </div>
            )}
          </div>

          {/* Galeria de Serviços */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Galeria de Serviços</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(prestador as any)?.imagem_servico_1 && (
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={(prestador as any).imagem_servico_1} 
                    alt="Serviço 1" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              {(prestador as any)?.imagem_servico_2 && (
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={(prestador as any).imagem_servico_2} 
                    alt="Serviço 2" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              {(prestador as any)?.imagem_servico_3 && (
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={(prestador as any).imagem_servico_3} 
                    alt="Serviço 3" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              {/* Placeholders se não houver imagens */}
              {!(prestador as any)?.imagem_servico_1 && (
                <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Imagem em breve</span>
                </div>
              )}
              {!(prestador as any)?.imagem_servico_2 && (
                <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Imagem em breve</span>
                </div>
              )}
              {!(prestador as any)?.imagem_servico_3 && (
                <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Imagem em breve</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {prestador.descricao && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Sobre Mim</h2>
              <p className="text-gray-700">{prestador.descricao}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center text-xl font-bold text-primary mb-1">
                <Award className="h-6 w-6 mr-2" />
                {prestador.total_avaliacoes ?? 0}
              </div>
              <div className="text-gray-600">Total de Avaliações</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center text-xl font-bold text-primary mb-1">
                <Star className="h-6 w-6 mr-2" />
                {prestador.nota_media ?? 0}
              </div>
              <div className="text-gray-600">Avaliação Média</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center text-xl font-bold text-primary mb-1">
                <Calendar className="h-6 w-6 mr-2" />
                {prestador.created_at ? new Date(prestador.created_at).toLocaleDateString() : '--'}
              </div>
              <div className="text-gray-600">Na plataforma desde</div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-primary to-primary-glow rounded-2xl p-6 text-center text-white">
            <h3 className="text-xl font-bold mb-2">Gostou do trabalho deste profissional?</h3>
            <p className="text-white/90 mb-4">
              Solicite um orçamento personalizado e gratuito para seu projeto. 
              É rápido, fácil e sem compromisso!
            </p>
            <Link 
              to="/solicitar-orcamento" 
              className="inline-block bg-white text-primary hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Solicitar Orçamento Grátis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrestadorPerfilPublico;
