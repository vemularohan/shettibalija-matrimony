-- Migration: 0005_demo_data_and_account_lifecycle.sql
-- 1. Add is_demo flag to matrimonial_profiles for clean separation of demo seed data from production members.
-- 2. Add account_status to profiles for soft-deactivation and safety suspensions.
-- 3. Expose is_demo in approved_matrimonial_profiles view.
-- 4. Provide deactivate_account() RPC for member self-service account pausing.

alter table if exists public.matrimonial_profiles
  add column if not exists is_demo boolean not null default false;

create index if not exists matrimonial_profiles_is_demo_idx
  on public.matrimonial_profiles (is_demo);

alter table if exists public.profiles
  add column if not exists account_status text not null default 'active'
    check (account_status in ('active', 'deactivated', 'suspended'));

-- Recreate approved_matrimonial_profiles view with is_demo column
drop view if exists public.approved_matrimonial_profiles;

create view public.approved_matrimonial_profiles with (security_barrier = true) as
select
  p.id,
  p.profile_code,
  p.display_name,
  p.gender,
  p.age,
  p.height_cm,
  p.marital_status,
  p.community,
  p.mother_tongue,
  p.native_place,
  p.city,
  p.state,
  p.education,
  p.occupation,
  p.family_summary,
  p.languages,
  p.photo_visibility,
  p.created_at,
  p.verified_at,
  p.last_active_at,
  p.star,
  p.rashi,
  p.gothram,
  p.food_habit,
  p.is_demo,
  (
    select ph.storage_path
    from public.profile_photos ph
    where ph.profile_id = p.id and ph.is_primary = true
    limit 1
  ) as photo_url
from public.matrimonial_profiles p
where p.moderation_status = 'approved'
  and p.visibility = 'visible';

grant select on public.approved_matrimonial_profiles to anon, authenticated;

-- Function to safely deactivate own account and hide profiles from discovery
create or replace function public.deactivate_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = 'insufficient_privilege';
  end if;

  -- 1. Hide matrimonial profiles from discovery
  update public.matrimonial_profiles
  set visibility = 'hidden',
      moderation_status = 'suspended',
      updated_at = now()
  where owner_id = auth.uid();

  -- 2. Mark profile as deactivated
  update public.profiles
  set account_status = 'deactivated',
      updated_at = now()
  where id = auth.uid();
end;
$$;

grant execute on function public.deactivate_account() to authenticated;

-- Function for staff to cleanup all demo profiles in production
create or replace function public.cleanup_demo_profiles()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer := 0;
begin
  if auth.uid() is null or not public.is_staff(auth.uid()) then
    raise exception 'Staff permissions required' using errcode = 'insufficient_privilege';
  end if;

  delete from public.matrimonial_profiles where is_demo = true;
  get diagnostics deleted_count = row_count;

  -- Log action into audit_logs
  insert into public.audit_logs (actor_id, action, entity_type, metadata)
  values (auth.uid(), 'cleanup_demo_profiles', 'matrimonial_profiles', jsonb_build_object('deleted_count', deleted_count));

  return deleted_count;
end;
$$;

grant execute on function public.cleanup_demo_profiles() to authenticated;
