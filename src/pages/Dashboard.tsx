
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  User, 
  FileText, 
  MessageSquare, 
  Star,
  LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useDashboardData } from '@/hooks/useDashboardData';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { SolicitacoesList } from '@/components/dashboard/SolicitacoesList';
import { PropostasList } from '@/components/dashboard/PropostasList';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'cliente' | 'prestador'>('cliente');
  const [profileName, setProfileName] = useState<string>('');

  const { user, solicitacoes, propostas, favoritos, loading, stats } = useDashboardData();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

        // Buscar dados do cliente pelo email, não pelo ID
        const { data: cliente } = await supabase
          .from('clientes')
          .select('nome')
          .eq('email', user.email)
          .maybeSingle();

      if (cliente) {
        setUserType('cliente');
        setProfileName(cliente.nome || '');
        return;
      }

      // Tenta achar como prestador pelo email
      const { data: prestador } = await supabase
        .from('profissionais')
        .select('nome')
        .eq('email', user.email)
        .maybeSingle();

      if (prestador) {
        setUserType('prestador');
        setProfileName(prestador.nome || '');
        // Redirecionar prestador para seu dashboard específico
        navigate('/dashboard-prestador');
        return;
      }
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Dashboard */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Olá, {profileName || (userType === 'cliente' ? 'Cliente' : 'Prestador')}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                {userType === 'cliente' 
                  ? 'Gerencie suas solicitações e propostas recebidas' 
                  : 'Acompanhe seus leads e propostas enviadas'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex items-center" asChild>
                <Link to="/perfil">
                  <User className="h-4 w-4 mr-2" />
                  Perfil
                </Link>
              </Button>
              <Button variant="outline" className="flex items-center" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">
                  {profileName || (userType === 'cliente' ? 'Cliente' : 'Prestador')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {userType === 'cliente' ? 'Cliente' : 'Prestador de Serviço'}
                </p>
              </div>

              <nav className="space-y-2">
                <Link to="/dashboard" className="flex items-center space-x-3 p-3 rounded-xl bg-primary/5 text-primary font-semibold">
                  <FileText className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/minhas-solicitacoes" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700">
                  <MessageSquare className="h-5 w-5" />
                  <span>{userType === 'cliente' ? 'Minhas Solicitações' : 'Meus Leads'}</span>
                </Link>
                <Link to="/favoritos" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700">
                  <Star className="h-5 w-5" />
                  <span>{userType === 'cliente' ? `Favoritos (${favoritos?.length || 0})` : 'Avaliações'}</span>
                </Link>
              </nav>

              {userType === 'cliente' && (
                <div className="mt-6 pt-6 border-t">
                  <Button className="btn-success w-full" asChild>
                    <Link to="/solicitar-orcamento">
                      Nova Solicitação
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Cards */}
            <StatsCards 
              userType={userType} 
              stats={{
                solicitacoes: stats.totalSolicitacoes,
                propostas: stats.totalPropostas,
                concluidos: stats.solicitacoesAbertas,
                avaliacao: 0
              }} 
              isLoading={loading} 
            />

            {/* Solicitações/Leads */}
            <SolicitacoesList 
              userType={userType} 
              solicitacoes={solicitacoes || []} 
              isLoading={loading} 
            />

            {/* Propostas */}
            <PropostasList 
              userType={userType} 
              propostas={propostas || []} 
              isLoading={loading} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
