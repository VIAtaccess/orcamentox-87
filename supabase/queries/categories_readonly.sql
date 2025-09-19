-- Consultas somente leitura para Categorias e Subcategorias
-- Nada aqui altera dados. Você pode copiar e colar no SQL Editor do Supabase.

-- 1) Listar todas as categorias (ordenadas por nome)
SELECT 
  c.id,
  c.name,
  c.slug,
  c.description,
  c.icon,
  c.color,
  c.created_at
FROM public.categories c
ORDER BY c.name;

-- 2) Listar categorias com suas subcategorias (em JSON)
SELECT
  c.id,
  c.name,
  c.slug,
  c.description,
  c.icon,
  c.color,
  c.created_at,
  COALESCE(
    json_agg(
      json_build_object(
        'id', s.id,
        'name', s.name,
        'slug', s.slug,
        'description', s.description,
        'created_at', s.created_at
      )
      ORDER BY s.name
    ) FILTER (WHERE s.id IS NOT NULL),
    '[]'::json
  ) AS subcategories
FROM public.categories c
LEFT JOIN public.subcategories s ON s.category_id = c.id
GROUP BY c.id
ORDER BY c.name;

-- 3) Obter uma categoria específica (por slug) com subcategorias
-- Substitua :slug pelo slug desejado, por exemplo 'reformas'
SELECT
  c.id,
  c.name,
  c.slug,
  c.description,
  c.icon,
  c.color,
  c.created_at,
  COALESCE(
    json_agg(
      json_build_object(
        'id', s.id,
        'name', s.name,
        'slug', s.slug,
        'description', s.description,
        'created_at', s.created_at
      )
      ORDER BY s.name
    ) FILTER (WHERE s.id IS NOT NULL),
    '[]'::json
  ) AS subcategories
FROM public.categories c
LEFT JOIN public.subcategories s ON s.category_id = c.id
WHERE c.slug = :slug
GROUP BY c.id;

-- 4) Listar todas as subcategorias de uma categoria (por slug da categoria)
-- Substitua 'reformas' pelo slug desejado
SELECT 
  s.id,
  s.name,
  s.slug,
  s.description,
  s.created_at
FROM public.subcategories s
JOIN public.categories c ON c.id = s.category_id
WHERE c.slug = 'reformas'
ORDER BY s.name;

-- 5) Buscar categorias por nome (case-insensitive)
-- Substitua :q pelo termo de busca, ex: '%pint%'
SELECT 
  c.*
FROM public.categories c
WHERE c.name ILIKE :q
ORDER BY c.name;

-- Observações importantes:
-- - As tabelas e políticas já estão definidas em: supabase/schema/categories.sql
-- - As políticas permitem leitura pública (anon e authenticated) e escrita apenas para authenticated.
-- - Este arquivo contém apenas consultas SELECT (somente leitura).
-- - Se desejar uma VIEW para facilitar consumo via API, podemos criar (opcional):
--
-- CREATE OR REPLACE VIEW public.v_categories_with_subcategories AS
-- SELECT
--   c.id,
--   c.name,
--   c.slug,
--   c.description,
--   c.icon,
--   c.color,
--   c.created_at,
--   COALESCE(
--     json_agg(
--       json_build_object(
--         'id', s.id,
--         'name', s.name,
--         'slug', s.slug,
--         'description', s.description,
--         'created_at', s.created_at
--       )
--       ORDER BY s.name
--     ) FILTER (WHERE s.id IS NOT NULL),
--     '[]'::json
--   ) AS subcategories
-- FROM public.categories c
-- LEFT JOIN public.subcategories s ON s.category_id = c.id
-- GROUP BY c.id
-- ORDER BY c.name;
--
-- (Podemos aplicar essa VIEW quando você autorizar alterações no banco.)
