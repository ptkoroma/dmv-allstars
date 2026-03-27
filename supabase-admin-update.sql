-- DMV All Stars FC — Admin Role Update
-- Run this in your Supabase SQL Editor AFTER the initial schema

-- ─────────────────────────────────────────────────────────────
-- Add role column to profiles
-- ─────────────────────────────────────────────────────────────
alter table public.profiles
  add column if not exists role text default 'player'
  check (role in ('player', 'admin'));

-- ─────────────────────────────────────────────────────────────
-- Helper function: check if current user is admin
-- security definer runs with elevated privileges (avoids circular RLS)
-- ─────────────────────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- ─────────────────────────────────────────────────────────────
-- Drop old restrictive policies and replace with role-aware ones
-- ─────────────────────────────────────────────────────────────
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

-- SELECT: own profile OR admin sees all
create policy "Users can view own profile or admin sees all"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

-- UPDATE: own profile OR admin updates all
create policy "Users can update own profile or admin updates all"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

-- ─────────────────────────────────────────────────────────────
-- Promote a user to admin
-- Replace the email below with your admin email, then run this
-- ─────────────────────────────────────────────────────────────
-- update public.profiles set role = 'admin' where email = 'your@email.com';
