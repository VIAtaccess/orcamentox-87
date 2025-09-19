
import React from 'react';
import { Search, Users, MessageSquare, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    icon: Search,
    title: 'Descreva seu projeto',
    description: 'Conte-nos o que você precisa em poucos cliques. É rápido e gratuito.',
    color: 'bg-blue-500'
  },
  {
    icon: Users,
    title: 'Receba propostas',
    description: 'Prestadores qualificados enviam orçamentos personalizados para você.',
    color: 'bg-green-500'
  },
  {
    icon: MessageSquare,
    title: 'Compare e escolha',
    description: 'Analise as propostas, avaliações e escolha o melhor prestador.',
    color: 'bg-purple-500'
  },
  {
    icon: CheckCircle,
    title: 'Contrate com segurança',
    description: 'Todos os prestadores são verificados e avaliados por outros clientes.',
    color: 'bg-orange-500'
  }
];

const HowItWorksSection = () => {
  return (
    <section id="como-funciona" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Como <span className="text-gradient">Funciona</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Um processo simples e seguro para conectar você aos melhores profissionais. 
            Em poucos passos, você encontra quem precisa.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 animate-slide-up">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div 
                key={index}
                className="text-center group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Step Number */}
                <div className="relative mb-6">
                  <div className={`${step.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <IconComponent className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gray-900 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link to="/solicitar-orcamento" className="btn-primary text-xl px-10 py-4 inline-block">
            Começar Agora - É Gratuito
          </Link>
          <p className="text-gray-500 mt-4">
            Sem compromisso • Sem taxa de cadastro • Sem cartão de crédito
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
