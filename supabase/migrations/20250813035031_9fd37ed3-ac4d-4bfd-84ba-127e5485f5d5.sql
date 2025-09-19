
-- 1. Primeiro, vamos criar dados reais de categorias e subcategorias
INSERT INTO public.categories (name, slug, description, icon, color) VALUES
('Reformas e Construção', 'reformas-construcao', 'Serviços de reforma, construção e reparos em geral', 'Hammer', 'bg-blue-500'),
('Serviços Elétricos', 'servicos-eletricos', 'Instalação, manutenção e reparo de sistemas elétricos', 'Zap', 'bg-yellow-500'),
('Serviços Hidráulicos', 'servicos-hidraulicos', 'Encanamento, vazamentos e instalações hidráulicas', 'Droplets', 'bg-blue-600'),
('Limpeza e Organização', 'limpeza-organizacao', 'Serviços de limpeza residencial e comercial', 'Sparkles', 'bg-green-500'),
('Jardinagem e Paisagismo', 'jardinagem-paisagismo', 'Cuidados com jardins, plantas e paisagismo', 'Leaf', 'bg-green-600'),
('Pintura', 'pintura', 'Pintura residencial, comercial e artística', 'Paintbrush', 'bg-purple-500'),
('Marcenaria', 'marcenaria', 'Móveis planejados, reparos e trabalhos em madeira', 'Wrench', 'bg-amber-600'),
('Tecnologia', 'tecnologia', 'Serviços de TI, reparos e instalações tecnológicas', 'Monitor', 'bg-indigo-500')
ON CONFLICT (slug) DO NOTHING;

-- 2. Inserir subcategorias para cada categoria
INSERT INTO public.subcategories (category_id, name, slug, description) VALUES
-- Reformas e Construção
((SELECT id FROM categories WHERE slug = 'reformas-construcao'), 'Pedreiro', 'pedreiro', 'Construção, reformas e reparos em alvenaria'),
((SELECT id FROM categories WHERE slug = 'reformas-construcao'), 'Azulejista', 'azulejista', 'Colocação de azulejos e pisos'),
((SELECT id FROM categories WHERE slug = 'reformas-construcao'), 'Gesseiro', 'gesseiro', 'Trabalhos em gesso e drywall'),
((SELECT id FROM categories WHERE slug = 'reformas-construcao'), 'Telhadista', 'telhadista', 'Reparos e instalação de telhados'),

-- Serviços Elétricos
((SELECT id FROM categories WHERE slug = 'servicos-eletricos'), 'Eletricista Residencial', 'eletricista-residencial', 'Instalações elétricas residenciais'),
((SELECT id FROM categories WHERE slug = 'servicos-eletricos'), 'Eletricista Predial', 'eletricista-predial', 'Instalações elétricas prediais'),
((SELECT id FROM categories WHERE slug = 'servicos-eletricos'), 'Instalação de Chuveiro', 'instalacao-chuveiro', 'Instalação e reparo de chuveiros elétricos'),

-- Serviços Hidráulicos
((SELECT id FROM categories WHERE slug = 'servicos-hidraulicos'), 'Encanador', 'encanador', 'Reparos e instalações hidráulicas'),
((SELECT id FROM categories WHERE slug = 'servicos-hidraulicos'), 'Desentupimento', 'desentupimento', 'Desentupimento de pias, vasos e ralos'),
((SELECT id FROM categories WHERE slug = 'servicos-hidraulicos'), 'Instalação de Torneiras', 'instalacao-torneiras', 'Instalação e troca de torneiras'),

-- Limpeza e Organização
((SELECT id FROM categories WHERE slug = 'limpeza-organizacao'), 'Faxina Residencial', 'faxina-residencial', 'Limpeza completa residencial'),
((SELECT id FROM categories WHERE slug = 'limpeza-organizacao'), 'Limpeza Pós-Obra', 'limpeza-pos-obra', 'Limpeza após reformas e construções'),
((SELECT id FROM categories WHERE slug = 'limpeza-organizacao'), 'Organização de Ambientes', 'organizacao-ambientes', 'Organização e decoração de espaços'),

-- Jardinagem e Paisagismo
((SELECT id FROM categories WHERE slug = 'jardinagem-paisagismo'), 'Jardineiro', 'jardineiro', 'Cuidados com jardins e plantas'),
((SELECT id FROM categories WHERE slug = 'jardinagem-paisagismo'), 'Paisagismo', 'paisagismo', 'Projeto e execução de paisagismo'),
((SELECT id FROM categories WHERE slug = 'jardinagem-paisagismo'), 'Poda de Árvores', 'poda-arvores', 'Poda e cuidados com árvores'),

