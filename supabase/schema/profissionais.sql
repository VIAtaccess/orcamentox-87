
-- Schema para Profissionais/Prestadores de Serviço
-- Enable required extension for UUID if not already enabled
create extension if not exists pgcrypto;

-- Tabela de Profissionais
create table if not exists public.profissionais (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null unique,
  whatsapp text,
  cnpj text,
  endereco text,
  uf text,
  cidade text,
  descricao text,
  foto_url text,
  categoria_slug text references public.categories(slug),
  subcategoria_slug text references public.subcategories(slug),
  ativo boolean default true,
  verificado boolean default false,
  nota_media decimal(2,1) default 0,
  total_avaliacoes integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Índices para performance
create index if not exists idx_profissionais_email on public.profissionais(email);
create index if not exists idx_profissionais_whatsapp on public.profissionais(whatsapp);
create index if not exists idx_profissionais_cnpj on public.profissionais(cnpj);
create index if not exists idx_profissionais_uf_cidade on public.profissionais(uf, cidade);
create index if not exists idx_profissionais_ativo on public.profissionais(ativo);
create index if not exists idx_profissionais_categoria on public.profissionais(categoria_slug);
create index if not exists idx_profissionais_subcategoria on public.profissionais(subcategoria_slug);

-- Trigger para updated_at
create trigger update_profissionais_updated_at
  before update on public.profissionais
  for each row execute function update_updated_at_column();

-- Row Level Security
alter table public.profissionais enable row level security;

-- Políticas de segurança
create policy "Allow public read profissionais"
  on public.profissionais for select
  using (true);

create policy "Allow public insert profissionais"
  on public.profissionais for insert
  with check (true);

create policy "Allow authenticated update profissionais"
  on public.profissionais for update
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated delete profissionais"
  on public.profissionais for delete
  to authenticated
  using (true);
