-- Create acessos table
CREATE TABLE public.acessos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  ip_address INET,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.acessos ENABLE ROW LEVEL SECURITY;

-- Create policies for public write access (para permitir tracking anônimo)
CREATE POLICY "Allow public insert acessos" 
ON public.acessos 
FOR INSERT 
WITH CHECK (true);

-- Create policies for authenticated read access
CREATE POLICY "Authenticated read acessos" 
ON public.acessos 
FOR SELECT 
USING (true);