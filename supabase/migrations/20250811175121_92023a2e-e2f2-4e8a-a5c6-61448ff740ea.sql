-- Create required extension
create extension if not exists pgcrypto;

-- =============================================
-- Categories
-- =============================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_subcategories_category_id on public.subcategories(category_id);
create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_subcategories_slug on public.subcategories(slug);

alter table public.categories enable row level security;
alter table public.subcategories enable row level security;

create policy if not exists "Public read categories"
  on public.categories for select
  using (true);

create policy if not exists "Public read subcategories"
  on public.subcategories for select
  using (true);

create policy if not exists "Authenticated write categories"
  on public.categories for all to authenticated
  using (true) with check (true);

create policy if not exists "Authenticated write subcategories"
  on public.subcategories for all to authenticated
  using (true) with check (true);

-- update_updated_at trigger (function expected to exist per project context)
create trigger if not exists trg_categories_updated_at
before update on public.categories
for each row execute function public.update_updated_at_column();

create trigger if not exists trg_subcategories_updated_at
before update on public.subcategories
for each row execute function public.update_updated_at_column();

-- =============================================
-- Profissionais (used by Prestadores page)
-- =============================================
create table if not exists public.profissionais (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  categoria text,
  categoria_slug text,
  cidade text,
  uf text,
  avaliacao numeric(3,2),
  descricao text,
  foto_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profissionais_categoria on public.profissionais(categoria);
create index if not exists idx_profissionais_cidade on public.profissionais(cidade);
create index if not exists idx_profissionais_uf_cidade on public.profissionais(uf, cidade);

alter table public.profissionais enable row level security;

create policy if not exists "Public read profissionais"
  on public.profissionais for select
  using (true);

create policy if not exists "Authenticated write profissionais"
  on public.profissionais for all to authenticated
  using (true) with check (true);

create trigger if not exists trg_profissionais_updated_at
before update on public.profissionais
for each row execute function public.update_updated_at_column();

-- =============================================
-- Seed: Categories & Subcategories (idempotent)
-- =============================================
insert into public.categories (name, slug, description, icon, color)
values
  ('Reforma e Construção','reforma-construcao','Pedreiros, marceneiros, arquitetos','Wrench','bg-blue-500'),
  ('Serviços Elétricos','servicos-eletricos','Eletricistas, instalações','Zap','bg-yellow-500'),
  ('Encanamento','encanamento','Encanadores, hidráulica','Droplets','bg-blue-600'),
  ('Pintura','pintura','Pintores, decoração','Paintbrush','bg-green-500'),
  ('Limpeza','limpeza','Faxina, limpeza pós-obra','Sparkles','bg-purple-500'),
  ('Beleza e Estética','beleza-estetica','Cabeleireiros, manicures','Scissors','bg-pink-500'),
  ('Automotivo','automotivo','Mecânicos, funilaria','Car','bg-gray-600'),
  ('Tecnologia','tecnologia','Técnicos, desenvolvedores','Monitor','bg-indigo-500'),
  ('Serviços Domésticos','servicos-domesticos','Diaristas, cuidadoras, babás','Home','bg-orange-500'),
  ('Jardinagem e Paisagismo','jardinagem-paisagismo','Jardineiros, poda, gramados','Leaf','bg-emerald-500'),
  ('Climatização','climatizacao','Ar-condicionado, refrigeração','Snowflake','bg-cyan-600'),
  ('Marcenaria e Móveis','marcenaria-moveis','Projetos sob medida','Hammer','bg-amber-700'),
  ('Segurança','seguranca','CFTV, alarmes, controles','Shield','bg-slate-700'),
  ('Fotografia e Vídeo','foto-video','Coberturas, edições','Camera','bg-fuchsia-600'),
  ('Eventos e Entretenimento','eventos-entretenimento','Buffet, DJ, decoração','Music','bg-red-500'),
  ('Aulas e Treinamentos','aulas-treinamentos','Aulas particulares e cursos','Book','bg-teal-600')
on conflict (slug) do nothing;

-- Subcategories inserts (using category slug lookup) with conflict handling
-- Reforma e Construção
insert into public.subcategories (category_id, name, slug, description)
select id, 'Pedreiro','reforma-construcao-pedreiro','Serviços de alvenaria geral' from public.categories where slug='reforma-construcao'
on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug)
select id, 'Marcenaria','reforma-construcao-marcenaria' from public.categories where slug='reforma-construcao'
on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug)
select id, 'Alvenaria','reforma-construcao-alvenaria' from public.categories where slug='reforma-construcao'
on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug)
select id, 'Gesso e Drywall','reforma-construcao-gesso' from public.categories where slug='reforma-construcao'
on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug)
select id, 'Impermeabilização','reforma-construcao-impermeabilizacao' from public.categories where slug='reforma-construcao'
on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug)
select id, 'Colocação de Pisos','reforma-construcao-pisos' from public.categories where slug='reforma-construcao'
on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug)
select id, 'Telhados','reforma-construcao-telhados' from public.categories where slug='reforma-construcao'
on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug)
select id, 'Arquitetura','reforma-construcao-arquitetura' from public.categories where slug='reforma-construcao'
on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug)
select id, 'Engenharia','reforma-construcao-engenharia' from public.categories where slug='reforma-construcao'
on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug)
select id, 'Serralheria','reforma-construcao-serralheria' from public.categories where slug='reforma-construcao'
on conflict (slug) do nothing;

