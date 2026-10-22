-- Complete member discovery and interaction workflows. Apply after 0002.

-- Keep profile codes stable while giving new profiles the public SBM identifier.
alter table public.matrimonial_profiles
  alter column profile_code set default ('SBM' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)));

alter table public.matrimonial_profiles
  drop constraint if exists matrimonial_profiles_moderation_status_check,
  drop constraint if exists matrimonial_profiles_visibility_check;

alter table public.matrimonial_profiles
  add constraint matrimonial_profiles_moderation_status_check
    check (moderation_status in ('pending', 'approved', 'rejected', 'blocked', 'suspended')),
  add constraint matrimonial_profiles_visibility_check
    check (visibility in ('visible', 'hidden', 'paused')),
  add column if not exists star text,
  add column if not exists rashi text,
  add column if not exists horoscope_available boolean not null default false,
  add column if not exists profile_views_enabled boolean not null default true,
  add column if not exists has_profile_photo boolean not null default false,
  add column if not exists created_for text not null default 'self',
  add column if not exists about_me text,
  add column if not exists citizenship text,
  add column if not exists verified_at timestamptz,
  add column if not exists last_active_at timestamptz;

-- A missing horoscope answer is different from an explicit "no" answer.
alter table public.matrimonial_profiles
  alter column horoscope_available drop not null,
  alter column horoscope_available drop default;

-- A profile may be saved as a private draft, but it must not be published
-- without the member's recorded declaration.
update public.matrimonial_profiles
set visibility = 'hidden'
where visibility = 'visible' and declaration_accepted is not true;
alter table public.matrimonial_profiles
  drop constraint if exists matrimonial_profiles_publication_consent_check,
  add constraint matrimonial_profiles_publication_consent_check
    check (visibility <> 'visible' or declaration_accepted is true);

drop policy if exists "Members update own profile and return it to moderation" on public.matrimonial_profiles;
create policy "Members update their own profile"
  on public.matrimonial_profiles for update to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid() and moderation_status in ('pending', 'approved'));

create or replace function public.guard_member_profile_updates()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if public.is_staff(auth.uid()) or auth.uid() is null or old.owner_id <> auth.uid() then
    return new;
  end if;
  if new.owner_id is distinct from old.owner_id or
     new.profile_code is distinct from old.profile_code or
     new.verified_at is distinct from old.verified_at then
    raise exception 'Only staff can change profile ownership, Matrimony ID, or review status.' using errcode = 'insufficient_privilege';
  end if;
  if new.moderation_status is distinct from old.moderation_status and new.moderation_status <> 'pending' then
    raise exception 'Only staff can change profile moderation status.' using errcode = 'insufficient_privilege';
  end if;
  if old.moderation_status = 'approved' and new.moderation_status = 'approved' and (
    new.display_name is distinct from old.display_name or
    new.gender is distinct from old.gender or new.age is distinct from old.age or
    new.height_cm is distinct from old.height_cm or new.marital_status is distinct from old.marital_status or
    new.community is distinct from old.community or new.mother_tongue is distinct from old.mother_tongue or
    new.native_place is distinct from old.native_place or new.city is distinct from old.city or
    new.state is distinct from old.state or new.education is distinct from old.education or
    new.occupation is distinct from old.occupation or new.family_summary is distinct from old.family_summary or
    new.about_me is distinct from old.about_me or new.gothram is distinct from old.gothram or
    new.star is distinct from old.star or new.rashi is distinct from old.rashi or
    new.horoscope_available is distinct from old.horoscope_available or
    new.food_habit is distinct from old.food_habit or new.time_of_birth is distinct from old.time_of_birth or
    new.place_of_birth is distinct from old.place_of_birth or new.designation is distinct from old.designation or
    new.job_location is distinct from old.job_location or new.salary_amount is distinct from old.salary_amount or
    new.salary_currency is distinct from old.salary_currency or new.salary_period is distinct from old.salary_period or
    new.employment_type is distinct from old.employment_type or new.created_for is distinct from old.created_for or
    new.languages is distinct from old.languages or new.citizenship is distinct from old.citizenship or
    new.community_profession is distinct from old.community_profession or new.present_location is distinct from old.present_location or
    new.complexion is distinct from old.complexion or new.smoking_habit is distinct from old.smoking_habit or
    new.drinking_habit is distinct from old.drinking_habit
  ) then
    raise exception 'Submit profile edits for review before publishing them.' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;
