
-- Criar tabela de favoritos para clientes salvarem prestadores favoritos
CREATE TABLE IF NOT EXISTS public.favoritos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  prestador_id uuid NOT NULL REFERENCES public.profissionais(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(cliente_id, prestador_id)
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_favoritos_cliente ON public.favoritos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_favoritos_prestador ON public.favoritos(prestador_id);

-- Habilitar RLS
ALTER TABLE public.favoritos ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para favoritos
CREATE POLICY "Allow public read favoritos"
  ON public.favoritos FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert favoritos"
  ON public.favoritos FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update favoritos"
  ON public.favoritos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete favoritos"
  ON public.favoritos FOR DELETE
  TO authenticated
  USING (true);

-- Atualizar tabela de profissionais para incluir campos que estavam faltando
ALTER TABLE public.profissionais 
ADD COLUMN IF NOT EXISTS nota_media decimal(2,1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_avaliacoes integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS verificado boolean DEFAULT false;

-- Trigger para atualizar updated_at em favoritos
CREATE TRIGGER update_favoritos_updated_at
  BEFORE UPDATE ON public.favoritos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
