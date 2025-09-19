-- Align profissionais table with app expectations for prestador cadastro
-- Add missing columns if they do not exist
alter table public.profissionais add column if not exists email text;
alter table public.profissionais add column if not exists whatsapp text;
alter table public.profissionais add column if not exists cnpj text;
alter table public.profissionais add column if not exists endereco text;
alter table public.profissionais add column if not exists ativo boolean default true;

-- Optional helpful indexes
create index if not exists idx_profissionais_cnpj on public.profissionais(cnpj);
create index if not exists idx_profissionais_email on public.profissionais(email);
