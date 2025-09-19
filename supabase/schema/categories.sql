-- Supabase Schema: Categories & Subcategories
-- Enable required extension for UUID if not already enabled
create extension if not exists pgcrypto;

-- Categories table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  color text,
  created_at timestamptz not null default now()
);

-- Subcategories table
create table if not exists public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_subcategories_category_id on public.subcategories(category_id);
create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_subcategories_slug on public.subcategories(slug);

-- Row Level Security (public read)
alter table public.categories enable row level security;
alter table public.subcategories enable row level security;

-- Allow read for anon and authenticated
create policy if not exists "Public read categories"
  on public.categories for select
  using (true);

create policy if not exists "Public read subcategories"
  on public.subcategories for select
  using (true);

-- Optional: allow insert/update/delete only for authenticated users (adjust as needed)
create policy if not exists "Authenticated write categories"
  on public.categories for all to authenticated
  using (true) with check (true);

create policy if not exists "Authenticated write subcategories"
  on public.subcategories for all to authenticated
  using (true) with check (true);
