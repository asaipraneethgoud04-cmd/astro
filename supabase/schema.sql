-- Run this once in the Supabase SQL editor for your project.
-- Then create one admin user in Authentication → Users (email + password).
-- Turn off public sign-ups in Authentication → Providers so only that user can moderate reviews.

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 80),
  city text not null check (char_length(trim(city)) between 2 and 80),
  quote text not null check (char_length(trim(quote)) between 20 and 600),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.reviews add column if not exists pinned boolean not null default false;

alter table public.reviews enable row level security;

drop policy if exists "public can submit pending reviews" on public.reviews;
drop policy if exists "public can read accepted reviews" on public.reviews;
drop policy if exists "authenticated can read every review" on public.reviews;
drop policy if exists "authenticated can moderate reviews" on public.reviews;

create policy "public can submit pending reviews"
  on public.reviews
  for insert
  to anon, authenticated
  with check (status = 'pending');

create policy "public can read accepted reviews"
  on public.reviews
  for select
  to anon, authenticated
  using (status = 'accepted');

create policy "authenticated can read every review"
  on public.reviews
  for select
  to authenticated
  using (true);

create policy "authenticated can moderate reviews"
  on public.reviews
  for update
  to authenticated
  using (true)
  with check (status in ('pending', 'accepted', 'rejected'));

grant select, insert on public.reviews to anon;
grant select, insert, update on public.reviews to authenticated;
