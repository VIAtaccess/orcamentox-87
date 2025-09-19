
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Lock, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const RedefinirSenha = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se temos o token de acesso na URL
    const token = searchParams.get('access_token');
    const type = searchParams.get('type');
    
    if (token && type === 'recovery') {
      setAccessToken(token);
    } else {
      toast.error('Link de recuperação inválido ou expirado');
      navigate('/recuperar-senha');
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessToken) {
      toast.error('Token de acesso não encontrado');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Redefinindo senha...');
      
      // Atualizar a senha do usuário
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Erro ao redefinir senha:', error);
        toast.error(`Erro: ${error.message}`);
        setLoading(false);
        return;
      }

      console.log('Senha redefinida com sucesso');
      toast.success('Senha redefinida com sucesso!');
      setSuccess(true);
      
      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-scale-in text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Senha redefinida!</h1>
          <p className="text-gray-600 mb-6">
            Sua senha foi alterada com sucesso. Você será redirecionado para o login em alguns segundos.
          </p>
          <Button asChild className="btn-primary w-full">
            <Link to="/login">Ir para Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/login" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao login
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Redefinir senha</h1>
          <p className="text-gray-600">Digite sua nova senha</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nova senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
                required
                disabled={loading}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirmar nova senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua nova senha"
                className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
                required
                disabled={loading}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Requisitos da senha:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className={`flex items-center ${password.length >= 6 ? 'text-green-600' : ''}`}>
                <span className="mr-2">{password.length >= 6 ? '✓' : '•'}</span>
                Mínimo de 6 caracteres
              </li>
              <li className={`flex items-center ${password === confirmPassword && password.length > 0 ? 'text-green-600' : ''}`}>
                <span className="mr-2">{password === confirmPassword && password.length > 0 ? '✓' : '•'}</span>
                Senhas coincidem
              </li>
            </ul>
          </div>

          <Button 
            type="submit" 
            className="btn-primary w-full text-lg py-4"
            disabled={loading || password !== confirmPassword || password.length < 6}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Redefinindo...
              </div>
            ) : (
              'Redefinir senha'
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Lembrou sua senha?{' '}
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RedefinirSenha;
