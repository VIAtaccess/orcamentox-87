-- Add uf and cidade to clientes and profissionais tables
alter table if exists public.clientes
  add column if not exists uf text,
  add column if not exists cidade text;

alter table if exists public.profissionais
  add column if not exists uf text,
  add column if not exists cidade text;

-- Optional: indexes for filtering
create index if not exists idx_clientes_uf_cidade on public.clientes(uf, cidade);
create index if not exists idx_profissionais_uf_cidade on public.profissionais(uf, cidade);
