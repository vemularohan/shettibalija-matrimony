create type public.app_role as enum ('admin', 'moderator', 'user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  gender text check (gender in ('bride', 'groom', 'other')),
  account_type text not null default 'self' check (account_type in ('self', 'parent_guardian')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "Members read their own account profile" on public.profiles for select to authenticated using (id = auth.uid());
create policy "Members create their own account profile" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "Members update their own account profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Members read their own role assignments" on public.user_roles for select to authenticated using (user_id = auth.uid());
create function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;
create function public.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, gender, account_type)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), ''),
    case when new.raw_user_meta_data ->> 'gender' in ('bride', 'groom', 'other') then new.raw_user_meta_data ->> 'gender' else null end,
    case when new.raw_user_meta_data ->> 'account_type' = 'parent_guardian' then 'parent_guardian' else 'self' end)
  on conflict (id) do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created_create_profile after insert on auth.users for each row execute function public.handle_new_auth_user();

create table public.matrimonial_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  profile_code text not null unique default ('SB' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  display_name text not null,
  gender text not null check (gender in ('bride', 'groom', 'other')),
  age smallint not null check (age between 18 and 99),
  height_cm smallint,
  marital_status text not null default 'never_married',
  community text not null default 'Shettibalija',
  mother_tongue text not null default 'Telugu',
  native_place text,
  city text,
  state text,
  education text,
  occupation text,
  family_summary text,
  languages text[] not null default '{}',
  visibility text not null default 'hidden' check (visibility in ('visible', 'hidden')),
  photo_visibility text not null default 'hidden' check (photo_visibility in ('members', 'hidden')),
  moderation_status text not null default 'pending' check (moderation_status in ('pending', 'approved', 'rejected', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.matrimonial_profiles to authenticated;
grant all on public.matrimonial_profiles to service_role;
alter table public.matrimonial_profiles enable row level security;
create policy "Members read own matrimonial profile" on public.matrimonial_profiles for select to authenticated using (owner_id = auth.uid());
create policy "Members create own pending matrimonial profile" on public.matrimonial_profiles for insert to authenticated with check (owner_id = auth.uid() and moderation_status = 'pending');
create policy "Members update own profile and return it to moderation" on public.matrimonial_profiles for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid() and moderation_status = 'pending');
create policy "Members delete own matrimonial profile" on public.matrimonial_profiles for delete to authenticated using (owner_id = auth.uid());
create index matrimonial_profiles_search_idx on public.matrimonial_profiles (moderation_status, visibility, gender, age, state, city);
create view public.approved_matrimonial_profiles with (security_barrier = true) as
select id, profile_code, display_name, gender, age, height_cm, marital_status, community, mother_tongue, native_place, city, state, education, occupation, family_summary, languages, photo_visibility, created_at
from public.matrimonial_profiles where moderation_status = 'approved' and visibility = 'visible';
grant select on public.approved_matrimonial_profiles to anon, authenticated;

create table public.profile_private_details (
  profile_id uuid primary key references public.matrimonial_profiles(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  date_of_birth date,
  email text,
  native_place text,
  employer_details text,
  annual_income text,
  father_occupation text,
  mother_occupation text,
  siblings_count smallint check (siblings_count between 0 and 20),
  family_type text,
  family_location text,
  family_description text,
  phone_visibility text not null default 'never' check (phone_visibility in ('never', 'approved_contact')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profile_private_details to authenticated;
grant all on public.profile_private_details to service_role;
alter table public.profile_private_details enable row level security;
create policy "Only owners access private profile details" on public.profile_private_details for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create table public.partner_preferences (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.matrimonial_profiles(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  min_age smallint check (min_age between 18 and 99), max_age smallint check (max_age between 18 and 99),
  min_height_cm smallint, max_height_cm smallint, marital_statuses text[] not null default '{}',
  education text, occupation text, preferred_locations text[] not null default '{}', other_preferences text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (min_age is null or max_age is null or min_age <= max_age)
);
grant select, insert, update, delete on public.partner_preferences to authenticated;
grant all on public.partner_preferences to service_role;
alter table public.partner_preferences enable row level security;
create policy "Only owners access partner preferences" on public.partner_preferences for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create table public.profile_photos (
  id uuid primary key default gen_random_uuid(), profile_id uuid not null references public.matrimonial_profiles(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade, storage_path text not null unique,
  is_primary boolean not null default false, consented boolean not null default false, created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profile_photos to authenticated;
grant all on public.profile_photos to service_role;
alter table public.profile_photos enable row level security;
create policy "Only owners access photo metadata" on public.profile_photos for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create table public.interests (
  id uuid primary key default gen_random_uuid(), from_user_id uuid not null references public.profiles(id) on delete cascade,
  to_profile_id uuid not null references public.matrimonial_profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'withdrawn')),
  message text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (from_user_id, to_profile_id)
);
grant select, insert, update on public.interests to authenticated;
grant all on public.interests to service_role;
alter table public.interests enable row level security;
create policy "Participants read interests" on public.interests for select to authenticated using (from_user_id = auth.uid() or exists (select 1 from public.matrimonial_profiles p where p.id = to_profile_id and p.owner_id = auth.uid()));
create policy "Members send interests as themselves" on public.interests for insert to authenticated with check (from_user_id = auth.uid() and exists (select 1 from public.matrimonial_profiles p where p.id = to_profile_id and p.owner_id <> auth.uid() and p.moderation_status = 'approved' and p.visibility = 'visible'));
create policy "Recipients update interest status" on public.interests for update to authenticated using (exists (select 1 from public.matrimonial_profiles p where p.id = to_profile_id and p.owner_id = auth.uid())) with check (exists (select 1 from public.matrimonial_profiles p where p.id = to_profile_id and p.owner_id = auth.uid()));

create table public.shortlisted_profiles (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id) on delete cascade,
  profile_id uuid not null references public.matrimonial_profiles(id) on delete cascade, created_at timestamptz not null default now(), unique (owner_id, profile_id)
);
grant select, insert, delete on public.shortlisted_profiles to authenticated;
grant all on public.shortlisted_profiles to service_role;
alter table public.shortlisted_profiles enable row level security;
create policy "Members manage their own shortlist" on public.shortlisted_profiles for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid() and exists (select 1 from public.matrimonial_profiles p where p.id = profile_id and p.owner_id <> auth.uid() and p.moderation_status = 'approved' and p.visibility = 'visible'));

create table public.contact_requests (
  id uuid primary key default gen_random_uuid(), from_user_id uuid not null references public.profiles(id) on delete cascade,
  to_profile_id uuid not null references public.matrimonial_profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'cancelled')),
  message text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select, insert, update on public.contact_requests to authenticated;
grant all on public.contact_requests to service_role;
alter table public.contact_requests enable row level security;
create policy "Contact request participants read requests" on public.contact_requests for select to authenticated using (from_user_id = auth.uid() or exists (select 1 from public.matrimonial_profiles p where p.id = to_profile_id and p.owner_id = auth.uid()));
create policy "Members create contact requests as themselves" on public.contact_requests for insert to authenticated with check (from_user_id = auth.uid() and exists (select 1 from public.matrimonial_profiles p where p.id = to_profile_id and p.owner_id <> auth.uid() and p.moderation_status = 'approved' and p.visibility = 'visible'));
create policy "Recipients update contact request status" on public.contact_requests for update to authenticated using (exists (select 1 from public.matrimonial_profiles p where p.id = to_profile_id and p.owner_id = auth.uid())) with check (exists (select 1 from public.matrimonial_profiles p where p.id = to_profile_id and p.owner_id = auth.uid()));

create table public.membership_plans (
  id uuid primary key default gen_random_uuid(), name text not null unique, description text not null default '',
  price_paise integer check (price_paise is null or price_paise >= 0), duration_days integer check (duration_days is null or duration_days > 0),
  benefits jsonb not null default '[]'::jsonb, active boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select on public.membership_plans to anon, authenticated;
grant all on public.membership_plans to service_role;
alter table public.membership_plans enable row level security;
create policy "Visitors read active membership plans" on public.membership_plans for select to anon, authenticated using (active = true);

create table public.memberships (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid references public.membership_plans(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'active', 'expired', 'cancelled', 'refunded')),
  starts_at timestamptz, expires_at timestamptz, created_at timestamptz not null default now()
);
grant select on public.memberships to authenticated;
grant all on public.memberships to service_role;
alter table public.memberships enable row level security;
create policy "Members read their memberships" on public.memberships for select to authenticated using (owner_id = auth.uid());

create table public.payments (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id) on delete cascade,
  membership_id uuid references public.memberships(id) on delete set null, order_id text unique, gateway_payment_id text unique,
  amount_paise integer not null check (amount_paise >= 0), currency text not null default 'INR',
  status text not null default 'pending' check (status in ('pending', 'successful', 'failed', 'refunded')), created_at timestamptz not null default now()
);
grant select on public.payments to authenticated;
grant all on public.payments to service_role;
alter table public.payments enable row level security;
create policy "Members read their payment history" on public.payments for select to authenticated using (owner_id = auth.uid());

create table public.notifications (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null, message text not null, read_at timestamptz, created_at timestamptz not null default now()
);
grant select, update on public.notifications to authenticated;
grant all on public.notifications to service_role;
alter table public.notifications enable row level security;
create policy "Members read and update their own notifications" on public.notifications for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create table public.profile_reports (
  id uuid primary key default gen_random_uuid(), reporter_id uuid not null references public.profiles(id) on delete cascade,
  profile_id uuid not null references public.matrimonial_profiles(id) on delete cascade,
  reason text not null check (length(reason) between 3 and 500), status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(), unique (reporter_id, profile_id)
);
grant select, insert on public.profile_reports to authenticated;
grant all on public.profile_reports to service_role;
alter table public.profile_reports enable row level security;
create policy "Reporters read their own reports" on public.profile_reports for select to authenticated using (reporter_id = auth.uid());
create policy "Members report other profiles" on public.profile_reports for insert to authenticated with check (reporter_id = auth.uid() and exists (select 1 from public.matrimonial_profiles p where p.id = profile_id and p.owner_id <> auth.uid()));

create table public.blocked_profiles (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id) on delete cascade,
  profile_id uuid not null references public.matrimonial_profiles(id) on delete cascade, created_at timestamptz not null default now(), unique (owner_id, profile_id)
);
grant select, insert, delete on public.blocked_profiles to authenticated;
grant all on public.blocked_profiles to service_role;
alter table public.blocked_profiles enable row level security;
create policy "Members manage their own blocks" on public.blocked_profiles for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create table public.support_requests (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null check (length(subject) between 3 and 150), message text not null check (length(message) between 3 and 3000),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved')), created_at timestamptz not null default now()
);
grant select, insert on public.support_requests to authenticated;
grant all on public.support_requests to service_role;
alter table public.support_requests enable row level security;
create policy "Members read their own support requests" on public.support_requests for select to authenticated using (owner_id = auth.uid());
create policy "Members submit support requests for themselves" on public.support_requests for insert to authenticated with check (owner_id = auth.uid());

create index profile_photos_owner_idx on public.profile_photos (owner_id, created_at desc);
create index interests_recipient_idx on public.interests (to_profile_id, status, created_at desc);
create index contact_requests_recipient_idx on public.contact_requests (to_profile_id, status, created_at desc);
create index profile_reports_status_idx on public.profile_reports (status, created_at desc);
create index memberships_owner_expiry_idx on public.memberships (owner_id, expires_at desc);

create policy "Members manage their own private matrimony photos" on storage.objects for all to authenticated using (bucket_id = 'matrimony-photos' and (storage.foldername(name))[1] = auth.uid()::text) with check (bucket_id = 'matrimony-photos' and (storage.foldername(name))[1] = auth.uid()::text);