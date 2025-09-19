
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const RecuperarSenha = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Enviando email de recuperação...');
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`
      });

      if (error) {
        console.error('Erro ao enviar email:', error);
        toast.error(`Erro: ${error.message}`);
        setLoading(false);
        return;
      }

      console.log('Email de recuperação enviado');
      toast.success('Email de recuperação enviado!');
      setEmailSent(true);
      
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-scale-in text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">E-mail enviado!</h1>
          <p className="text-gray-600 mb-6">
            Enviamos um link de recuperação para <strong>{email}</strong>. 
            Verifique sua caixa de entrada e spam.
          </p>
          <Button asChild className="btn-primary w-full">
            <Link to="/login">Voltar ao Login</Link>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recuperar senha</h1>
          <p className="text-gray-600">Digite seu e-mail para receber um link de recuperação</p>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
                required
                disabled={loading}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="btn-primary w-full text-lg py-4"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Enviando...
              </div>
            ) : (
              'Enviar link de recuperação'
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

export default RecuperarSenha;
