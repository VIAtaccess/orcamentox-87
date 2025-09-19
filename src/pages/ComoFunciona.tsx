
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Users, Search, MessageCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const ComoFunciona = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Como Funciona</h1>
          <p className="text-xl text-gray-600">Conectamos você aos melhores profissionais de forma simples e segura</p>
        </div>

        {/* Para Clientes */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Para Clientes</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">1. Descreva seu projeto</h3>
              <p className="text-gray-600">Conte-nos detalhes sobre o serviço que você precisa. Quanto mais informações, melhor!</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">2. Receba propostas</h3>
              <p className="text-gray-600">Prestadores qualificados entrarão em contato com você em até 24 horas.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">3. Escolha o melhor</h3>
              <p className="text-gray-600">Compare propostas, avaliações e escolha o profissional ideal para seu projeto.</p>
            </div>
          </div>
        </div>

        {/* Para Prestadores */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Para Prestadores</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">1. Cadastre-se grátis</h3>
              <p className="text-gray-600">Crie seu perfil profissional e mostre seus trabalhos e qualificações.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">2. Encontre clientes</h3>
              <p className="text-gray-600">Receba notificações de projetos na sua área e região de atuação.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">3. Faça propostas</h3>
              <p className="text-gray-600">Envie orçamentos competitivos e construa sua reputação na plataforma.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-primary rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl mb-8 opacity-90">Junte-se a milhares de usuários satisfeitos</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/solicitar-orcamento">
              <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-3">
                Solicitar Orçamento
              </Button>
            </Link>
            <Link to="/cadastro">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3">
                Cadastrar-se como Prestador
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComoFunciona;
