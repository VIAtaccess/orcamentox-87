import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, Star, Crown, Zap } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Link } from 'react-router-dom';

interface Plano {
  id: string;
  titulo: string;
  descricao: string;
  valor: number;
  ordem: number;
}

const PlanosSection = () => {
  const [planos, setPlanos] = useState<Plano[]>([]);
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
        setPlanos(data || []);
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

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">Carregando planos...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Planos e Preços
          </h2>
          <p className="text-xl text-gray-600">
            Escolha o plano ideal para impulsionar seu negócio
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {planos.map((plano, index) => {
            const IconComponent = getIcon(index);
            const isPopular = index === 1; // Plano do meio como popular
            
            return (
              <div
                key={plano.id}
                className={`bg-white rounded-3xl shadow-lg p-8 relative transition-transform hover:scale-105 ${
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
                  {plano.valor > 0 && (
                    <div className="text-gray-600">/mês</div>
                  )}
                </div>

                <div className="mb-8">
                  <p className="text-gray-700 text-center">{plano.descricao}</p>
                </div>

                <Button
                  className={`w-full ${
                    isPopular
                      ? 'bg-primary hover:bg-primary/90'
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                  asChild
                >
                  <Link to={plano.valor === 0 ? "/cadastro" : `/pagamento/${plano.id}`}>
                    {plano.valor === 0 ? 'Começar Grátis' : 'Assinar Agora'}
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlanosSection;