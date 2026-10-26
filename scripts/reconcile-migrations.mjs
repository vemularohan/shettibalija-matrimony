import postgres from "postgres";
import fs from "node:fs";
import path from "node:path";

// 1. Load .env
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...rest] = trimmed.split("=");
      const val = rest.join("=").replace(/^["']|["']$/g, "");
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const connectionString =
  process.env.LOVABLE_DB_MIGRATION_URL || process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

if (!connectionString) {
  console.log("WAITING_FOR_ENV: LOVABLE_DB_MIGRATION_URL is not yet set in .env.");
  console.log(
    'Please add LOVABLE_DB_MIGRATION_URL="postgresql://..." to .env and run this script.',
  );
  process.exit(1);
}

const sql = postgres(connectionString, {
  ssl: { rejectUnauthorized: false },
  max: 1,
});

export const MIGRATION_A_SQL = `
-- MIGRATION A: Detailed Matrimonial Fields, Family, Horoscope & Preserved Discovery View

-- 1. Extend matrimonial_profiles with structured attributes
alter table if exists public.matrimonial_profiles
  add column if not exists about_me text,
  add column if not exists star text,
  add column if not exists rashi text,
  add column if not exists gothram text,
  add column if not exists food_habit text,
  add column if not exists time_of_birth text,
  add column if not exists place_of_birth text,
  add column if not exists designation text,
  add column if not exists job_location text,
  add column if not exists salary_amount text,
  add column if not exists salary_currency text default 'INR',
  add column if not exists salary_period text default 'annual',
  add column if not exists employment_type text,
  add column if not exists complexion text,
  add column if not exists community_profession text,
  add column if not exists present_location text,
  add column if not exists smoking_habit text,
  add column if not exists drinking_habit text,
  add column if not exists declaration_accepted boolean default false,
  add column if not exists declaration_accepted_at timestamptz,
  add column if not exists verified_at timestamptz,
  add column if not exists last_active_at timestamptz,
  add column if not exists citizenship text default 'Indian',
  add column if not exists has_profile_photo boolean not null default false,
  add column if not exists horoscope_available boolean,
  add column if not exists is_demo boolean not null default false;

create index if not exists matrimonial_profiles_is_demo_idx
  on public.matrimonial_profiles (is_demo);

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

drop policy if exists "Owners manage own horoscope details" on public.horoscope_details;
create policy "Owners manage own horoscope details"
  on public.horoscope_details for all to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "Staff read all horoscope details" on public.horoscope_details;
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

drop policy if exists "Owners manage own family details" on public.family_details;
create policy "Owners manage own family details"
  on public.family_details for all to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "Members read family details for visible profiles" on public.family_details;
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
  add column if not exists preferred_star text,
  add column if not exists preferred_rashi text,
  add column if not exists preferred_community text,
  add column if not exists preferred_citizenship text,
  add column if not exists family_preferences text,
  add column if not exists requirements_text text;

-- 5. Extend profiles table
alter table if exists public.profiles
  add column if not exists account_status text not null default 'active'
    check (account_status in ('active', 'deactivated', 'suspended'));

-- 6. Safely recreate approved_matrimonial_profiles view
-- Preserves security_barrier, all original columns in original order, existing filters, grants
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

-- 7. Account lifecycle RPCs
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

  update public.matrimonial_profiles
  set visibility = 'hidden',
      moderation_status = 'suspended',
      updated_at = now()
  where owner_id = auth.uid();

  update public.profiles
  set account_status = 'deactivated',
      updated_at = now()
  where id = auth.uid();
end;
$$;
grant execute on function public.deactivate_account() to authenticated;

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

  return deleted_count;
end;
$$;
grant execute on function public.cleanup_demo_profiles() to authenticated;
`;

export const MIGRATION_B_SQL = `
-- MIGRATION B: Operational Audit Log Table & RLS Policies

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.profiles(id) on delete restrict,
  action text not null check (length(trim(action)) between 1 and 120),
  entity_type text not null check (length(trim(entity_type)) between 1 and 80),
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_logs enable row level security;
revoke all on public.audit_logs from anon;
grant select on public.audit_logs to authenticated;

drop policy if exists "Staff read audit logs" on public.audit_logs;
create policy "Staff read audit logs"
  on public.audit_logs for select to authenticated
  using (public.is_staff(auth.uid()));

create index if not exists audit_logs_created_at_idx
  on public.audit_logs (created_at desc);
create index if not exists audit_logs_entity_idx
  on public.audit_logs (entity_type, entity_id, created_at desc);
`;

export const MIGRATION_C_SQL = `
-- MIGRATION C: Support Inquiries & Visitor Workflow

alter table if exists public.support_requests
  alter column owner_id drop not null;

alter table if exists public.support_requests
  add column if not exists contact_name text,
  add column if not exists contact_email text,
  add column if not exists contact_phone text,
  add column if not exists ticket_code text default ('REQ-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6))),
  add column if not exists admin_notes text,
  add column if not exists resolved_at timestamptz;

create index if not exists support_requests_status_idx
  on public.support_requests (status, created_at desc);

create index if not exists support_requests_ticket_code_idx
  on public.support_requests (ticket_code);

grant insert on public.support_requests to anon;

drop policy if exists "Visitors submit support inquiries" on public.support_requests;
create policy "Visitors submit support inquiries"
  on public.support_requests for insert to anon
  with check (owner_id is null);

drop policy if exists "Staff update support requests" on public.support_requests;
create policy "Staff update support requests"
  on public.support_requests for update to authenticated
  using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));
`;

async function run() {
  try {
    console.log("🔗 Connecting to database...");
    await sql`SELECT 1`;
    console.log("✅ Database connection verified.\n");

    // Migration A
    console.log("⏳ Applying Migration A (Detailed fields, family, horoscope, view)...");
    await sql.unsafe(MIGRATION_A_SQL);
    console.log("✅ Migration A applied successfully.\n");

    // Migration B
    console.log("⏳ Applying Migration B (Audit log table & RLS)...");
    await sql.unsafe(MIGRATION_B_SQL);
    console.log("✅ Migration B applied successfully.\n");

    // Migration C
    console.log("⏳ Applying Migration C (Support requests workflow & RLS)...");
    await sql.unsafe(MIGRATION_C_SQL);
    console.log("✅ Migration C applied successfully.\n");

    console.log("🎉 All 3 additive migrations completed successfully!");
  } catch (err) {
    console.error("❌ Migration error:", err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

run();
