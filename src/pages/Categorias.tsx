
import React, { useState } from 'react';
import { ArrowLeft, Search, FileText, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { Badge } from '@/components/ui/badge';

const Categorias = () => {
  const { categoriesWithSubcategories, loading } = useCategoriesData();
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar categorias baseado no termo de busca
  const filteredCategories = categoriesWithSubcategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.subcategories.some(sub => 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Todas as Categorias</h1>
          <p className="text-xl text-gray-600">
            {loading ? 'Carregando...' : `Encontre profissionais qualificados em ${categoriesWithSubcategories.length} categorias`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <Link to="/solicitar-orcamento" className="btn-primary inline-flex items-center justify-center">
            <FileText className="h-5 w-5 mr-2" />
            Solicitar Orçamento
          </Link>
          <Link to="/cadastro" className="btn-outline inline-flex items-center justify-center">
            <UserPlus className="h-5 w-5 mr-2" />
            Cadastrar como Profissional
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories Content */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Carregando categorias...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <div 
                key={category.id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100"
              >
                <div className={`${category.color || 'bg-primary'} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">🔧</span>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-gray-600">
                      {category.description}
                    </p>
                  )}

                  {category.subcategories?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.slice(0, 4).map((sub) => (
                        <Badge key={sub.id} variant="secondary" className="text-xs">
                          {sub.name}
                        </Badge>
                      ))}
                      {category.subcategories.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{category.subcategories.length - 4} mais
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Link 
                      to="/solicitar-orcamento" 
                      className="btn-primary text-sm py-2 px-3 inline-flex items-center justify-center flex-1"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Solicitar Orçamento
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results message */}
        {!loading && filteredCategories.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhuma categoria encontrada para "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categorias;
