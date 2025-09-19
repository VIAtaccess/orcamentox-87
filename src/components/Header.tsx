import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, Calculator, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import logoHorizontal from '@/assets/logo-horizontal.png';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  useEffect(() => {
    let mounted = true;
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setIsLogged(!!session);
    });
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      if (mounted) setIsLogged(!!session);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };
  return <header className="bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group -ml-4">
            <img src={logoHorizontal} alt="OrçamentoX" className="h-40 group-hover:scale-105 transition-all duration-200" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/categorias" className="nav-link">
              Categorias
            </Link>
            <Link to="/prestadores" className="nav-link">
              Prestadores
            </Link>
            <Link to="/planos" className="nav-link">
              Planos
            </Link>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {isLogged ? <>
                <Button variant="ghost" className="font-medium text-gray-700 hover:text-primary" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="outline" onClick={handleLogout}>Sair</Button>
              </> : <>
                <Button variant="ghost" className="font-medium text-gray-700 hover:text-primary" asChild>
                  <Link to="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Entrar
                  </Link>
                </Button>
                <Button className="btn-success" asChild>
                  <Link to="/solicitar-orcamento">Solicitar Orçamento</Link>
                </Button>
              </>}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-lg">
          <div className="container mx-auto px-4 py-6 space-y-4">
            <nav className="space-y-3">
              <Link to="/categorias" className="block py-3 text-gray-700 hover:text-primary font-medium transition-colors border-b border-gray-100">
                Categorias
              </Link>
              <Link to="/prestadores" className="block py-3 text-gray-700 hover:text-primary font-medium transition-colors border-b border-gray-100">
                Prestadores
              </Link>
              <Link to="/planos" className="block py-3 text-gray-700 hover:text-primary font-medium transition-colors border-b border-gray-100">
                Planos
              </Link>
            </nav>
            
            <div className="space-y-3 pt-4">
              {isLogged ? <>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                  <Button className="w-full" variant="destructive" onClick={handleLogout}>
                    Sair
                  </Button>
                </> : <>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Entrar
                    </Link>
                  </Button>
                  <Button className="btn-success w-full" asChild>
                    <Link to="/solicitar-orcamento">Solicitar Orçamento</Link>
                  </Button>
                </>}
            </div>
          </div>
        </div>}
    </header>;
};
export default Header;