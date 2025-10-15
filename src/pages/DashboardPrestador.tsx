import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  FileText, 
  MessageSquare, 
  Star,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { generateFriendlyUrl } from '@/utils/urlUtils';
import { usePrestadorData } from '@/hooks/usePrestadorData';
import { SolicitacoesList } from '@/components/dashboard/SolicitacoesList';
import { PropostasList } from '@/components/dashboard/PropostasList';

const DashboardPrestador = () => {
  const [profileName, setProfileName] = useState<string>('');
  const [prestadorData, setPrestadorData] = useState<any>(null);
  const [stats, setStats] = useState({
    solicitacoesAceitas: 0,
    propostas: 0,
    avaliacaoMedia: 0,
    servicosConcluidos: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Hook para buscar dados do prestador
  const { 
    orcamentosDisponiveis, 
    propostas, 
    loading: loadingPrestadorData 
  } = usePrestadorData();

  useEffect(() => {
    const loadPrestadorData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Buscar dados do prestador pelo email
        const { data: prestador } = await supabase
          .from('profissionais')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();

        if (prestador) {
          setProfileName(prestador.nome || '');
          setPrestadorData(prestador);
          
          // Buscar estatísticas reais
          const [{ count: totalPropostas }, { count: solicitacoesAtendidas }] = await Promise.all([
            supabase
              .from('propostas')
              .select('*', { count: 'exact', head: true })
              .eq('prestador_id', prestador.id),
            supabase
              .from('propostas')
              .select('*', { count: 'exact', head: true })
              .eq('prestador_id', prestador.id)
              .eq('status', 'aceita')
          ]);

          setStats({
            solicitacoesAceitas: solicitacoesAtendidas || 0,
            propostas: totalPropostas || 0,
            avaliacaoMedia: prestador.nota_media || 0,
            servicosConcluidos: solicitacoesAtendidas || 0
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do dashboard.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadPrestadorData();
  }, [toast]);

  const handleViewMyPage = () => {
    if (prestadorData?.cidade && prestadorData?.categoria_slug && prestadorData?.id) {
      const friendlyUrl = generateFriendlyUrl(
        prestadorData.cidade, 
        prestadorData.categoria_slug, 
        prestadorData.id
      );
      window.open(friendlyUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Dashboard */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Olá, {profileName || 'Prestador'}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Gerencie seus leads, propostas e serviços prestados
              </p>
            </div>
            <Button variant="outline" className="flex items-center" asChild>
              <Link to="/perfil-prestador">
                <User className="h-4 w-4 mr-2" />
                Perfil
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden">
                  {/* Aqui deveria ter a foto do prestador */}
                  <User className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">
                  {profileName || 'Prestador'}
                </h3>
                <p className="text-gray-600 text-sm">
                  Prestador de Serviço
                </p>
                <div className="flex items-center justify-center mt-2">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{stats.avaliacaoMedia.toFixed(1)}</span>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleViewMyPage}
                  className="w-full mt-4"
                  disabled={!prestadorData?.cidade || !prestadorData?.categoria_slug}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Minha Página
                </Button>
              </div>

              <nav className="space-y-2">
                <Link to="/dashboard-prestador" className="flex items-center space-x-3 p-3 rounded-xl bg-primary/5 text-primary font-semibold">
                  <FileText className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/orcamentos" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700">
                  <MessageSquare className="h-5 w-5" />
                  <span>Orçamentos</span>
                </Link>
                <Link to="/minhas-propostas" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700">
                  <FileText className="h-5 w-5" />
                  <span>Minhas Propostas</span>
                </Link>
                <Link to="/avaliacoes" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700">
                  <Star className="h-5 w-5" />
                  <span>Avaliações</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Leads Aceitos</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.solicitacoesAceitas}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Propostas Enviadas</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.propostas}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.avaliacaoMedia.toFixed(1)}</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Serviços Concluídos</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.servicosConcluidos}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Componentes reutilizáveis para orçamentos e propostas */}
            <SolicitacoesList 
              userType="prestador" 
              solicitacoes={orcamentosDisponiveis || []} 
              isLoading={loadingPrestadorData} 
            />

            <PropostasList 
              userType="prestador" 
              propostas={propostas || []} 
              isLoading={loadingPrestadorData} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPrestador;