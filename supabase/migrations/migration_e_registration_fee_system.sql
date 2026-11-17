-- MIGRATION E: One-Time ₹999 Registration Fee System & Extended Status Support

-- 1. Extend payments status check constraint
alter table if exists public.payments
  drop constraint if exists payments_status_check;

alter table if exists public.payments
  add constraint payments_status_check
  check (status in ('pending', 'processing', 'successful', 'failed', 'refund_pending', 'refunded'));

-- 2. Extend memberships status check constraint
alter table if exists public.memberships
  drop constraint if exists memberships_status_check;

alter table if exists public.memberships
  add constraint memberships_status_check
  check (status in ('pending', 'active', 'expired', 'cancelled', 'refund_pending', 'refunded', 'suspended'));

-- 3. Add verification and audit columns to payments
alter table if exists public.payments
  add column if not exists verified_at timestamptz,
  add column if not exists gateway_signature text,
  add column if not exists notes jsonb not null default '{}'::jsonb,
  add column if not exists updated_at timestamptz not null default now();

-- 4. Add activation timestamp to memberships
alter table if exists public.memberships
  add column if not exists activated_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

-- 5. Prevent duplicate active memberships for the same user (Database-enforced idempotency)
create unique index if not exists memberships_single_active_owner_idx
  on public.memberships (owner_id)
  where (status = 'active');

-- 6. Add indexes for performance & audit reporting
create index if not exists payments_owner_status_idx
  on public.payments (owner_id, status, created_at desc);

create index if not exists payments_order_id_idx
  on public.payments (order_id);

create index if not exists payments_gateway_payment_id_idx
  on public.payments (gateway_payment_id);

-- 7. Upsert the canonical One-Time Registration Fee plan (₹999 = 99900 paise, lifetime duration)
insert into public.membership_plans (name, description, price_paise, duration_days, benefits, active)
values (
  'One-Time Registration',
  'Lifetime member registration for Settibalija community matrimonial introductions. Pay once, no annual renewal, no recurring charges.',
  99900,
  null,
  '[
    "Lifetime matrimonial profile publication in community directory",
    "Full access to search and view community profiles",
    "Send and receive introduction interests",
    "Mutual family contact requests",
    "Verified member photo access",
    "Dedicated community office verification and support"
  ]'::jsonb,
  true
)
on conflict (name) do update
set description = excluded.description,
    price_paise = 99900,
    duration_days = null,
    benefits = excluded.benefits,
    active = true,
    updated_at = now();

-- 8. Retire any legacy recurring plans from member availability
update public.membership_plans
set active = false
where name in ('Free', 'Premium');

-- 9. Atomic, server-side registration fee activation procedure
create or replace function public.activate_registration_membership(
  p_user_id uuid,
  p_order_id text,
  p_payment_id text,
  p_amount_paise integer default 99900,
  p_signature text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_plan_id uuid;
  v_membership_id uuid;
  v_payment_id uuid;
  v_existing_active uuid;
begin
  -- 1. Idempotency guard: if member already has active membership, return it
  select id into v_existing_active
  from public.memberships
  where owner_id = p_user_id and status = 'active'
  limit 1;

  if v_existing_active is not null then
    return v_existing_active;
  end if;

  -- 2. Find the canonical active registration plan
  select id into v_plan_id
  from public.membership_plans
  where name = 'One-Time Registration' and active = true
  limit 1;

  if v_plan_id is null then
    select id into v_plan_id
    from public.membership_plans
    where price_paise = 99900 and active = true
    limit 1;
  end if;

  -- 3. Atomically insert active membership
  insert into public.memberships (
    owner_id, plan_id, status, starts_at, expires_at, activated_at, created_at, updated_at
  )
  values (
    p_user_id, v_plan_id, 'active', now(), null, now(), now(), now()
  )
  returning id into v_membership_id;

  -- 4. Record or update payment record
  if p_order_id is not null and exists (select 1 from public.payments where order_id = p_order_id) then
    update public.payments
    set membership_id = v_membership_id,
        gateway_payment_id = coalesce(p_payment_id, gateway_payment_id),
        gateway_signature = coalesce(p_signature, gateway_signature),
        amount_paise = coalesce(p_amount_paise, amount_paise),
        status = 'successful',
        verified_at = now(),
        updated_at = now()
    where order_id = p_order_id
    returning id into v_payment_id;
  else
    insert into public.payments (
      owner_id, membership_id, order_id, gateway_payment_id,
      gateway_signature, amount_paise, currency, status, verified_at, created_at, updated_at
    )
    values (
      p_user_id, v_membership_id, p_order_id, p_payment_id,
      p_signature, coalesce(p_amount_paise, 99900), 'INR', 'successful', now(), now(), now()
    )
    returning id into v_payment_id;
  end if;

  -- 5. Record in audit log
  insert into public.audit_logs (
    actor_id, action, entity_type, entity_id, metadata
  )
  values (
    p_user_id,
    'membership_registration_activated',
    'memberships',
    v_membership_id,
    jsonb_build_object(
      'order_id', p_order_id,
      'gateway_payment_id', p_payment_id,
      'amount_paise', coalesce(p_amount_paise, 99900),
      'currency', 'INR'
    )
  );

  -- 6. Send in-app notification to member
  insert into public.notifications (
    owner_id, title, message
  )
  values (
    p_user_id,
    'Registration Fee Verified · Membership Active',
    'Your one-time registration fee of ₹999 has been verified. Your Settibalija Matrimony membership is now active.'
  );

  return v_membership_id;
end;
$$;

-- Security: Restrict activation to service_role only (cannot be executed by public, anon, or authenticated)
revoke all on function public.activate_registration_membership(uuid, text, text, integer, text) from public, anon, authenticated;
grant execute on function public.activate_registration_membership(uuid, text, text, integer, text) to service_role;

-- 10. Staff RLS policies for management
drop policy if exists "Staff update payments" on public.payments;
create policy "Staff update payments"
  on public.payments for update to authenticated
  using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));

drop policy if exists "Staff update memberships" on public.memberships;
create policy "Staff update memberships"
  on public.memberships for update to authenticated
  using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));