-- Serviços Elétricos
insert into public.subcategories (category_id, name, slug) select id, 'Instalações Elétricas','eletrica-instalacoes' from public.categories where slug='servicos-eletricos' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Manutenção Elétrica','eletrica-manutencao' from public.categories where slug='servicos-eletricos' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Quadro de Força','eletrica-quadro-de-forca' from public.categories where slug='servicos-eletricos' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Iluminação','eletrica-iluminacao' from public.categories where slug='servicos-eletricos' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Aterramento','eletrica-aterramento' from public.categories where slug='servicos-eletricos' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Padrão de Entrada','eletrica-padrao-entrada' from public.categories where slug='servicos-eletricos' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Automação Residencial','eletrica-automacao' from public.categories where slug='servicos-eletricos' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Cabeamento','eletrica-cabeamento' from public.categories where slug='servicos-eletricos' on conflict (slug) do nothing;

-- Encanamento
insert into public.subcategories (category_id, name, slug) select id, 'Desentupimento','encanamento-desentupimento' from public.categories where slug='encanamento' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Instalação de Louças','encanamento-loucas' from public.categories where slug='encanamento' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Vazamentos','encanamento-vazamentos' from public.categories where slug='encanamento' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Aquecedor a Gás','encanamento-aquecedor-gas' from public.categories where slug='encanamento' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Caixa d’Água','encanamento-caixa-dagua' from public.categories where slug='encanamento' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Hidráulica Geral','encanamento-hidraulica' from public.categories where slug='encanamento' on conflict (slug) do nothing;

-- Pintura
insert into public.subcategories (category_id, name, slug) select id, 'Pintura Residencial','pintura-residencial' from public.categories where slug='pintura' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Pintura Comercial','pintura-comercial' from public.categories where slug='pintura' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Textura','pintura-textura' from public.categories where slug='pintura' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Grafiato','pintura-grafiato' from public.categories where slug='pintura' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Papel de Parede','pintura-papel-de-parede' from public.categories where slug='pintura' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Massa Corrida','pintura-massa-corrida' from public.categories where slug='pintura' on conflict (slug) do nothing;

-- Limpeza
insert into public.subcategories (category_id, name, slug) select id, 'Pós-Obra','limpeza-pos-obra' from public.categories where slug='limpeza' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Residencial','limpeza-residencial' from public.categories where slug='limpeza' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Comercial','limpeza-comercial' from public.categories where slug='limpeza' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Estofados','limpeza-estofados' from public.categories where slug='limpeza' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Janelas e Vidros','limpeza-vidros' from public.categories where slug='limpeza' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Jardinagem','limpeza-jardinagem' from public.categories where slug='limpeza' on conflict (slug) do nothing;

