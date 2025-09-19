
-- Add subcategoria_slug column to profissionais table
ALTER TABLE public.profissionais 
ADD COLUMN subcategoria_slug text;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_profissionais_subcategoria_slug ON public.profissionais(subcategoria_slug);
