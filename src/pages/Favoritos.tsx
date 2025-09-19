
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Phone, 
  Mail,
  Heart,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';

const Favoritos = () => {
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: favoritos = [], isLoading, refetch } = useQuery({
    queryKey: ['favoritos', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('favoritos')
        .select(`
          *,
          prestador:profissionais!favoritos_prestador_id_fkey(*)
        `)
        .eq('cliente_id', user.id);

      if (error) {
        console.error('Erro ao buscar favoritos:', error);
        return [];
      }
      return data;
    },
    enabled: !!user?.id,
  });

  const removerFavorito = async (favoritoId: string) => {
    try {
      const { error } = await supabase
        .from('favoritos')
        .delete()
        .eq('id', favoritoId);

      if (error) throw error;

      toast({
        title: "Favorito removido!",
        description: "O prestador foi removido dos seus favoritos.",
      });

      refetch();
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      toast({
        title: "Erro ao remover favorito",
        description: "Não foi possível remover o prestador dos favoritos.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h2>
            <p className="text-gray-600 mb-4">Você precisa estar logado para ver seus favoritos.</p>
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
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Link to="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Dashboard
            </Link>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Meus Favoritos</h1>
              <p className="text-gray-600 mt-2">Prestadores de serviço que você favoritou</p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            {!isLoading && favoritos.length === 0 && (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum favorito ainda
                </h3>
                <p className="text-gray-600 mb-6">
                  Você ainda não favoritou nenhum prestador de serviço.
                </p>
                <Link to="/prestadores">
                  <Button className="btn-primary">
                    Explorar Prestadores
                  </Button>
                </Link>
              </div>
            )}

            {/* Favoritos Grid */}
            {!isLoading && favoritos.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {favoritos.map((favorito) => (
                  <Card key={favorito.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{favorito.prestador?.nome}</CardTitle>
                          <p className="text-gray-600 text-sm">{favorito.prestador?.categoria}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {favorito.prestador?.cidade}, {favorito.prestador?.uf}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removerFavorito(favorito.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {favorito.prestador?.descricao && (
                        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                          {favorito.prestador.descricao}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 mb-4">
                        {favorito.prestador?.nota_media && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="ml-1 text-sm font-medium">
                              {Number(favorito.prestador.nota_media).toFixed(1)}
                            </span>
                          </div>
                        )}
                        {favorito.prestador?.verificado && (
                          <Badge variant="secondary" className="text-xs">
                            Verificado
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        {favorito.prestador?.email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            <span className="truncate">{favorito.prestador.email}</span>
                          </div>
                        )}
                        {favorito.prestador?.whatsapp && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            <span>{favorito.prestador.whatsapp}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Link to={`/prestador/${favorito.prestador?.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Ver Perfil
                          </Button>
                        </Link>
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

export default Favoritos;
