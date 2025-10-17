-- Tables: users (reference auth.users), businesses, photos, reviews

-- Ensure pgcrypto for gen_random_uuid
create extension if not exists pgcrypto;

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text,
  phone text,
  website text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  country text,
  latitude double precision not null,
  longitude double precision not null,
  owner_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  url text not null,
  caption text,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  author_name text,
  created_at timestamptz not null default now()
);

create index if not exists idx_businesses_name on public.businesses (name);
create index if not exists idx_businesses_category on public.businesses (category);
create index if not exists idx_businesses_city_state_country on public.businesses (city, state, country);

-- RLS
alter table public.businesses enable row level security;
alter table public.photos enable row level security;
alter table public.reviews enable row level security;

-- Recreate policies idempotently (Supabase/Postgres may not support IF NOT EXISTS here)
drop policy if exists "public_read_businesses" on public.businesses;
drop policy if exists "owner_manage_businesses" on public.businesses;
drop policy if exists "owner_insert_businesses" on public.businesses;
drop policy if exists "public_read_photos" on public.photos;
drop policy if exists "owner_manage_photos" on public.photos;
drop policy if exists "public_read_reviews" on public.reviews;
drop policy if exists "anyone_insert_reviews" on public.reviews;
drop policy if exists "authenticated_insert_reviews" on public.reviews;

create policy "public_read_businesses" on public.businesses for select using (true);
create policy "owner_manage_businesses" on public.businesses for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owner_insert_businesses" on public.businesses for insert with check (auth.uid() = owner_id);

create policy "public_read_photos" on public.photos for select using (true);
create policy "owner_manage_photos" on public.photos for all using (
  exists (select 1 from public.businesses b where b.id = photos.business_id and b.owner_id = auth.uid())
) with check (
  exists (select 1 from public.businesses b where b.id = photos.business_id and b.owner_id = auth.uid())
);

create policy "public_read_reviews" on public.reviews for select using (true);
create policy "authenticated_insert_reviews" on public.reviews for insert with check (auth.role() = 'authenticated');