drop trigger if exists guard_member_profile_updates_before_write on public.matrimonial_profiles;
create trigger guard_member_profile_updates_before_write before update on public.matrimonial_profiles
  for each row execute function public.guard_member_profile_updates();

alter table public.partner_preferences
  add column if not exists preferred_food_habit text,
  add column if not exists preferred_gothram text,
  add column if not exists preferred_star text,
  add column if not exists preferred_rashi text,
  add column if not exists preferred_community text,
  add column if not exists preferred_citizenship text,
  add column if not exists family_preferences text,
  add column if not exists updated_at timestamptz not null default now();

alter table public.shortlisted_profiles add column if not exists note text;
grant update on public.shortlisted_profiles to authenticated;

alter table public.interests add column if not exists from_profile_id uuid;
update public.interests i set from_profile_id = (
  select p.id from public.matrimonial_profiles p
  where p.owner_id = i.from_user_id order by p.created_at desc limit 1
) where from_profile_id is null;
do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'interests_from_profile_id_fkey'
  ) then
    alter table public.interests add constraint interests_from_profile_id_fkey
      foreign key (from_profile_id) references public.matrimonial_profiles(id) on delete set null;
  end if;
end $$;
drop policy if exists "Members send interests as themselves" on public.interests;
create policy "Members send interests as themselves"
  on public.interests for insert to authenticated
  with check (
    from_user_id = auth.uid() and exists (
      select 1 from public.matrimonial_profiles sender
      where sender.id = from_profile_id and sender.owner_id = auth.uid()
    ) and exists (
      select 1 from public.matrimonial_profiles target
      where target.id = to_profile_id and target.owner_id <> auth.uid()
        and target.moderation_status = 'approved' and target.visibility = 'visible'
    )
  );

alter table public.contact_requests add column if not exists from_profile_id uuid;
update public.contact_requests cr set from_profile_id = (
  select p.id from public.matrimonial_profiles p
  where p.owner_id = cr.from_user_id order by p.created_at desc limit 1
) where cr.from_profile_id is null;
do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'contact_requests_from_profile_id_fkey'
  ) then
    alter table public.contact_requests add constraint contact_requests_from_profile_id_fkey
      foreign key (from_profile_id) references public.matrimonial_profiles(id) on delete set null;
  end if;
end $$;
drop policy if exists "Members create contact requests as themselves" on public.contact_requests;
create policy "Members create contact requests as themselves"
  on public.contact_requests for insert to authenticated
  with check (
    from_user_id = auth.uid() and exists (
      select 1 from public.matrimonial_profiles sender
      where sender.id = from_profile_id and sender.owner_id = auth.uid()
    ) and exists (
      select 1 from public.matrimonial_profiles target
      where target.id = to_profile_id and target.owner_id <> auth.uid()
        and target.moderation_status = 'approved' and target.visibility = 'visible'
    )
  );

-- Blocks are enforced by the database so clients cannot bypass them by
-- calling the interaction tables directly. Check both the sender's block list
-- and blocks made by the recipient.
create or replace function public.member_interaction_is_blocked(
  p_from_user_id uuid,
  p_from_profile_id uuid,
  p_to_profile_id uuid
)
returns boolean language plpgsql stable security definer set search_path = public
as $$
declare
  target_owner uuid;
begin
  if auth.uid() is null then return true; end if;

  select owner_id into target_owner
  from public.matrimonial_profiles
  where id = p_to_profile_id;

  -- Do not expose block relationships to accounts unrelated to this interaction.
  if p_from_user_id is distinct from auth.uid() and target_owner is distinct from auth.uid() then
    return false;
  end if;

  -- The helper is executable by members for row-level filtering, but must not
  -- reveal block relationships for arbitrary pairs with no interaction.
  if not exists (
    select 1 from public.interests i
    where i.from_user_id = p_from_user_id
      and i.from_profile_id is not distinct from p_from_profile_id
      and i.to_profile_id = p_to_profile_id
    union all
    select 1 from public.contact_requests cr
    where cr.from_user_id = p_from_user_id
      and cr.from_profile_id is not distinct from p_from_profile_id
      and cr.to_profile_id = p_to_profile_id
  ) then
    return false;
  end if;

  return exists (
    select 1 from public.blocked_profiles b
    where (b.owner_id = p_from_user_id and b.profile_id = p_to_profile_id)
       or (b.owner_id = target_owner and b.profile_id = p_from_profile_id)
  );
end;
$$;
revoke all on function public.member_interaction_is_blocked(uuid, uuid, uuid) from public, anon;
grant execute on function public.member_interaction_is_blocked(uuid, uuid, uuid) to authenticated;

drop policy if exists "Participants read interests" on public.interests;
create policy "Participants read unblocked interests"
  on public.interests for select to authenticated
  using (
    (from_user_id = auth.uid() or exists (
      select 1 from public.matrimonial_profiles p
      where p.id = to_profile_id and p.owner_id = auth.uid()
    )) and not public.member_interaction_is_blocked(from_user_id, from_profile_id, to_profile_id)
  );
drop policy if exists "Contact request participants read requests" on public.contact_requests;
create policy "Participants read unblocked contact requests"
  on public.contact_requests for select to authenticated
  using (
    (from_user_id = auth.uid() or exists (
      select 1 from public.matrimonial_profiles p
      where p.id = to_profile_id and p.owner_id = auth.uid()
    )) and not public.member_interaction_is_blocked(from_user_id, from_profile_id, to_profile_id)
  );

create or replace function public.guard_blocked_member_interactions()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  target_owner uuid;
begin
  if auth.uid() is null or public.is_staff(auth.uid()) then
    return new;
  end if;

  select owner_id into target_owner
  from public.matrimonial_profiles
  where id = new.to_profile_id;

  if exists (
    select 1 from public.blocked_profiles b
    where (b.owner_id = new.from_user_id and b.profile_id = new.to_profile_id)
       or (b.owner_id = target_owner and b.profile_id = new.from_profile_id)
  ) then
    raise exception 'This connection is unavailable because one of the profiles has been blocked.'
      using errcode = 'insufficient_privilege';
  end if;
  return new;
end;
$$;
drop trigger if exists guard_blocked_interest_insert on public.interests;
create trigger guard_blocked_interest_insert before insert on public.interests
  for each row execute function public.guard_blocked_member_interactions();
drop trigger if exists guard_blocked_contact_request_insert on public.contact_requests;
create trigger guard_blocked_contact_request_insert before insert on public.contact_requests
  for each row execute function public.guard_blocked_member_interactions();

-- Interaction participants and their message cannot be rewritten while the
-- recipient is deciding whether to accept. Members may only decide pending
-- requests; service-role and staff workflows remain available.
create or replace function public.guard_member_interaction_status()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if public.is_staff(auth.uid()) or auth.uid() is null then
    return new;
  end if;
  if tg_table_name = 'interests' then
    if new.status = 'accepted' and
       public.member_interaction_is_blocked(new.from_user_id, new.from_profile_id, new.to_profile_id) then
      raise exception 'This interest cannot be accepted because one of the profiles has been blocked.'
        using errcode = 'insufficient_privilege';
    end if;
    if new.from_user_id is distinct from old.from_user_id or
       new.from_profile_id is distinct from old.from_profile_id or
       new.to_profile_id is distinct from old.to_profile_id or
       new.message is distinct from old.message or
       new.created_at is distinct from old.created_at or
       new.status not in ('accepted', 'declined') or old.status <> 'pending' then
      raise exception 'Only the recipient can accept or decline a pending interest.' using errcode = 'insufficient_privilege';
    end if;
  elsif tg_table_name = 'contact_requests' then
    if new.status = 'accepted' and
       public.member_interaction_is_blocked(new.from_user_id, new.from_profile_id, new.to_profile_id) then
      raise exception 'This contact request cannot be accepted because one of the profiles has been blocked.'
        using errcode = 'insufficient_privilege';
    end if;
    if new.from_user_id is distinct from old.from_user_id or
       new.from_profile_id is distinct from old.from_profile_id or
       new.to_profile_id is distinct from old.to_profile_id or
       new.message is distinct from old.message or
       new.created_at is distinct from old.created_at or
       new.status not in ('accepted', 'declined') or old.status <> 'pending' then
      raise exception 'Only the recipient can accept or decline a pending contact request.' using errcode = 'insufficient_privilege';
    end if;
  end if;
  return new;
