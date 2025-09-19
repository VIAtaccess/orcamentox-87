
-- 1. Criar bucket para fotos de perfil
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-photos',
  'profile-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
);

-- 2. Criar políticas RLS para o bucket profile-photos
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'profile-photos' );

CREATE POLICY "Authenticated users can upload profile photos"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'profile-photos' AND auth.role() = 'authenticated' );

CREATE POLICY "Users can update own profile photos"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1] )
WITH CHECK ( bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1] );

CREATE POLICY "Users can delete own profile photos"
ON storage.objects FOR DELETE
USING ( bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1] );

-- 3. Adicionar índices para melhor performance nas consultas de categoria
CREATE INDEX IF NOT EXISTS idx_profissionais_categoria_id ON public.profissionais(categoria_slug);
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON public.subcategories(category_id);
