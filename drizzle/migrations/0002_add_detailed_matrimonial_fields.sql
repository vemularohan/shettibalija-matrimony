-- Migration: 0002_add_detailed_matrimonial_fields.sql
-- Adds detailed matrimonial attributes, horoscope_details, family_details, and extended partner preferences.

-- 1. Extend matrimonial_profiles
alter table if exists public.matrimonial_profiles
  add column if not exists time_of_birth text,
  add column if not exists place_of_birth text,
  add column if not exists designation text,
  add column if not exists job_location text,
  add column if not exists salary_amount text,
  add column if not exists salary_currency text default 'INR',
  add column if not exists salary_period text default 'annual',
  add column if not exists employment_type text,
  add column if not exists complexion text,
  add column if not exists gothram text,
  add column if not exists community_profession text,
  add column if not exists present_location text,
  add column if not exists food_habit text,
  add column if not exists smoking_habit text,
  add column if not exists drinking_habit text,
  add column if not exists declaration_accepted boolean default false,
  add column if not exists declaration_accepted_at timestamptz;

-- 2. Create horoscope_details table
create table if not exists public.horoscope_details (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.matrimonial_profiles(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  horoscope_available boolean default false,
  star text,
  rashi text,
  gothram text,
  horoscope_file_path text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint horoscope_details_profile_id_key unique (profile_id)
);

alter table public.horoscope_details enable row level security;

create policy "Owners manage own horoscope details"
  on public.horoscope_details for all to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Staff read all horoscope details"
  on public.horoscope_details for select to authenticated
  using (public.is_staff(auth.uid()));

-- 3. Create family_details table
create table if not exists public.family_details (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.matrimonial_profiles(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  father_name text,
  father_profession text,
  mother_name text,
  mother_profession text,
  brothers_count integer default 0,
  sisters_count integer default 0,
  brothers_details text,
  sisters_details text,
  family_type text,
  family_location text,
  family_details text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint family_details_profile_id_key unique (profile_id)
);

alter table public.family_details enable row level security;

create policy "Owners manage own family details"
  on public.family_details for all to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Members read family details for visible profiles"
  on public.family_details for select to authenticated
  using (
    auth.uid() = owner_id or
    public.is_staff(auth.uid()) or
    exists (
      select 1 from public.approved_matrimonial_profiles amp
      where amp.id = family_details.profile_id
    )
  );

-- 4. Extend partner_preferences
alter table if exists public.partner_preferences
  add column if not exists preferred_food_habit text,
  add column if not exists preferred_gothram text,
  add column if not exists requirements_text text;

-- 5. Refresh view if exists
create or replace view public.approved_matrimonial_profiles as
  select
    mp.*
  from public.matrimonial_profiles mp
  where mp.moderation_status = 'approved'
    and mp.visibility = 'visible';