-- Beleza e Estética
insert into public.subcategories (category_id, name, slug) select id, 'Cabeleireiro','beleza-cabeleireiro' from public.categories where slug='beleza-estetica' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Manicure e Pedicure','beleza-manicure' from public.categories where slug='beleza-estetica' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Maquiagem','beleza-maquiagem' from public.categories where slug='beleza-estetica' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Depilação','beleza-depilacao' from public.categories where slug='beleza-estetica' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Barbearia','beleza-barbearia' from public.categories where slug='beleza-estetica' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Sobrancelhas','beleza-sobrancelhas' from public.categories where slug='beleza-estetica' on conflict (slug) do nothing;

-- Automotivo
insert into public.subcategories (category_id, name, slug) select id, 'Mecânica Geral','auto-mecanica' from public.categories where slug='automotivo' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Elétrica Automotiva','auto-eletrica' from public.categories where slug='automotivo' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Funilaria e Pintura','auto-funilaria' from public.categories where slug='automotivo' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Troca de Óleo','auto-troca-oleo' from public.categories where slug='automotivo' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Ar-Condicionado','auto-ar-condicionado' from public.categories where slug='automotivo' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Martelinho de Ouro','auto-martelinho' from public.categories where slug='automotivo' on conflict (slug) do nothing;

-- Tecnologia
insert into public.subcategories (category_id, name, slug) select id, 'Suporte Técnico','tech-suporte' from public.categories where slug='tecnologia' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Desenvolvimento Web','tech-dev-web' from public.categories where slug='tecnologia' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Desenvolvimento Mobile','tech-dev-mobile' from public.categories where slug='tecnologia' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Redes e Infra','tech-redes' from public.categories where slug='tecnologia' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Segurança da Informação','tech-seguranca' from public.categories where slug='tecnologia' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Design UX/UI','tech-design' from public.categories where slug='tecnologia' on conflict (slug) do nothing;

-- Serviços Domésticos
insert into public.subcategories (category_id, name, slug) select id, 'Babá','domestico-baba' from public.categories where slug='servicos-domesticos' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Cuidador de Idosos','domestico-cuidador' from public.categories where slug='servicos-domesticos' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Passadeira','domestico-passadeira' from public.categories where slug='servicos-domesticos' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Cozinheira','domestico-cozinheira' from public.categories where slug='servicos-domesticos' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Organização','domestico-organizacao' from public.categories where slug='servicos-domesticos' on conflict (slug) do nothing;

-- Jardinagem e Paisagismo
insert into public.subcategories (category_id, name, slug) select id, 'Poda de Árvores','jardinagem-poda' from public.categories where slug='jardinagem-paisagismo' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Corte de Grama','jardinagem-grama' from public.categories where slug='jardinagem-paisagismo' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Paisagismo','jardinagem-paisagismo' from public.categories where slug='jardinagem-paisagismo' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Irrigação','jardinagem-irrigacao' from public.categories where slug='jardinagem-paisagismo' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Controle de Pragas','jardinagem-pragas' from public.categories where slug='jardinagem-paisagismo' on conflict (slug) do nothing;

-- Climatização
insert into public.subcategories (category_id, name, slug) select id, 'Instalação de Split','clima-instalacao-split' from public.categories where slug='climatizacao' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Manutenção','clima-manutencao' from public.categories where slug='climatizacao' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Higienização','clima-higienizacao' from public.categories where slug='climatizacao' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Refrigeração Comercial','clima-refrigeracao-comercial' from public.categories where slug='climatizacao' on conflict (slug) do nothing;

-- Marcenaria e Móveis
insert into public.subcategories (category_id, name, slug) select id, 'Móveis Planejados','marcenaria-moveis-planejados' from public.categories where slug='marcenaria-moveis' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Restauração','marcenaria-restauracao' from public.categories where slug='marcenaria-moveis' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Portas e Rodapés','marcenaria-portas' from public.categories where slug='marcenaria-moveis' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Montagem de Móveis','marcenaria-montagem' from public.categories where slug='marcenaria-moveis' on conflict (slug) do nothing;

