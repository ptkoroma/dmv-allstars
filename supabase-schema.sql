-- DMV All Stars FC — Supabase Schema
-- Run this in your Supabase project's SQL Editor

-- Enable UUID extension (already enabled by default in Supabase)
-- create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- PROFILES TABLE
-- One row per registered player, linked to auth.users by id
-- ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  first_name      text not null,
  last_name       text not null,
  email           text not null,
  date_of_birth   date,
  phone           text,
  position        text check (position in ('Goalkeeper', 'Defender', 'Midfielder', 'Forward')),
  age_group       text check (age_group in ('U-8', 'U-10', 'U-12', 'U-14', 'U-16', 'U-18', 'Adult')),
  experience_years integer default 0,
  parent_name     text,
  parent_phone    text,
  emergency_contact text,
  status          text default 'pending' check (status in ('pending', 'active', 'inactive')),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Auto-update the updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- Players can only read/update their OWN profile
-- ─────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;

-- SELECT: user can only read their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- INSERT: user can only insert their own profile
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- UPDATE: user can only update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ─────────────────────────────────────────────────────────────
-- GRANT access to authenticated users
-- ─────────────────────────────────────────────────────────────
grant select, insert, update on public.profiles to authenticated;
