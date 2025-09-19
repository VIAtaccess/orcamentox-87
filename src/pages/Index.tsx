
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CategoriesSection from '@/components/CategoriesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import PlanosSection from '@/components/PlanosSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <CategoriesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PlanosSection />
      <Footer />
    </div>
  );
};

export default Index;
