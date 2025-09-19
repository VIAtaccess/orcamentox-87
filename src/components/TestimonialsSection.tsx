
import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Maria Silva',
    location: 'São Paulo, SP',
    service: 'Reforma de Cozinha',
    rating: 5,
    text: 'Precisei reformar minha cozinha e recebi 5 orçamentos em 2 horas! Escolhi o João que fez um trabalho incrível. Super recomendo a plataforma.',
    avatar: '👩‍💼'
  },
  {
    name: 'Carlos Santos',
    location: 'Rio de Janeiro, RJ',
    service: 'Instalação Elétrica',
    rating: 5,
    text: 'Serviço rápido e profissionais qualificados. O eletricista chegou no horário e resolveu tudo em uma manhã. Preço justo!',
    avatar: '👨‍💻'
  },
  {
    name: 'Ana Costa',
    location: 'Belo Horizonte, MG',
    service: 'Pintura Residencial',
    rating: 5,
    text: 'Excelente! Comparei 4 propostas e escolhi a melhor. O pintor foi muito caprichoso e o resultado ficou lindo.',
    avatar: '👩‍🎨'
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            O que nossos <span className="text-gradient">Clientes</span> dizem
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Milhares de brasileiros já encontraram os melhores profissionais através da nossa plataforma.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-3xl p-8 shadow-lg card-hover"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <Quote className="h-8 w-8 text-primary opacity-50" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author Info */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-2xl mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.location}</div>
                  <div className="text-primary text-sm font-semibold">{testimonial.service}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">50k+</div>
            <div className="text-gray-600">Orçamentos realizados</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-success mb-2">15k+</div>
            <div className="text-gray-600">Prestadores ativos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-warning mb-2">98%</div>
            <div className="text-gray-600">Satisfação</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-500 mb-2">24h</div>
            <div className="text-gray-600">Tempo médio resposta</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
