
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Tentando fazer login...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        console.error('Erro no login:', error);
        toast.error(`Erro no login: ${error.message}`);
        setLoading(false);
        return;
      }

      console.log('Login realizado com sucesso:', data);
      toast.success('Login realizado com sucesso!');
      
      // Verificar se é um profissional admin
      if (data.user?.email) {
        const { data: profissional } = await supabase
          .from('profissionais')
          .select('admin')
          .eq('email', data.user.email)
          .single();
        
        if (profissional?.admin) {
          // Redirecionar para admin
          setTimeout(() => {
            navigate('/admin');
          }, 1000);
          return;
        }
      }
      
      // Redirecionar para dashboard normal
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta!</h1>
          <p className="text-gray-600">Entre na sua conta para continuar</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="seu@email.com"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Sua senha"
                className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.remember}
                onChange={(e) => setFormData({...formData, remember: e.target.checked})}
                className="rounded border-gray-300 text-primary focus:ring-primary"
                disabled={loading}
              />
              <span className="ml-2 text-sm text-gray-600">Lembrar de mim</span>
            </label>
            <Link to="/recuperar-senha" className="text-sm text-primary hover:underline font-semibold">
              Esqueceu a senha?
            </Link>
          </div>

          <Button 
            type="submit" 
            className="btn-primary w-full text-lg py-4"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Entrando...
              </div>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-gray-500 text-sm">ou</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-600">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="text-primary hover:underline font-semibold">
              Cadastre-se grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