end;
$$;
drop trigger if exists guard_interest_status_update on public.interests;
create trigger guard_interest_status_update before update on public.interests
  for each row execute function public.guard_member_interaction_status();
drop trigger if exists guard_contact_request_status_update on public.contact_requests;
create trigger guard_contact_request_status_update before update on public.contact_requests
  for each row execute function public.guard_member_interaction_status();

-- The old 0002 view selected mp.*. Recreate it with a deliberate public-safe
-- column list; account IDs, declaration data and private documents stay private.
drop view if exists public.approved_matrimonial_profiles cascade;
create view public.approved_matrimonial_profiles
  with (security_barrier = true, security_invoker = false) as
select
  mp.id,
  mp.profile_code,
  mp.display_name,
  mp.gender,
  mp.age,
  mp.height_cm,
  mp.marital_status,
  mp.community,
  mp.mother_tongue,
  mp.native_place,
  mp.city,
  mp.state,
  mp.education,
  mp.occupation,
  mp.family_summary,
  mp.about_me,
  mp.languages,
  mp.photo_visibility,
  mp.time_of_birth,
  mp.place_of_birth,
  mp.designation,
  mp.community_profession,
  mp.job_location,
  mp.employment_type,
  mp.complexion,
  mp.gothram,
  mp.present_location,
  mp.food_habit,
  mp.smoking_habit,
  mp.drinking_habit,
  mp.star,
  mp.rashi,
  mp.horoscope_available,
  mp.has_profile_photo,
  mp.citizenship,
  mp.verified_at,
  mp.last_active_at,
  mp.created_at,
  mp.updated_at
from public.matrimonial_profiles mp
where mp.moderation_status = 'approved' and mp.visibility = 'visible'
  and (
    auth.uid() is null or not exists (
      select 1 from public.blocked_profiles b
      where b.owner_id = auth.uid() and b.profile_id = mp.id
    )
  )
  and (
    auth.uid() is null or not exists (
      select 1 from public.blocked_profiles b
      where b.owner_id = mp.owner_id and exists (
        select 1 from public.matrimonial_profiles viewer
        where viewer.owner_id = auth.uid() and viewer.id = b.profile_id
      )
    )
  );
revoke select on public.approved_matrimonial_profiles from anon;
grant select on public.approved_matrimonial_profiles to authenticated;

-- Family details and partner preferences contain sensitive household and
-- matching information. Public profile discovery uses only the safe view
-- above; these tables remain owner/staff-only.
drop policy if exists "Members read family details for visible profiles" on public.family_details;
drop policy if exists "Approved partner preferences are readable" on public.partner_preferences;
create policy "Owners and staff read family details"
  on public.family_details for select to authenticated
  using (auth.uid() = owner_id or public.is_staff(auth.uid()));
create policy "Owners and staff read partner preferences"
  on public.partner_preferences for select to authenticated
  using (auth.uid() = owner_id or public.is_staff(auth.uid()));

create or replace function public.queue_family_details_for_review()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  target_profile_id uuid := coalesce(new.profile_id, old.profile_id);
begin
  update public.matrimonial_profiles p
  set moderation_status = 'pending', updated_at = now()
  where p.id = target_profile_id and p.owner_id = auth.uid()
    and p.moderation_status = 'approved'
    and (
      tg_op = 'INSERT' or new.father_name is distinct from old.father_name or
      new.father_profession is distinct from old.father_profession or
      new.mother_name is distinct from old.mother_name or
      new.mother_profession is distinct from old.mother_profession or
      new.brothers_count is distinct from old.brothers_count or
      new.sisters_count is distinct from old.sisters_count or
      new.brothers_details is distinct from old.brothers_details or
      new.sisters_details is distinct from old.sisters_details or
      new.family_type is distinct from old.family_type or
      new.family_location is distinct from old.family_location or
      new.family_details is distinct from old.family_details
    );
  return new;
