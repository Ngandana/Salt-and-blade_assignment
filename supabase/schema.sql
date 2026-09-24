-- Run this once in Supabase: SQL Editor > New query > paste > Run.
create extension if not exists btree_gist;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  service_id text not null,
  barber_id text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  notes text,
  promo_code text,
  total integer not null,
  created_at timestamptz not null default now(),
  -- The real double-booking guard: one barber can never have overlapping appointments.
  constraint no_overlapping_bookings exclude using gist (
    barber_id with =,
    tstzrange(start_at, end_at) with &&
  )
);

create index if not exists bookings_start_idx on public.bookings (start_at);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Lock both tables to the public. Only the server (service role key) can read and write.
alter table public.bookings enable row level security;
alter table public.contact_messages enable row level security;
