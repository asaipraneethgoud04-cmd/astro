-- Appointment requests and contact messages.
-- Run this once in the Supabase SQL editor for project drzkaogmktbrgoojnguw (safe to run again).
-- Visitors can only create rows. Only the signed-in admin can read and update them.

-- ─── Appointment requests (Book Appointment page) ───────────────────────────
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  second_name text check (second_name is null or char_length(second_name) <= 120),
  email text not null check (char_length(email) between 5 and 200 and email like '%@%'),
  phone text not null check (char_length(trim(phone)) between 6 and 40),
  city text not null check (char_length(trim(city)) between 2 and 120),
  service text not null check (char_length(trim(service)) between 2 and 160),
  message text check (message is null or char_length(message) <= 2000),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'scheduled', 'completed', 'cancelled')),
  admin_note text check (admin_note is null or char_length(admin_note) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists appointments_status_created_idx
  on public.appointments (status, created_at desc);

-- ─── Contact messages (Contact page) ────────────────────────────────────────
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  email text not null check (char_length(email) between 5 and 200 and email like '%@%'),
  phone text check (phone is null or char_length(phone) <= 40),
  subject text check (subject is null or char_length(subject) <= 160),
  message text not null check (char_length(trim(message)) between 10 and 2000),
  status text not null default 'new'
    check (status in ('new', 'replied', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_messages_status_created_idx
  on public.contact_messages (status, created_at desc);

-- ─── Keep updated_at current ────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists appointments_touch_updated_at on public.appointments;
create trigger appointments_touch_updated_at
  before update on public.appointments
  for each row execute function public.touch_updated_at();

drop trigger if exists contact_messages_touch_updated_at on public.contact_messages;
create trigger contact_messages_touch_updated_at
  before update on public.contact_messages
  for each row execute function public.touch_updated_at();

-- ─── Row level security ─────────────────────────────────────────────────────
alter table public.appointments enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "public can request appointments" on public.appointments;
drop policy if exists "admin can read appointments" on public.appointments;
drop policy if exists "admin can update appointments" on public.appointments;

create policy "public can request appointments"
  on public.appointments
  for insert
  to anon, authenticated
  with check (status = 'new' and admin_note is null);

create policy "admin can read appointments"
  on public.appointments
  for select
  to authenticated
  using (true);

create policy "admin can update appointments"
  on public.appointments
  for update
  to authenticated
  using (true)
  with check (status in ('new', 'contacted', 'scheduled', 'completed', 'cancelled'));

drop policy if exists "public can send contact messages" on public.contact_messages;
drop policy if exists "admin can read contact messages" on public.contact_messages;
drop policy if exists "admin can update contact messages" on public.contact_messages;

create policy "public can send contact messages"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (status = 'new');

create policy "admin can read contact messages"
  on public.contact_messages
  for select
  to authenticated
  using (true);

create policy "admin can update contact messages"
  on public.contact_messages
  for update
  to authenticated
  using (true)
  with check (status in ('new', 'replied', 'closed'));

-- Visitors can insert only; they never read these tables.
revoke all on public.appointments from anon;
revoke all on public.contact_messages from anon;
grant insert on public.appointments to anon;
grant insert on public.contact_messages to anon;
grant select, insert, update on public.appointments to authenticated;
grant select, insert, update on public.contact_messages to authenticated;
