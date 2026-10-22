-- Append-only audit history for staff moderation and operational changes.
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

create or replace function public.write_admin_audit_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  audit_action text;
  audit_entity text;
  audit_metadata jsonb;
begin
  if auth.uid() is null or not public.is_staff(auth.uid()) then
    return new;
  end if;

  audit_entity := TG_TABLE_NAME;
  audit_action := lower(TG_OP);
  audit_metadata := jsonb_build_object('table', TG_TABLE_NAME);

  if TG_TABLE_NAME = 'matrimonial_profiles'
     and new.moderation_status is distinct from old.moderation_status then
    audit_action := 'profile_' || new.moderation_status;
    audit_metadata := audit_metadata || jsonb_build_object(
      'previous_status', old.moderation_status,
      'new_status', new.moderation_status
    );
  elsif TG_TABLE_NAME = 'profile_reports'
     and new.status is distinct from old.status then
    audit_action := 'report_' || new.status;
    audit_metadata := audit_metadata || jsonb_build_object(
      'previous_status', old.status,
      'new_status', new.status
    );
  end if;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), audit_action, audit_entity, new.id, audit_metadata);
  return new;
end;
$$;

drop trigger if exists audit_matrimonial_profile_updates on public.matrimonial_profiles;
create trigger audit_matrimonial_profile_updates
  after update of moderation_status on public.matrimonial_profiles
  for each row execute function public.write_admin_audit_log();

drop trigger if exists audit_profile_report_updates on public.profile_reports;
create trigger audit_profile_report_updates
  after update of status on public.profile_reports
  for each row execute function public.write_admin_audit_log();
