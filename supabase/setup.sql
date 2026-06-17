-- Run this in Supabase SQL Editor (supabase.com → SQL Editor → New query)

create table if not exists public.waitlist (
  id          uuid        primary key default gen_random_uuid(),
  email       text        not null unique,
  source      text        not null default 'website',
  created_at  timestamptz not null default now()
);

-- Index for ordering by date
create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);

-- RLS: only service role can read; public can insert
alter table public.waitlist enable row level security;

create policy "Public insert" on public.waitlist
  for insert to anon with check (true);

create policy "Service role reads" on public.waitlist
  for select to service_role using (true);
