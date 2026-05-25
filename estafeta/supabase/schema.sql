-- Run this once in the Supabase SQL editor (Dashboard → SQL → New query)
-- to create the table the redelivery form writes to.

create table if not exists public.redelivery_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now()
);

-- The frontend uses the public anon key, so RLS must explicitly allow
-- anonymous inserts on this table.
alter table public.redelivery_requests enable row level security;

drop policy if exists "anon can insert redelivery_requests" on public.redelivery_requests;
create policy "anon can insert redelivery_requests"
  on public.redelivery_requests
  for insert
  to anon
  with check (true);
