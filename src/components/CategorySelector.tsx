
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategoriesData } from '@/hooks/useCategoriesData';
import { getCategoryIcon } from '@/utils/categoryIconMap';

interface CategorySelectorProps {
  selectedCategory?: string;
  selectedSubcategory?: string;
  onCategoryChange: (categorySlug: string) => void;
  onSubcategoryChange: (subcategorySlug: string) => void;
  disabled?: boolean;
}

const CategorySelector = ({
  selectedCategory,
  selectedSubcategory,
  onCategoryChange,
  onSubcategoryChange,
  disabled = false
}: CategorySelectorProps) => {
  const { categoriesWithSubcategories, loading } = useCategoriesData();

  const selectedCategoryData = categoriesWithSubcategories.find(cat => cat.slug === selectedCategory);

  const handleCategoryChange = (categorySlug: string) => {
    onCategoryChange(categorySlug);
    onSubcategoryChange(''); // Reset subcategory when category changes
  };

  const handleSubcategoryChange = (subcategorySlug: string) => {
    // Convert "none" back to empty string for consistency with the form
    onSubcategoryChange(subcategorySlug === 'none' ? '' : subcategorySlug);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="categoria">Categoria Principal</Label>
        <Select 
          value={selectedCategory || ''} 
          onValueChange={handleCategoryChange}
          disabled={loading || disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder={loading ? 'Carregando...' : 'Selecione uma categoria'} />
          </SelectTrigger>
          <SelectContent>
            {categoriesWithSubcategories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCategoryData && selectedCategoryData.subcategories.length > 0 && (
        <div>
          <Label htmlFor="subcategoria">Subcategoria</Label>
          <Select 
            value={selectedSubcategory === '' ? 'none' : selectedSubcategory} 
            onValueChange={handleSubcategoryChange}
            disabled={loading || disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma subcategoria (opcional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhuma subcategoria</SelectItem>
              {selectedCategoryData.subcategories.map((subcategory) => (
                <SelectItem key={subcategory.id} value={subcategory.slug}>
                  {subcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
