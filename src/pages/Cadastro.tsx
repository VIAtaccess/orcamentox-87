import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Building, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBrazilLocations } from '@/hooks/use-brazil-locations';
import { usePhoneMask } from '@/hooks/usePhoneMask';
import { useCnpjMask } from '@/hooks/useCnpjMask';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import CategorySelector from '@/components/CategorySelector';

const Cadastro = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    whatsapp: '',
    uf: '',
    cidade: '',
    tipo_pessoa: '',
    cpf_cnpj: '',
    endereco: '',
    descricao: '',
    categoria_slug: '',
    subcategoria_slug: '',
    aceita_termos: false
  });

  const { states, cities, loadingStates, loadingCities, fetchCities } = useBrazilLocations();
  const phoneMask = usePhoneMask(formData.whatsapp);
  const cnpjMask = useCnpjMask(formData.cpf_cnpj);

  useEffect(() => {
    if (formData.uf) {
      fetchCities(formData.uf);
      setFormData((prev) => ({ ...prev, cidade: '' }));
    }
  }, [formData.uf]);

  const handleNext = () => {
    if (step < 3) {
      setLoading(true);
      setTimeout(() => {
        setStep(step + 1);
        setLoading(false);
      }, 500);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = phoneMask.handleChange(e.target.value);
    setFormData({...formData, whatsapp: formatted});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      console.log('Iniciando cadastro...');
      
      // Validações
      if (formData.password !== formData.confirmPassword) {
        toast.error('As senhas não coincidem');
        setSubmitting(false);
        return;
      }

      if (formData.password.length < 6) {
        toast.error('A senha deve ter pelo menos 6 caracteres');
        setSubmitting(false);
        return;
      }

      // Criar conta no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nome: formData.nome,
            tipo_usuario: userType,
            whatsapp: phoneMask.getUnmaskedValue(),
            uf: formData.uf,
            cidade: formData.cidade
          }
        }
      });

      if (authError) {
        console.error('Erro no cadastro:', authError);
        toast.error(`Erro no cadastro: ${authError.message}`);
        setSubmitting(false);
        return;
      }

      console.log('Usuário criado no Auth:', authData);

      // Inserir dados na tabela apropriada (clientes ou profissionais)
      if (userType === 'cliente') {
        const { error: clienteError } = await supabase
          .from('clientes')
          .insert({
            id: authData.user?.id,
            nome: formData.nome,
            email: formData.email,
            whatsapp: phoneMask.getUnmaskedValue(),
            uf: formData.uf,
            cidade: formData.cidade,
            endereco: formData.endereco,
            aceita_marketing: false,
            ativo: true
          });

        if (clienteError) {
          console.error('Erro ao inserir cliente:', clienteError);
          toast.error('Erro ao criar perfil de cliente');
          setSubmitting(false);
          return;
        }
        console.log('Cliente inserido na tabela clientes');
      } else if (userType === 'prestador') {
        // Assumindo que existe uma tabela 'profissionais' baseada no schema
        const { error: profissionalError } = await supabase
          .from('profissionais')
          .insert({
            id: authData.user?.id,
            nome: formData.nome,
            email: formData.email,
            whatsapp: phoneMask.getUnmaskedValue(),
            uf: formData.uf,
            cidade: formData.cidade,
    cnpj: cnpjMask.getUnmaskedValue(),
            endereco: formData.endereco,
            descricao: formData.descricao,
            categoria_slug: formData.categoria_slug,
            subcategoria_slug: formData.subcategoria_slug,
            ativo: true
          });

        if (profissionalError) {
          console.error('Erro ao inserir profissional:', profissionalError);
          toast.error('Erro ao criar perfil de prestador');
          setSubmitting(false);
          return;
        }
        console.log('Profissional inserido na tabela profissionais');
      }

      console.log('Cadastro realizado com sucesso:', authData);
      toast.success('Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.');
      
      // Redirecionar para login
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar conta</h1>
          <p className="text-gray-600">Junte-se a milhares de usuários satisfeitos</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center mb-8">
          {[1, 2, 3].map((i) => (
            <React.Fragment key={i}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i <= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {loading && i === step + 1 ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                ) : (
                  i
                )}
              </div>
              {i < 3 && (
                <div className={`flex-1 h-2 mx-2 rounded ${
                  i < step ? 'bg-primary' : 'bg-gray-200'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Tipo de usuário */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Como você pretende usar a plataforma?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setUserType('cliente')}
                    className={`p-6 border-2 rounded-xl text-left transition-all ${
                      userType === 'cliente' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    disabled={loading}
                  >
                    <User className="h-8 w-8 text-primary mb-3" />
                    <h4 className="font-bold text-gray-900 mb-2">Sou Cliente</h4>
                    <p className="text-gray-600 text-sm">Preciso contratar serviços e receber orçamentos</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setUserType('prestador')}
                    className={`p-6 border-2 rounded-xl text-left transition-all ${
                      userType === 'prestador' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    disabled={loading}
                  >
                    <Building className="h-8 w-8 text-primary mb-3" />
                    <h4 className="font-bold text-gray-900 mb-2">Sou Prestador</h4>
                    <p className="text-gray-600 text-sm">Ofereço serviços e quero receber leads</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Dados básicos */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Dados básicos</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Seu nome completo"
                    className="input-modern"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="seu@email.com"
                    className="input-modern"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Senha *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Mínimo 6 caracteres"
                    className="input-modern"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmar senha *
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Confirme sua senha"
                    className="input-modern"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={handlePhoneChange}
                    placeholder="(11) 99999-9999"
                    className="input-modern"
                    required
                    disabled={loading}
                    maxLength={15}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Estado *
                  </label>
                  <Select 
                    value={formData.uf} 
                    onValueChange={(val) => setFormData({ ...formData, uf: val })}
                    disabled={loading || loadingStates}
                  >
                    <SelectTrigger className="input-modern">
                      <SelectValue placeholder={loadingStates ? 'Carregando estados...' : 'Selecione o estado'} />
                    </SelectTrigger>
                    <SelectContent className="z-[60] bg-white dark:bg-gray-800">
                      {states.map((uf) => (
                        <SelectItem key={uf.sigla} value={uf.sigla}>{uf.nome} ({uf.sigla})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cidade *
                  </label>
                  <Select 
                    value={formData.cidade} 
                    onValueChange={(val) => setFormData({ ...formData, cidade: val })} 
                    disabled={!formData.uf || loadingCities || loading}
                  >
                    <SelectTrigger className="input-modern">
                      <SelectValue placeholder={!formData.uf ? 'Selecione o estado primeiro' : (loadingCities ? 'Carregando cidades...' : 'Selecione a cidade')} />
                    </SelectTrigger>
                    <SelectContent className="z-[60] bg-white dark:bg-gray-800">
                      {cities.map((c) => (
                        <SelectItem key={c.id} value={c.nome}>{c.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {userType === 'prestador' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CNPJ *
                    </label>
                    <input
                      type="text"
                      value={formData.cpf_cnpj}
                      onChange={(e) => setFormData({ ...formData, cpf_cnpj: cnpjMask.handleChange(e.target.value) })}
                      placeholder="00.000.000/0000-00"
                      className="input-modern"
                      required
                      disabled={loading}
                      maxLength={18}
                    />
                    <p className="text-xs text-gray-500 mt-1">Obrigatório para prestadores de serviço</p>
                  </div>
                  
                  <div>
                    <CategorySelector
                      selectedCategory={formData.categoria_slug}
                      selectedSubcategory={formData.subcategoria_slug}
                      onCategoryChange={(categorySlug) => setFormData(prev => ({ ...prev, categoria_slug: categorySlug }))}
                      onSubcategoryChange={(subcategorySlug) => setFormData(prev => ({ ...prev, subcategoria_slug: subcategorySlug }))}
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-1">Selecione a categoria dos serviços que você oferece</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Descrição dos Serviços
                    </label>
                    <textarea
                      value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                      placeholder="Descreva brevemente os serviços que você oferece..."
                      className="input-modern"
                      rows={3}
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-1">Esta descrição aparecerá no seu perfil público</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirmação */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Confirme seus dados</h3>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Resumo do cadastro:</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Tipo:</span> {userType === 'cliente' ? 'Cliente' : 'Prestador de Serviço'}</p>
                  <p><span className="font-medium">Nome:</span> {formData.nome}</p>
                  <p><span className="font-medium">E-mail:</span> {formData.email}</p>
                  <p><span className="font-medium">WhatsApp:</span> {formData.whatsapp}</p>
                  <p><span className="font-medium">Localidade:</span> {formData.uf} - {formData.cidade}</p>
                  {userType === 'prestador' && (
                    <p><span className="font-medium">CNPJ:</span> {formData.cpf_cnpj}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.aceita_termos}
                    onChange={(e) => setFormData({...formData, aceita_termos: e.target.checked})}
                    className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                    required
                    disabled={submitting}
                  />
                  <span className="text-sm text-gray-600">
                    Eu aceito os{' '}
                    <Link to="/termos" className="text-primary hover:underline font-semibold">
                      Termos de Uso
                    </Link>{' '}
                    e a{' '}
                    <Link to="/privacidade" className="text-primary hover:underline font-semibold">
                      Política de Privacidade
                    </Link>
                  </span>
                </label>

                {userType === 'prestador' && (
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                      required
                      disabled={submitting}
                    />
                    <span className="text-sm text-gray-600">
                      Declaro que possuo CNPJ válido e aceito as condições para prestadores de serviço
                    </span>
                  </label>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="flex items-center"
                disabled={loading || submitting}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            )}
            
            <div className="ml-auto">
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary"
                  disabled={step === 1 && !userType || loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Carregando...
                    </div>
                  ) : (
                    <>
                      Próximo
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="btn-success"
                  disabled={!formData.aceita_termos || submitting}
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Criando conta...
                    </div>
                  ) : (
                    'Criar conta'
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