end;
$$;
drop trigger if exists family_details_submit_for_review on public.family_details;
create trigger family_details_submit_for_review before insert or update on public.family_details
  for each row execute function public.queue_family_details_for_review();

create or replace function public.sync_profile_photo_presence()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  affected_profile uuid;
begin
  affected_profile := coalesce(new.profile_id, old.profile_id);
  update public.matrimonial_profiles p
  set has_profile_photo = exists (
    select 1 from public.profile_photos ph where ph.profile_id = affected_profile
  )
  where p.id = affected_profile;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;
drop trigger if exists profile_photo_presence_changed on public.profile_photos;
create trigger profile_photo_presence_changed after insert or update or delete on public.profile_photos
  for each row execute function public.sync_profile_photo_presence();

-- Saved searches are private member data. The trigger enforces the product
-- limits on the server as well as in the user interface.
create table if not exists public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (length(trim(name)) between 2 and 80),
  criteria jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, name)
);
alter table public.saved_searches enable row level security;
grant select, insert, update, delete on public.saved_searches to authenticated;
drop policy if exists "Members manage their saved searches" on public.saved_searches;
create policy "Members manage their saved searches"
  on public.saved_searches for all to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create or replace function public.enforce_saved_search_limit()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  max_saved integer := 3;
begin
  if tg_op = 'INSERT' then
    if exists (
      select 1 from public.memberships m
      join public.membership_plans p on p.id = m.plan_id
      where m.owner_id = new.owner_id and m.status = 'active'
        and (m.expires_at is null or m.expires_at > now())
        and upper(p.name) like '%ELITE%'
    ) then
      max_saved := 50;
    elsif exists (
      select 1 from public.memberships m
      join public.membership_plans p on p.id = m.plan_id
      where m.owner_id = new.owner_id and m.status = 'active'
        and (m.expires_at is null or m.expires_at > now())
        and upper(p.name) like '%PREMIUM%'
    ) then
      max_saved := 20;
    end if;
    if (select count(*) from public.saved_searches s where s.owner_id = new.owner_id) >= max_saved then
      raise exception 'Your plan allows up to % saved searches.', max_saved using errcode = 'check_violation';
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;
drop trigger if exists saved_search_limit_before_write on public.saved_searches;
create trigger saved_search_limit_before_write before insert or update on public.saved_searches
  for each row execute function public.enforce_saved_search_limit();

-- Members may block and ignore independently; ignored profiles can be restored
-- later, while blocks remain an explicit safety control.
create table if not exists public.ignored_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  profile_id uuid not null references public.matrimonial_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (owner_id, profile_id)
);
alter table public.ignored_profiles enable row level security;
grant select, insert, delete on public.ignored_profiles to authenticated;
drop policy if exists "Members manage their own ignored profiles" on public.ignored_profiles;
create policy "Members manage their own ignored profiles"
  on public.ignored_profiles for all to authenticated
  using (owner_id = auth.uid()) with check (
    owner_id = auth.uid() and exists (
      select 1 from public.matrimonial_profiles p
      where p.id = profile_id and p.owner_id <> auth.uid()
    )
  );

-- Profile views contain only profile IDs and timestamps. A SECURITY DEFINER
-- function records one visit per visitor/profile/day; RLS lets only the viewed
-- member read their own visitor list.
create table if not exists public.profile_views (
  id uuid primary key default gen_random_uuid(),
  viewer_profile_id uuid not null references public.matrimonial_profiles(id) on delete cascade,
  viewed_profile_id uuid not null references public.matrimonial_profiles(id) on delete cascade,
  viewed_on date not null default current_date,
  created_at timestamptz not null default now(),
  unique (viewer_profile_id, viewed_profile_id, viewed_on),
  check (viewer_profile_id <> viewed_profile_id)
);
alter table public.profile_views enable row level security;
grant select on public.profile_views to authenticated;
drop policy if exists "Members read views of their own profile" on public.profile_views;
create policy "Members read views of their own profile"
  on public.profile_views for select to authenticated
  using (exists (
    select 1 from public.matrimonial_profiles p
    where p.id = viewed_profile_id and p.owner_id = auth.uid()
  ));