-- Segurança
insert into public.subcategories (category_id, name, slug) select id, 'Câmeras de Segurança','seguranca-cftv' from public.categories where slug='seguranca' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Alarmes','seguranca-alarmes' from public.categories where slug='seguranca' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Cerca Elétrica','seguranca-cerca' from public.categories where slug='seguranca' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Controle de Acesso','seguranca-acesso' from public.categories where slug='seguranca' on conflict (slug) do nothing;

-- Fotografia e Vídeo
insert into public.subcategories (category_id, name, slug) select id, 'Fotografia de Eventos','foto-eventos' from public.categories where slug='foto-video' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Ensaio Fotográfico','foto-ensaio' from public.categories where slug='foto-video' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Filmagem','video-filmagem' from public.categories where slug='foto-video' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Edição','video-edicao' from public.categories where slug='foto-video' on conflict (slug) do nothing;

-- Eventos e Entretenimento
insert into public.subcategories (category_id, name, slug) select id, 'Buffet','eventos-buffet' from public.categories where slug='eventos-entretenimento' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'DJ','eventos-dj' from public.categories where slug='eventos-entretenimento' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Decoração de Eventos','eventos-decoracao' from public.categories where slug='eventos-entretenimento' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Locação de Equipamentos','eventos-locacao' from public.categories where slug='eventos-entretenimento' on conflict (slug) do nothing;

-- Aulas e Treinamentos
insert into public.subcategories (category_id, name, slug) select id, 'Reforço Escolar','aulas-reforco' from public.categories where slug='aulas-treinamentos' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Idiomas','aulas-idiomas' from public.categories where slug='aulas-treinamentos' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Música','aulas-musica' from public.categories where slug='aulas-treinamentos' on conflict (slug) do nothing;
insert into public.subcategories (category_id, name, slug) select id, 'Tecnologia','aulas-tecnologia' from public.categories where slug='aulas-treinamentos' on conflict (slug) do nothing;

-- =============================================
-- Seed: Profissionais (samples for demo)
-- =============================================
insert into public.profissionais (nome, categoria, categoria_slug, cidade, uf, avaliacao, descricao, foto_url) values
  ('João da Silva', 'Eletricista', 'servicos-eletricos', 'São Paulo', 'SP', 4.8, 'Eletricista com 10 anos de experiência em instalações e manutenção residencial e comercial.', 'https://images.unsplash.com/photo-1541577141970-eebc83ebe30a?q=80&w=1200&auto=format&fit=crop'),
  ('Maria Souza', 'Pintora', 'pintura', 'Rio de Janeiro', 'RJ', 4.9, 'Pintura residencial e comercial com acabamento premium. Orçamento sem compromisso.', 'https://images.unsplash.com/photo-1531310197839-ccf54634509b?q=80&w=1200&auto=format&fit=crop'),
  ('Carlos Lima', 'Encanador', 'encanamento', 'Belo Horizonte', 'MG', 4.7, 'Serviços hidráulicos, detecção de vazamentos e desentupimentos.', 'https://images.unsplash.com/photo-1559599101-f09722fb4948?q=80&w=1200&auto=format&fit=crop'),
  ('Ana Pereira', 'Diarista', 'limpeza', 'Curitiba', 'PR', 4.6, 'Limpeza residencial completa e pós-obra com materiais inclusos.', 'https://images.unsplash.com/photo-1489278353717-f64c6ee8a4d2?q=80&w=1200&auto=format&fit=crop'),
  ('Ricardo Santos', 'Marceneiro', 'marcenaria-moveis', 'Porto Alegre', 'RS', 4.8, 'Móveis planejados sob medida, restauração e montagem.', 'https://images.unsplash.com/photo-1542451313056-b7c8e626645f?q=80&w=1200&auto=format&fit=crop'),
  ('Fernanda Costa', 'Técnica de TI', 'tecnologia', 'Salvador', 'BA', 4.5, 'Suporte técnico, redes e configuração de equipamentos.', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop')
  on conflict do nothing;