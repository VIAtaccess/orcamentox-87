
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Star, Crown, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

interface PlanoDb {
  id: string;
  titulo: string;
  descricao: string;
  valor: number;
  ordem: number;
}

const Planos = () => {
  const [planosDb, setPlanosDb] = useState<PlanoDb[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanos = async () => {
      try {
        const { data, error } = await supabase
          .from('planos')
          .select('*')
          .eq('ativo', true)
          .order('ordem');

        if (error) throw error;
        setPlanosDb(data || []);
      } catch (error) {
        console.error('Erro ao carregar planos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanos();
  }, []);

  const getIcon = (index: number) => {
    const icons = [Star, Crown, Zap];
    return icons[index] || Star;
  };

  const getColor = (index: number) => {
    const colors = ['bg-gray-500', 'bg-blue-500', 'bg-purple-500'];
    return colors[index] || 'bg-gray-500';
  };

  const getFeaturesForPlano = (titulo: string): string[] => {
    const featuresMap: { [key: string]: string[] } = {
      'Básico': [
        'Até 3 propostas por mês',
        'Perfil básico',
        'Suporte por email',
        'Acesso às categorias principais'
      ],
      'Profissional': [
        'Propostas ilimitadas',
        'Perfil destacado',
        'Suporte prioritário',
        'Todas as categorias',
        'Badge de verificado',
        'Relatórios mensais'
      ],
      'Premium': [
        'Tudo do Profissional',
        'Aparece no topo das buscas',
        'Suporte via WhatsApp',
        'Portfólio ilimitado',
        'Integração com redes sociais',
        'Análises avançadas',
        'Consultoria de marketing'
      ]
    };
    
    return featuresMap[titulo] || [];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Planos e Preços</h1>
            <p className="text-xl text-gray-600">Escolha o plano ideal para impulsionar seu negócio</p>
          </div>
        </div>

        {/* Pricing Cards */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Carregando planos...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {planosDb.map((plano, index) => {
              const IconComponent = getIcon(index);
              const isPopular = index === 1; // Plano do meio como popular
              const features = getFeaturesForPlano(plano.titulo);
              
              return (
                <div 
                  key={plano.id}
                  className={`bg-white rounded-3xl shadow-lg p-8 relative ${
                    isPopular ? 'ring-2 ring-primary scale-105' : ''
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold">
                        Mais Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div className={`${getColor(index)} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plano.titulo}</h3>
                    <div className="text-4xl font-bold text-gray-900 mb-1">
                      {plano.valor === 0 ? 'Grátis' : `R$ ${plano.valor.toFixed(0)}`}
                    </div>
                    <div className="text-gray-600">
                      {plano.valor === 0 ? 'para sempre' : '/mês'}
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    asChild
                    className={`w-full ${
                      isPopular 
                        ? 'bg-primary hover:bg-primary/90' 
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                  >
                    <Link to={plano.valor === 0 ? '/cadastro' : `/pagamento/${plano.id}`}>
                      {plano.valor === 0 ? 'Começar Grátis' : 'Assinar Agora'}
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl shadow-lg p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Perguntas Frequentes</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Posso cancelar a qualquer momento?</h3>
              <p className="text-gray-600">Sim, você pode cancelar seu plano a qualquer momento sem custos adicionais.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Como funciona o período gratuito?</h3>
              <p className="text-gray-600">Todos os planos pagos incluem 7 dias grátis para você testar sem compromisso.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Posso mudar de plano depois?</h3>
              <p className="text-gray-600">Claro! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Há cobrança por transação?</h3>
              <p className="text-gray-600">Não cobramos taxas por transação. Você paga apenas a mensalidade do plano escolhido.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planos;