-- Pintura
((SELECT id FROM categories WHERE slug = 'pintura'), 'Pintor Residencial', 'pintor-residencial', 'Pintura de casas e apartamentos'),
((SELECT id FROM categories WHERE slug = 'pintura'), 'Pintura Comercial', 'pintura-comercial', 'Pintura de estabelecimentos comerciais'),
((SELECT id FROM categories WHERE slug = 'pintura'), 'Pintura Artística', 'pintura-artistica', 'Murais e trabalhos artísticos'),

-- Marcenaria
((SELECT id FROM categories WHERE slug = 'marcenaria'), 'Móveis Planejados', 'moveis-planejados', 'Fabricação de móveis sob medida'),
((SELECT id FROM categories WHERE slug = 'marcenaria'), 'Reparo de Móveis', 'reparo-moveis', 'Restauração e reparo de móveis'),
((SELECT id FROM categories WHERE slug = 'marcenaria'), 'Portas e Janelas', 'portas-janelas', 'Instalação e reparo de portas e janelas'),

-- Tecnologia
((SELECT id FROM categories WHERE slug = 'tecnologia'), 'Técnico em Informática', 'tecnico-informatica', 'Reparo e manutenção de computadores'),
((SELECT id FROM categories WHERE slug = 'tecnologia'), 'Instalação de TV', 'instalacao-tv', 'Instalação de TVs e sistemas de som'),
((SELECT id FROM categories WHERE slug = 'tecnologia'), 'Rede e Internet', 'rede-internet', 'Instalação de redes e internet')
ON CONFLICT (slug) DO NOTHING;

-- 3. Adicionar campo categoria_slug na tabela profissionais se não existir
ALTER TABLE public.profissionais 
ADD COLUMN IF NOT EXISTS categoria_slug text;

-- 4. Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_profissionais_categoria_slug ON public.profissionais(categoria_slug);

-- 5. Criar tabela para notificações WhatsApp
CREATE TABLE IF NOT EXISTS public.whatsapp_notifications (
  id uuid primary key default gen_random_uuid(),
  solicitacao_id uuid references public.solicitacoes_orcamento(id) on delete cascade,
  prestador_id uuid,
  whatsapp_number text not null,
  message text not null,
  status text check (status in ('pending', 'sent', 'failed')) default 'pending',
  error_message text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

-- 6. Habilitar RLS na tabela de notificações
ALTER TABLE public.whatsapp_notifications ENABLE ROW LEVEL SECURITY;

-- 7. Políticas para a tabela de notificações
CREATE POLICY "Allow public read whatsapp_notifications"
  ON public.whatsapp_notifications FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert whatsapp_notifications"
  ON public.whatsapp_notifications FOR INSERT
  WITH CHECK (true);

-- 8. Função para enviar notificações WhatsApp automaticamente
CREATE OR REPLACE FUNCTION notify_prestadores_whatsapp()
RETURNS TRIGGER AS $$
DECLARE
    prestador RECORD;
    message_text TEXT;
BEGIN
    -- Construir mensagem
    message_text := 'Olá profissional! 👋 Temos um novo orçamento na sua área: ' || NEW.titulo || 
                   '. Acesse o sistema para enviar sua proposta: https://seudominio.com/orcamentos 💼✨';
    
    -- Buscar prestadores da mesma categoria e região
    FOR prestador IN 
        SELECT p.id, p.whatsapp, p.nome
        FROM profissionais p
        WHERE p.categoria_slug = (SELECT slug FROM categories WHERE id = NEW.categoria_id)
          AND p.uf = NEW.uf
          AND p.cidade = NEW.cidade
          AND p.ativo = true
          AND p.whatsapp IS NOT NULL
          AND p.whatsapp != ''
    LOOP
        -- Inserir notificação na fila
        INSERT INTO whatsapp_notifications (
            solicitacao_id,
            prestador_id,
            whatsapp_number,
            message,
            status
        ) VALUES (
            NEW.id,
            prestador.id,
            prestador.whatsapp,
            message_text,
            'pending'
        );
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Criar trigger para enviar notificações automaticamente
DROP TRIGGER IF EXISTS trigger_notify_prestadores ON public.solicitacoes_orcamento;
CREATE TRIGGER trigger_notify_prestadores
    AFTER INSERT ON public.solicitacoes_orcamento
    FOR EACH ROW
    EXECUTE FUNCTION notify_prestadores_whatsapp();
