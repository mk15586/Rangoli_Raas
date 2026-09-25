create extension if not exists pgcrypto;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  ticket_id text not null unique,
  ticket_token text not null,
  order_id text not null unique,
  payment_id text not null unique,
  payment_status text not null default 'captured',
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  tier_id text not null,
  tier_name text not null,
  quantity integer not null,
  total_attendees integer not null,
  unit_price numeric(10, 2) not null,
  total_paid numeric(10, 2) not null,
  event_date text not null,
  venue text not null,
  gate_entry text not null,
  issued_at timestamptz not null,
  verify_url text not null,
  email_delivery jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.bookings enable row level security;

create index if not exists bookings_customer_email_idx
  on public.bookings (customer_email);

create index if not exists bookings_payment_status_idx
  on public.bookings (payment_status);
