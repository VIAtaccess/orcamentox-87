
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Página não encontrada</h2>
          <p className="text-xl text-gray-600 mb-8">
            Ops! A página que você está procurando não existe.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Voltar ao início
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Página anterior
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
