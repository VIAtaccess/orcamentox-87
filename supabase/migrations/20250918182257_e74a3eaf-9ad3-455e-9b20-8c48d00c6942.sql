-- Adicionar campo admin na tabela profissionais
ALTER TABLE public.profissionais 
ADD COLUMN admin boolean DEFAULT false NOT NULL;