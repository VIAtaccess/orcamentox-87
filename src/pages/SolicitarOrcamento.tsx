import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Clock, DollarSign } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useBrazilLocations } from '@/hooks/use-brazil-locations';
import { usePhoneMask } from '@/hooks/usePhoneMask';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useOrcamentoNotifications } from '@/hooks/useOrcamentoNotifications';

const SolicitarOrcamento = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [clienteData, setClienteData] = useState<any>(null);
  const [formData, setFormData] = useState({
    categoria_id: '',
    subcategoria_id: '',
    titulo: '',
    descricao: '',
    endereco: '',
    uf: '',
    cidade: '',
    urgencia: 'media',
    orcamento_estimado: '',
    max_propostas: 5,
    nome_cliente: '',
    email_cliente: '',
    whatsapp_cliente: ''
  });

  const { states, cities, loadingStates, loadingCities, fetchCities } = useBrazilLocations();
  const { categories, subcategories, loading: loadingCategories } = useCategoriesData();
  const phoneMask = usePhoneMask(formData.whatsapp_cliente);
  const { notifyProviders, isSending } = useOrcamentoNotifications();

  // Carregar dados do usuário logado
  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Usuário logado:', user);
      
      if (user) {
        setUser(user);
        
        // Buscar dados do cliente
        const { data: cliente } = await supabase
          .from('clientes')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();

        console.log('Dados do cliente:', cliente);
        
        if (cliente) {
          setClienteData(cliente);
          setFormData(prev => ({
            ...prev,
            nome_cliente: cliente.nome || '',
            email_cliente: cliente.email || user.email,
            whatsapp_cliente: cliente.whatsapp || '',
            endereco: cliente.endereco || '',
            uf: cliente.uf || '',
            cidade: cliente.cidade || ''
          }));
        } else {
          // Se não tem cliente cadastrado, usar dados do auth
          setFormData(prev => ({
            ...prev,
            nome_cliente: user.user_metadata?.nome_completo || '',
            email_cliente: user.email || '',
            whatsapp_cliente: user.user_metadata?.whatsapp || ''
          }));
        }
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    if (formData.uf) {
      fetchCities(formData.uf);
      setFormData(prev => ({ ...prev, cidade: '' }));
    }
  }, [formData.uf]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = phoneMask.handleChange(e.target.value);
    setFormData({...formData, whatsapp_cliente: formatted});
  };

  const selectedCategory = categories.find(cat => cat.id === formData.categoria_id);
  const availableSubcategories = formData.categoria_id ? 
    subcategories.filter(sub => sub.category_id === formData.categoria_id) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      console.log('Enviando solicitação de orçamento:', formData);

      // Primeiro, verificar se o cliente existe ou criar um novo
      let cliente_id = null;
      
      if (user) {
        // Usuário logado - verificar se existe cliente
        let { data: cliente } = await supabase
          .from('clientes')
          .select('id')
          .eq('email', user.email)
          .maybeSingle();

        if (!cliente) {
          // Criar cliente se não existe
          const { data: novoCliente, error: erroCliente } = await supabase
            .from('clientes')
            .insert({
              nome: formData.nome_cliente,
              email: formData.email_cliente,
              whatsapp: phoneMask.getUnmaskedValue(),
              endereco: formData.endereco,
              uf: formData.uf,
              cidade: formData.cidade
            })
            .select('id')
            .single();

          if (erroCliente) {
            console.error('Erro ao criar cliente:', erroCliente);
            throw erroCliente;
          }
          cliente_id = novoCliente.id;
        } else {
          cliente_id = cliente.id;
        }
      }

      // Criar a solicitação
      const solicitacaoData = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        endereco: formData.endereco,
        uf: formData.uf,
        cidade: formData.cidade,
        urgencia: formData.urgencia,
        orcamento_estimado: formData.orcamento_estimado,
        max_propostas: formData.max_propostas,
        categoria_id: formData.categoria_id || null,
        subcategoria_id: formData.subcategoria_id || null,
        cliente_id: cliente_id,
        // Dados de contato para usuários não logados
        nome_cliente: formData.nome_cliente,
        email_cliente: formData.email_cliente,
        whatsapp_cliente: phoneMask.getUnmaskedValue()
      };

      console.log('Dados da solicitação a serem enviados:', solicitacaoData);

      const { data: solicitacao, error } = await supabase
        .from('solicitacoes_orcamento')
        .insert(solicitacaoData)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar solicitação:', error);
        throw error;
      }

      console.log('Solicitação criada com sucesso:', solicitacao);
      
      // Notificar prestadores via WhatsApp
      const selectedCategory = categories.find(cat => cat.id === formData.categoria_id);
      
      if (selectedCategory) {
        await notifyProviders(
          solicitacao.id,
          formData.titulo,
          selectedCategory.slug,
          formData.uf,
          formData.cidade
        );
      }
      
      toast.success('Solicitação enviada com sucesso! Você receberá propostas em breve.');
      
      setTimeout(() => {
        if (user) {
          navigate('/minhas-solicitacoes');
        } else {
          navigate('/');
        }
      }, 2000);

    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      toast.error('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Solicitar Orçamento</h1>
          <p className="text-gray-600 mt-2">Receba propostas de profissionais qualificados</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Card: Serviço */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Qual serviço você precisa?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <Select 
                    value={formData.categoria_id} 
                    onValueChange={(val) => setFormData({ ...formData, categoria_id: val, subcategoria_id: '' })}
                    disabled={loading || loadingCategories}
                  >
                    <SelectTrigger className="input-modern">
                      <SelectValue placeholder={loadingCategories ? "Carregando..." : "Selecione a categoria"} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subcategoria
                  </label>
                  <Select 
                    value={formData.subcategoria_id} 
                    onValueChange={(val) => setFormData({ ...formData, subcategoria_id: val })}
                    disabled={!formData.categoria_id || loading || loadingCategories}
                  >
                    <SelectTrigger className="input-modern">
                      <SelectValue placeholder={!formData.categoria_id ? 'Selecione a categoria primeiro' : 'Selecione a subcategoria'} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubcategories.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Título do serviço *
                  </label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    placeholder="Ex: Trocar chuveiro elétrico"
                    className="input-modern"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descrição detalhada *
                  </label>
                  <Textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    placeholder="Descreva detalhadamente o que você precisa..."
                    className="input-modern min-h-[120px] resize-none"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Card: Localização */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Onde será realizado o serviço?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <SelectValue placeholder={loadingStates ? 'Carregando...' : 'Selecione o estado'} />
                    </SelectTrigger>
                    <SelectContent>
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
                      <SelectValue placeholder={!formData.uf ? 'Selecione o estado primeiro' : (loadingCities ? 'Carregando...' : 'Selecione a cidade')} />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.nome}>{city.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Endereço completo *
                  </label>
                  <input
                    type="text"
                    value={formData.endereco}
                    onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                    placeholder="Rua, número, bairro..."
                    className="input-modern"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Card: Detalhes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Detalhes do projeto</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Urgência
                  </label>
                  <Select 
                    value={formData.urgencia} 
                    onValueChange={(val) => setFormData({ ...formData, urgencia: val })}
                    disabled={loading}
                  >
                    <SelectTrigger className="input-modern">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa - Até 1 semana</SelectItem>
                      <SelectItem value="media">Média - Até 3 dias</SelectItem>
                      <SelectItem value="alta">Alta - Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <DollarSign className="h-4 w-4 inline mr-1" />
                    Orçamento estimado
                  </label>
                  <Select 
                    value={formData.orcamento_estimado} 
                    onValueChange={(val) => setFormData({ ...formData, orcamento_estimado: val })}
                    disabled={loading}
                  >
                    <SelectTrigger className="input-modern">
                      <SelectValue placeholder="Selecione uma faixa (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ate-100">Até R$ 100</SelectItem>
                      <SelectItem value="100-300">R$ 100 - R$ 300</SelectItem>
                      <SelectItem value="300-500">R$ 300 - R$ 500</SelectItem>
                      <SelectItem value="500-1000">R$ 500 - R$ 1.000</SelectItem>
                      <SelectItem value="1000-plus">Acima de R$ 1.000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Card: Contato */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Seus dados de contato</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    value={formData.nome_cliente}
                    onChange={(e) => setFormData({...formData, nome_cliente: e.target.value})}
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
                    value={formData.email_cliente}
                    onChange={(e) => setFormData({...formData, email_cliente: e.target.value})}
                    placeholder="seu@email.com"
                    className="input-modern"
                    required
                    disabled={loading || !!user}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp_cliente}
                    onChange={handlePhoneChange}
                    placeholder="(11) 99999-9999"
                    className="input-modern"
                    required
                    disabled={loading}
                    maxLength={15}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button 
                type="submit" 
                className="btn-success text-lg py-4 px-8"
                disabled={submitting}
              >
                {submitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Enviando solicitação...
                  </div>
                ) : (
                  'Enviar Solicitação'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SolicitarOrcamento;
