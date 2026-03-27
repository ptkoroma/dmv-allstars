-- DMV All Stars FC — Auth Trigger
-- Run this in Supabase SQL Editor AFTER supabase-schema.sql and supabase-admin-update.sql

-- ─────────────────────────────────────────────────────────────
-- 1. Auto-create a profile row when a new auth user signs up
--    This prevents orphaned auth users if the client-side insert fails
-- ─────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name, email, status, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    new.email,
    'pending',
    'player'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- 2. Keep profiles.email in sync if user changes their email
-- ─────────────────────────────────────────────────────────────
create or replace function public.sync_profile_email()
returns trigger as $$
begin
  if new.email <> old.email then
    update public.profiles set email = new.email where id = new.id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row execute function public.sync_profile_email();
