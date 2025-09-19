-- Create planos table
CREATE TABLE public.planos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.planos ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read planos" 
ON public.planos 
FOR SELECT 
USING (ativo = true);

-- Create policies for authenticated write access
CREATE POLICY "Authenticated write planos" 
ON public.planos 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_planos_updated_at
BEFORE UPDATE ON public.planos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default plans
INSERT INTO public.planos (titulo, descricao, valor, ordem) VALUES
('Básico', 'Até 3 propostas por mês, perfil básico, suporte por email', 0.00, 1),
('Profissional', 'Propostas ilimitadas, perfil destacado, suporte prioritário, badge verificado', 29.00, 2),
('Premium', 'Tudo do Profissional + topo das buscas, suporte WhatsApp, análises avançadas', 59.00, 3);