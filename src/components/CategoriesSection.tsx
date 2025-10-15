
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { FileText, Shapes } from 'lucide-react';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { getCategoryIcon } from '@/utils/categoryIconMap';

const CategoriesSection = () => {
  const { categoriesWithSubcategories, loading } = useCategoriesData();

  if (loading) {
    return (
      <section id="categorias" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
              Categorias <span className="text-gradient">Populares</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Carregando categorias...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categorias" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Categorias <span className="text-gradient">Populares</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encontre profissionais qualificados em diversas áreas. 
            Mais de {categoriesWithSubcategories.length} categorias disponíveis para atender suas necessidades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {categoriesWithSubcategories.map((category, index) => {
            const CategoryIcon = getCategoryIcon(category.slug);
            return (
              <div 
                key={category.id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`${category.color || 'bg-primary'} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <CategoryIcon className="h-8 w-8 text-white" />
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

                  {category.subcategories?.length ? (
                    <div className="flex flex-wrap gap-2" aria-label={`Subcategorias de ${category.name}`}>
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
                  ) : null}

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Link 
                      to="/solicitar-orcamento" 
                      className="btn-primary text-sm py-2 px-3 inline-flex items-center justify-center flex-1"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Orçamento
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link to="/categorias" className="btn-outline inline-block" aria-label="Ver todas as categorias">
            Ver Todas as Categorias
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
