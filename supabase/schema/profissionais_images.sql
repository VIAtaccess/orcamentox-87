 Adicionar campos de imagens à tabela profissionais
ALTER TABLE public.profi--ssionais 
ADD COLUMN IF NOT EXISTS imagem_servico_1 text,
ADD COLUMN IF NOT EXISTS imagem_servico_2 text,
ADD COLUMN IF NOT EXISTS imagem_servico_3 text;

-- Criar bucket para armazenamento de imagens dos serviços
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'servicos-imagens',
  'servicos-imagens',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
) ON CONFLICT (id) DO NOTHING;

-- Política de storage para permitir upload público
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT TO PUBLIC
WITH CHECK (bucket_id = 'servicos-imagens');

-- Política de storage para permitir visualização pública
CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT TO PUBLIC
USING (bucket_id = 'servicos-imagens');

-- Política de storage para permitir update pelos proprietários
CREATE POLICY "Allow authenticated users to update their images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'servicos-imagens');

-- Política de storage para permitir delete pelos proprietários  
CREATE POLICY "Allow authenticated users to delete their images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'servicos-imagens');