drop policy if exists "Members read their own view history" on public.profile_views;
create policy "Members read their own view history"
  on public.profile_views for select to authenticated
  using (exists (
    select 1 from public.matrimonial_profiles p
    where p.id = viewer_profile_id and p.owner_id = auth.uid()
  ));

create or replace function public.record_profile_view(p_viewed_profile_id uuid)
returns void language plpgsql security definer set search_path = public
as $$
declare
  viewer_id uuid;
begin
  if auth.uid() is null then return; end if;
  select id into viewer_id from public.matrimonial_profiles
    where owner_id = auth.uid() order by created_at desc limit 1;
  if viewer_id is null or viewer_id = p_viewed_profile_id then return; end if;
  if not exists (
    select 1 from public.matrimonial_profiles
    where id = p_viewed_profile_id and moderation_status = 'approved'
      and visibility = 'visible' and profile_views_enabled = true
  ) then return; end if;
  insert into public.profile_views (viewer_profile_id, viewed_profile_id)
  values (viewer_id, p_viewed_profile_id)
  on conflict (viewer_profile_id, viewed_profile_id, viewed_on) do nothing;
end;
$$;
grant execute on function public.record_profile_view(uuid) to authenticated;

-- Contact details are released only after the profile owner accepts a request,
-- explicitly enables member contact, and the requesting member has an active
-- paid membership. The account phone remains private in the profiles table.
create or replace function public.get_accepted_contact_phone(p_target_profile_id uuid)
returns text language plpgsql stable security definer set search_path = public
as $$
declare
  contact_phone text;
begin
  if auth.uid() is null then
    raise exception 'Sign in to view an approved contact.' using errcode = 'insufficient_privilege';
  end if;
  if not exists (
    select 1
    from public.contact_requests cr
    join public.matrimonial_profiles target on target.id = cr.to_profile_id
    join public.profile_private_details pd on pd.profile_id = target.id
    where cr.from_user_id = auth.uid() and cr.to_profile_id = p_target_profile_id
      and cr.status = 'accepted' and target.moderation_status = 'approved'
      and pd.phone_visibility = 'approved_contact'
  ) then
    raise exception 'The profile owner has not approved contact access.' using errcode = 'insufficient_privilege';
  end if;
  if exists (
    select 1
    from public.contact_requests cr
    join public.matrimonial_profiles target on target.id = cr.to_profile_id
    where cr.from_user_id = auth.uid() and cr.to_profile_id = p_target_profile_id
      and cr.status = 'accepted'
      and (
        exists (
          select 1 from public.blocked_profiles b
          where b.owner_id = auth.uid() and b.profile_id = target.id
        ) or exists (
          select 1 from public.blocked_profiles b
          where b.owner_id = target.owner_id and b.profile_id = cr.from_profile_id
        )
      )
  ) then
    raise exception 'Contact access is unavailable while either member has blocked the other.'
      using errcode = 'insufficient_privilege';
  end if;
  if not exists (
    select 1
    from public.memberships m
    join public.membership_plans mp on mp.id = m.plan_id
    where m.owner_id = auth.uid() and m.status = 'active'
      and (m.expires_at is null or m.expires_at > now())
      and coalesce(mp.price_paise, 0) > 0
  ) then
    raise exception 'An active paid membership is required to view contact details.' using errcode = 'insufficient_privilege';
  end if;
  select p.phone into contact_phone
  from public.matrimonial_profiles target
  join public.profiles p on p.id = target.owner_id
  where target.id = p_target_profile_id;
  return nullif(trim(contact_phone), '');
end;
$$;
revoke all on function public.get_accepted_contact_phone(uuid) from public, anon;
grant execute on function public.get_accepted_contact_phone(uuid) to authenticated;

-- Activity notifications are written server-side so they cannot be spoofed by
-- clients. Notification messages avoid exposing contact information.
create or replace function public.notify_interest_activity()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  recipient_id uuid;
begin
  select owner_id into recipient_id from public.matrimonial_profiles where id = new.to_profile_id;
  if tg_op = 'INSERT' and recipient_id is not null then
    insert into public.notifications (owner_id, title, message)
    values (recipient_id, 'New interest received', 'A member is interested in your matrimonial profile.');
  elsif tg_op = 'UPDATE' and new.status = 'accepted' and old.status is distinct from new.status then
    insert into public.notifications (owner_id, title, message)
    values (new.from_user_id, 'Interest accepted', 'Your interest was accepted. You can continue through the connection and contact options.');
  end if;
  return new;
