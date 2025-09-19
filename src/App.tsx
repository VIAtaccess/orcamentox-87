import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import RecuperarSenha from "./pages/RecuperarSenha";
import RedefinirSenha from "./pages/RedefinirSenha";
import SolicitarOrcamento from "./pages/SolicitarOrcamento";
import Dashboard from "./pages/Dashboard";
import DashboardPrestador from "./pages/DashboardPrestador";
import Perfil from "./pages/Perfil";
import PerfilPrestador from "./pages/PerfilPrestador";
import MinhasSolicitacoes from "./pages/MinhasSolicitacoes";
import SolicitacaoDetalhes from "./pages/SolicitacaoDetalhes";
import Favoritos from "./pages/Favoritos";
import Prestadores from "./pages/Prestadores";
import PrestadorPerfilPublico from "./pages/PrestadorPerfilPublico";
import Categorias from "./pages/Categorias";
import ComoFunciona from "./pages/ComoFunciona";
import Planos from "./pages/Planos";
import Pagamento from "./pages/Pagamento";
import TermosUso from "./pages/TermosUso";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import NotFound from "./pages/NotFound";
import MinhasPropostas from "./pages/MinhasPropostas";
import Orcamentos from "./pages/Orcamentos";
import OrcamentoDetalhes from "./pages/OrcamentoDetalhes";
import Avaliacoes from "./pages/Avaliacoes";
import Admin from "./pages/Admin";
import ScrollToTop from "./components/ScrollToTop";
import usePageTracking from "./hooks/usePageTracking";

const queryClient = new QueryClient();

const AppContent = () => {
  usePageTracking();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/cadastro-prestador" element={<Cadastro />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      <Route path="/redefinir-senha" element={<RedefinirSenha />} />
      <Route path="/solicitar-orcamento" element={<SolicitarOrcamento />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard-prestador" element={<DashboardPrestador />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/perfil-prestador" element={<PerfilPrestador />} />
      <Route path="/minhas-solicitacoes" element={<MinhasSolicitacoes />} />
      <Route path="/solicitacao/:id" element={<SolicitacaoDetalhes />} />
      <Route path="/favoritos" element={<Favoritos />} />
      <Route path="/prestadores" element={<Prestadores />} />
      <Route path="/prestador/:id" element={<PrestadorPerfilPublico />} />
      <Route path="/:cidade/:categoria/:id" element={<PrestadorPerfilPublico />} />
      <Route path="/categorias" element={<Categorias />} />
      <Route path="/como-funciona" element={<ComoFunciona />} />
      <Route path="/planos" element={<Planos />} />
      <Route path="/pagamento/:planoId" element={<Pagamento />} />
      <Route path="/termos" element={<TermosUso />} />
      <Route path="/privacidade" element={<PoliticaPrivacidade />} />
      <Route path="/minhas-propostas" element={<MinhasPropostas />} />
      <Route path="/orcamentos" element={<Orcamentos />} />
      <Route path="/orcamento/:id" element={<OrcamentoDetalhes />} />
      <Route path="/avaliacoes" element={<Avaliacoes />} />
      <Route path="/admin" element={<Admin />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
