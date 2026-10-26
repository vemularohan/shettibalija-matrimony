-- Additive policies, RPCs, and seed data. Safe to re-run.

create or replace function public.is_staff(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(_user_id, 'admin') or public.has_role(_user_id, 'moderator');
$$;
grant execute on function public.is_staff(uuid) to authenticated;

drop policy if exists "Staff read all matrimonial profiles" on public.matrimonial_profiles;
create policy "Staff read all matrimonial profiles"
  on public.matrimonial_profiles for select to authenticated
  using (public.is_staff(auth.uid()));

drop policy if exists "Staff update matrimonial profiles" on public.matrimonial_profiles;
create policy "Staff update matrimonial profiles"
  on public.matrimonial_profiles for update to authenticated
  using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));

drop policy if exists "Staff read photo metadata" on public.profile_photos;
create policy "Staff read photo metadata"
  on public.profile_photos for select to authenticated
  using (public.is_staff(auth.uid()));

drop policy if exists "Staff read all reports" on public.profile_reports;
create policy "Staff read all reports"
  on public.profile_reports for select to authenticated
  using (public.is_staff(auth.uid()));

drop policy if exists "Staff update reports" on public.profile_reports;
create policy "Staff update reports"
  on public.profile_reports for update to authenticated
  using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));

drop policy if exists "Staff read memberships" on public.memberships;
create policy "Staff read memberships"
  on public.memberships for select to authenticated
  using (public.is_staff(auth.uid()));

drop policy if exists "Staff read payments" on public.payments;
create policy "Staff read payments"
  on public.payments for select to authenticated
  using (public.is_staff(auth.uid()));

drop policy if exists "Staff read all profiles" on public.profiles;
create policy "Staff read all profiles"
  on public.profiles for select to authenticated
  using (public.is_staff(auth.uid()));

drop policy if exists "Staff read support requests" on public.support_requests;
create policy "Staff read support requests"
  on public.support_requests for select to authenticated
  using (public.is_staff(auth.uid()));

drop policy if exists "Approved partner preferences are readable" on public.partner_preferences;
create policy "Approved partner preferences are readable"
  on public.partner_preferences for select to anon, authenticated
  using (
    exists (
      select 1 from public.matrimonial_profiles p
      where p.id = profile_id
        and p.moderation_status = 'approved'
        and p.visibility = 'visible'
    )
  );

create or replace function public.profile_photo_status(p_profile_id uuid)
returns table (has_photos boolean, photo_visibility text)
language sql
stable
security definer
set search_path = public
as $$
  select
    exists (select 1 from public.profile_photos ph where ph.profile_id = p_profile_id) as has_photos,
    mp.photo_visibility
  from public.matrimonial_profiles mp
  where mp.id = p_profile_id
    and (
      (mp.moderation_status = 'approved' and mp.visibility = 'visible')
      or mp.owner_id = auth.uid()
      or public.is_staff(auth.uid())
    );
$$;
grant execute on function public.profile_photo_status(uuid) to anon, authenticated;

create or replace function public.viewer_can_open_photos(p_profile_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  rec public.matrimonial_profiles%rowtype;
  has_membership boolean;
begin
  select * into rec from public.matrimonial_profiles where id = p_profile_id;
  if not found then return false; end if;
  if rec.owner_id = auth.uid() then return true; end if;
  if public.is_staff(auth.uid()) then return true; end if;
  if auth.uid() is null then return false; end if;
  if rec.moderation_status <> 'approved' or rec.visibility <> 'visible' then return false; end if;
  if rec.photo_visibility <> 'members' then return false; end if;
  select exists (
    select 1 from public.memberships m
    where m.owner_id = auth.uid()
      and m.status = 'active'
      and (m.expires_at is null or m.expires_at > now())
  ) into has_membership;
  return has_membership;
end;
$$;
grant execute on function public.viewer_can_open_photos(uuid) to anon, authenticated;

create or replace function public.activate_free_membership(p_plan_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  plan public.membership_plans%rowtype;
  membership_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  select * into plan from public.membership_plans where id = p_plan_id and active = true;
  if not found then
    raise exception 'Plan is not available';
  end if;
  if plan.price_paise is not null and plan.price_paise > 0 then
    raise exception 'This plan requires payment';
  end if;
  insert into public.memberships (owner_id, plan_id, status, starts_at, expires_at)
  values (
    auth.uid(),
    plan.id,
    'active',
    now(),
    case when plan.duration_days is null then null else now() + make_interval(days => plan.duration_days) end
  )
  returning id into membership_id;
  insert into public.payments (owner_id, membership_id, amount_paise, currency, status)
  values (auth.uid(), membership_id, 0, 'INR', 'successful');
  insert into public.notifications (owner_id, title, message)
  values (auth.uid(), 'Payment Successful', 'Your free membership is now active.');
  return membership_id;
end;
$$;
grant execute on function public.activate_free_membership(uuid) to authenticated;

create or replace function public.notify_interest()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recipient uuid;
  sender_name text;
begin
  select owner_id into recipient from public.matrimonial_profiles where id = new.to_profile_id;
  select coalesce(nullif(full_name, ''), 'A member') into sender_name from public.profiles where id = new.from_user_id;
  if recipient is not null then
    insert into public.notifications (owner_id, title, message)
    values (recipient, 'New Interest', sender_name || ' expressed interest in your profile.');
  end if;
  return new;
end;
$$;

drop trigger if exists interests_notify on public.interests;
create trigger interests_notify after insert on public.interests
for each row execute function public.notify_interest();

create or replace function public.notify_interest_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'accepted' and old.status is distinct from new.status then
    insert into public.notifications (owner_id, title, message)
    values (new.from_user_id, 'Interest Accepted', 'Your interest was accepted. You can continue the conversation through the platform.');
  end if;
  return new;
end;
$$;

drop trigger if exists interests_notify_update on public.interests;
create trigger interests_notify_update after update on public.interests
for each row execute function public.notify_interest_update();

create or replace function public.notify_contact_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recipient uuid;
begin
  select owner_id into recipient from public.matrimonial_profiles where id = new.to_profile_id;
  if recipient is not null then
    insert into public.notifications (owner_id, title, message)
    values (recipient, 'Contact Request', 'A member requested access to your contact details.');
  end if;
  return new;
end;
$$;

drop trigger if exists contact_requests_notify on public.contact_requests;
create trigger contact_requests_notify after insert on public.contact_requests
for each row execute function public.notify_contact_request();

create or replace function public.notify_contact_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'accepted' and old.status is distinct from new.status then
    insert into public.notifications (owner_id, title, message)
    values (new.from_user_id, 'Contact Request Accepted', 'Your contact request was accepted.');
  end if;
  return new;
end;
$$;

drop trigger if exists contact_requests_notify_update on public.contact_requests;
create trigger contact_requests_notify_update after update on public.contact_requests
for each row execute function public.notify_contact_update();

insert into public.membership_plans (name, description, price_paise, duration_days, benefits, active)
values
  (
    'Free',
    'Create a profile, appear in search after approval, and shortlist profiles.',
    0,
    null,
    '["Create and edit your profile","Search approved profiles","Shortlist profiles","Express interest"]'::jsonb,
    true
  ),
  (
    'Premium',
    'Photo access for authorized members and priority support from the community office.',
    299900,
    90,
    '["Everything in Free","View authorized member photos","Contact requests","Priority support"]'::jsonb,
    true
  )
on conflict (name) do update
set description = excluded.description,
    price_paise = excluded.price_paise,
    duration_days = excluded.duration_days,
    benefits = excluded.benefits,
    active = true,
    updated_at = now();
