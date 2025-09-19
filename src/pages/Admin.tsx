import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminClientes } from "@/components/admin/crud/AdminClientes";
import { AdminProfissionais } from "@/components/admin/crud/AdminProfissionais";
import { AdminSolicitacoes } from "@/components/admin/crud/AdminSolicitacoes";
import { AdminAcessos } from "@/components/admin/crud/AdminAcessos";
import { AdminCategorias } from "@/components/admin/crud/AdminCategorias";
import { AdminSubcategorias } from "@/components/admin/crud/AdminSubcategorias";
import { AdminPropostas } from "@/components/admin/crud/AdminPropostas";
import { AdminAvaliacoes } from "@/components/admin/crud/AdminAvaliacoes";
import { AdminPlanos } from "@/components/admin/crud/AdminPlanos";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        setLoading(true);
        
        // Primeiro, verificar se o usuário está logado
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.log('Usuário não logado, redirecionando para login');
          toast({
            title: "Acesso negado",
            description: "Você precisa estar logado para acessar o painel administrativo.",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }

        console.log('Usuário logado:', user.email);

        // Verificar se o usuário tem permissão de admin na tabela profissionais
        const { data: profissionais, error: profError } = await supabase
          .from('profissionais')
          .select('admin, nome')
          .eq('email', user.email);

        console.log('Dados do profissional:', profissionais, 'Erro:', profError);

        if (profError) {
          console.error('Erro ao verificar permissão de admin:', profError);
          toast({
            title: "Erro de acesso",
            description: "Erro ao verificar permissões de administrador.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        const profissional = profissionais?.[0];

        if (!profissional) {
          console.log('Profissional não encontrado');
          toast({
            title: "Acesso negado",
            description: "Você não está cadastrado como profissional.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        if (!profissional.admin) {
          console.log('Usuário não tem permissão de admin');
          toast({
            title: "Acesso negado", 
            description: "Você não tem permissão para acessar o painel administrativo.",
            variant: "destructive",
          });
          navigate('/dashboard-prestador');
          return;
        }

        console.log('Usuário autorizado como admin:', profissional.nome);
        setIsAuthorized(true);
      } catch (error) {
        console.error('Erro ao verificar acesso admin:', error);
        toast({
          title: "Erro interno",
          description: "Erro ao verificar permissões. Tente novamente.",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [navigate, toast]);

  // Verificar mudanças na sessão
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'acessos':
        return <AdminAcessos />;
      case 'categorias':
        return <AdminCategorias />;
      case 'subcategorias':
        return <AdminSubcategorias />;
      case 'clientes':
        return <AdminClientes />;
      case 'profissionais':
        return <AdminProfissionais />;
      case 'solicitacoes':
        return <AdminSolicitacoes />;
      case 'propostas':
        return <AdminPropostas />;
      case 'avaliacoes':
        return <AdminAvaliacoes />;
      case 'planos':
        return <AdminPlanos />;
      default:
        return <AdminDashboard />;
    }
  };

  // Mostrar loading enquanto verifica permissões
  if (loading || isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões de acesso...</p>
        </div>
      </div>
    );
  }

  // Se não autorizado, não renderizar nada (já foi redirecionado)
  if (!isAuthorized) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b px-6 py-4 flex items-center gap-4 md:hidden">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Admin Panel</h1>
          </div>
          <AdminHeader />
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;