end;
$$;
drop trigger if exists interests_notify_members on public.interests;
drop trigger if exists interests_notify on public.interests;
drop trigger if exists interests_notify_update on public.interests;
create trigger interests_notify_members after insert or update of status on public.interests
  for each row execute function public.notify_interest_activity();

create or replace function public.notify_profile_moderation()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if new.moderation_status is distinct from old.moderation_status then
    if new.moderation_status = 'approved' then
      insert into public.notifications (owner_id, title, message)
      values (new.owner_id, 'Profile approved', 'Your profile is now active and can appear in search results.');
      if new.verified_at is null then new.verified_at := now(); end if;
    elsif new.moderation_status = 'rejected' then
      insert into public.notifications (owner_id, title, message)
      values (new.owner_id, 'Profile needs changes', 'Please review your profile and contact support for the requested corrections.');
    elsif new.moderation_status in ('blocked', 'suspended') then
      insert into public.notifications (owner_id, title, message)
      values (new.owner_id, 'Profile status changed', 'Your profile is currently unavailable. Contact support if you need help.');
    end if;
  end if;
  return new;
end;
$$;
drop trigger if exists matrimonial_profile_moderation_notification on public.matrimonial_profiles;
create trigger matrimonial_profile_moderation_notification before update of moderation_status on public.matrimonial_profiles
  for each row execute function public.notify_profile_moderation();

-- Staff-only notes stay out of the member profile table and public profile view.
create table if not exists public.profile_admin_notes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.matrimonial_profiles(id) on delete cascade,
  staff_id uuid not null references public.profiles(id) on delete cascade,
  note text not null check (length(trim(note)) between 1 and 2000),
  created_at timestamptz not null default now()
);
alter table public.profile_admin_notes enable row level security;
grant select, insert on public.profile_admin_notes to authenticated;
drop policy if exists "Staff manage profile moderation notes" on public.profile_admin_notes;
create policy "Staff manage profile moderation notes"
  on public.profile_admin_notes for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()) and staff_id = auth.uid());

create index if not exists profile_views_viewed_profile_idx on public.profile_views (viewed_profile_id, created_at desc);
create index if not exists saved_searches_owner_idx on public.saved_searches (owner_id, updated_at desc);
create index if not exists ignored_profiles_owner_idx on public.ignored_profiles (owner_id, profile_id);

-- Success stories are published only after a real couple has shared and
-- approved their account; no seeded testimonials or success counts.
create table if not exists public.success_stories (
  id uuid primary key default gen_random_uuid(),
  couple_names text not null check (length(trim(couple_names)) between 2 and 120),
  city text,
  marriage_year smallint check (marriage_year between 1900 and 2200),
  story text not null check (length(trim(story)) between 20 and 4000),
  photo_url text,
  permission_confirmed boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.success_stories add column if not exists permission_confirmed boolean not null default false;
create or replace function public.guard_success_story_publication()
returns trigger language plpgsql set search_path = public
as $$
begin
  if new.is_published and not new.permission_confirmed then
    raise exception 'Confirm the couple approved publication before publishing this story.' using errcode = 'check_violation';
  end if;
  new.updated_at := now();
  return new;
end;
$$;
drop trigger if exists success_story_publication_guard on public.success_stories;
create trigger success_story_publication_guard before insert or update on public.success_stories
  for each row execute function public.guard_success_story_publication();
alter table public.success_stories enable row level security;
grant select on public.success_stories to anon, authenticated;
grant insert, update, delete on public.success_stories to authenticated;
drop policy if exists "Visitors read published success stories" on public.success_stories;
create policy "Visitors read published success stories"
  on public.success_stories for select to anon, authenticated using (is_published = true);
drop policy if exists "Staff manage success stories" on public.success_stories;
create policy "Staff manage success stories"
  on public.success_stories for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
