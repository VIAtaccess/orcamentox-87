
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search, Star, CheckCircle, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-pros.jpg';

const Hero = () => {
  return (
    <section className="relative bg-gradient-hero min-h-screen flex items-center overflow-hidden py-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-12 h-12 bg-yellow-300/20 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-20 w-10 h-10 bg-green-300/20 rounded-full animate-ping delay-2000"></div>
        <div className="absolute bottom-20 right-32 w-20 h-20 bg-blue-300/10 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0ibTM2IDM0IDYtMnYtMmgyVjI4aC0ydi0ybC02LTJ2LTJoLTJ2MmgtMnYyaDJ2MmgydjJoMnYyaC0ydjJoLTJ2LTJoLTJ2LTJoMnYtMmgtMnYtMmgydi0yaDJ2MmgydjJoLTJ2MmgydjJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Hero Content */}
          <div className="text-white space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
              <Star className="h-5 w-5 text-yellow-300 fill-current animate-pulse" />
              <span className="font-semibold">Mais de 50.000 orçamentos realizados</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-black leading-tight">
                Encontre os<br />
                <span className="text-gradient-white">Melhores</span><br />
                <span className="text-yellow-300 drop-shadow-lg">Prestadores</span>
              </h1>
              <p className="text-lg lg:text-xl text-white/95 max-w-xl leading-relaxed">
                Conectamos você aos prestadores mais qualificados e verificados do Brasil. 
                Receba múltiplos orçamentos gratuitos em minutos.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <div className="text-sm">
                  <div className="font-bold">100% Gratuito</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                <Clock className="h-5 w-5 text-blue-300" />
                <div className="text-sm">
                  <div className="font-bold">Resposta em 24h</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                <Shield className="h-5 w-5 text-purple-300" />
                <div className="text-sm">
                  <div className="font-bold">Verificados</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-white text-primary hover:bg-gray-100 font-bold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300" asChild>
                <Link to="/solicitar-orcamento">
                  <Search className="h-5 w-5 mr-2" />
                  Solicitar Orçamento Gratuito
                </Link>
              </Button>
              <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-semibold text-lg px-8 py-4 rounded-xl backdrop-blur-sm transition-all duration-300" asChild>
                <Link to="/cadastro">
                  Oferecer Serviços
                </Link>
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block animate-scale-in">
            <img
              src={heroImage}
              alt="Profissionais qualificados de várias áreas prontos para atender"
              loading="lazy"
              decoding="async"
              className="w-full h-auto max-w-[700px] mx-auto rounded-2xl shadow-2xl"
            />
          </div>

        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16">
          <path d="M1200 120L0 16.48V0h1200v120z" fill="white"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
