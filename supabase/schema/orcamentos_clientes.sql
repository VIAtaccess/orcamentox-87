
-- Schema para Solicitações de Orçamento e Clientes
-- Enable required extension for UUID if not already enabled
create extension if not exists pgcrypto;

-- Tabela de Clientes
create table if not exists public.clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null unique,
  whatsapp text,
  endereco text,
  uf text,
  cidade text,
  tipo_pessoa text check (tipo_pessoa in ('fisica', 'juridica')) default 'fisica',
  cpf_cnpj text,
  data_nascimento date,
  foto_url text,
  ativo boolean default true,
  aceita_marketing boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabela de Solicitações de Orçamento
create table if not exists public.solicitacoes_orcamento (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references public.clientes(id) on delete set null,
  categoria_id uuid references public.categories(id) on delete cascade,
  subcategoria_id uuid references public.subcategories(id) on delete set null,
  titulo text not null,
  descricao text not null,
  endereco text not null,
  uf text not null,
  cidade text not null,
  urgencia text check (urgencia in ('baixa', 'media', 'alta')) default 'media',
  orcamento_estimado text,
  max_propostas integer default 5,
  status text check (status in ('ativa', 'em_andamento', 'finalizada', 'cancelada')) default 'ativa',
  -- Dados de contato temporários (para usuários não cadastrados)
  nome_cliente text,
  email_cliente text,
  whatsapp_cliente text,
  -- Metadados
  prazo_resposta timestamptz default (now() + interval '7 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabela de Propostas
create table if not exists public.propostas (
  id uuid primary key default gen_random_uuid(),
  solicitacao_id uuid not null references public.solicitacoes_orcamento(id) on delete cascade,
  prestador_id uuid not null, -- referencia para tabela de prestadores
  valor_proposto decimal(10,2),
  prazo_estimado text,
  descricao_proposta text not null,
  materiais_inclusos boolean default false,
  garantia text,
  status text check (status in ('enviada', 'aceita', 'rejeitada', 'expirada')) default 'enviada',
  data_expiracao timestamptz default (now() + interval '30 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabela de Avaliações
create table if not exists public.avaliacoes (
  id uuid primary key default gen_random_uuid(),
  solicitacao_id uuid not null references public.solicitacoes_orcamento(id) on delete cascade,
  prestador_id uuid not null,
  cliente_id uuid references public.clientes(id) on delete set null,
  nota integer check (nota >= 1 and nota <= 5) not null,
  comentario text,
  recomenda boolean default true,
  created_at timestamptz not null default now()
);

-- Índices para performance
create index if not exists idx_clientes_email on public.clientes(email);
create index if not exists idx_clientes_whatsapp on public.clientes(whatsapp);
create index if not exists idx_solicitacoes_categoria on public.solicitacoes_orcamento(categoria_id);
create index if not exists idx_solicitacoes_subcategoria on public.solicitacoes_orcamento(subcategoria_id);
create index if not exists idx_solicitacoes_status on public.solicitacoes_orcamento(status);
create index if not exists idx_solicitacoes_uf_cidade on public.solicitacoes_orcamento(uf, cidade);
create index if not exists idx_propostas_solicitacao on public.propostas(solicitacao_id);
create index if not exists idx_propostas_prestador on public.propostas(prestador_id);
create index if not exists idx_avaliacoes_prestador on public.avaliacoes(prestador_id);

-- Função para atualizar updated_at automaticamente
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers para updated_at
create trigger update_clientes_updated_at
  before update on public.clientes
  for each row execute function update_updated_at_column();

create trigger update_solicitacoes_updated_at
  before update on public.solicitacoes_orcamento
  for each row execute function update_updated_at_column();

create trigger update_propostas_updated_at
  before update on public.propostas
  for each row execute function update_updated_at_column();

-- Row Level Security
alter table public.clientes enable row level security;
alter table public.solicitacoes_orcamento enable row level security;
alter table public.propostas enable row level security;
alter table public.avaliacoes enable row level security;

-- Políticas de segurança para leitura pública (necessário para funcionalidade básica)
create policy "Allow public read clientes"
  on public.clientes for select
  using (true);

create policy "Allow public read solicitacoes"
  on public.solicitacoes_orcamento for select
  using (true);

create policy "Allow public read propostas"
  on public.propostas for select
  using (true);

create policy "Allow public read avaliacoes"
  on public.avaliacoes for select
  using (true);

-- Políticas para inserção (permitir inserção pública para facilitar cadastros)
create policy "Allow public insert clientes"
  on public.clientes for insert
  with check (true);

create policy "Allow public insert solicitacoes"
  on public.solicitacoes_orcamento for insert
  with check (true);

create policy "Allow public insert propostas"
  on public.propostas for insert
  with check (true);

create policy "Allow public insert avaliacoes"
  on public.avaliacoes for insert
  with check (true);

-- Políticas para atualização/exclusão apenas para usuários autenticados
create policy "Allow authenticated update clientes"
  on public.clientes for update
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated delete clientes"
  on public.clientes for delete
  to authenticated
  using (true);

create policy "Allow authenticated update solicitacoes"
  on public.solicitacoes_orcamento for update
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated delete solicitacoes"
  on public.solicitacoes_orcamento for delete
  to authenticated
  using (true);

create policy "Allow authenticated update propostas"
  on public.propostas for update
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated delete propostas"
  on public.propostas for delete
  to authenticated
  using (true);
