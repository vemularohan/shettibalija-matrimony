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
