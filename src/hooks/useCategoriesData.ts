
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export const useCategoriesData = () => {
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Erro ao buscar categorias:', error);
        return [];
      }
      return data as Category[];
    },
  });

  const { data: subcategories = [], isLoading: loadingSubcategories } = useQuery({
    queryKey: ['subcategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Erro ao buscar subcategorias:', error);
        return [];
      }
      return data as Subcategory[];
    },
  });

  // Agrupar subcategorias por categoria
  const categoriesWithSubcategories = categories.map(category => ({
    ...category,
    subcategories: subcategories.filter(sub => sub.category_id === category.id)
  }));

  return {
    categories,
    subcategories,
    categoriesWithSubcategories,
    loading: loadingCategories || loadingSubcategories
  };
};
