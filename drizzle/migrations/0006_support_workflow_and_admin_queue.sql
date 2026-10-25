-- Migration: 0006_support_workflow_and_admin_queue.sql
-- 1. Make owner_id nullable in support_requests so prospective families and visitors can submit inquiries before registering.
-- 2. Add contact details and ticket_code to support_requests.
-- 3. Allow anonymous visitors to submit support requests.
-- 4. Allow staff to read and update support requests (resolve inquiries).

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

-- Allow anonymous visitors to submit inquiries
grant insert on public.support_requests to anon;

drop policy if exists "Visitors submit support inquiries" on public.support_requests;
create policy "Visitors submit support inquiries"
  on public.support_requests for insert to anon
  with check (owner_id is null);

-- Allow staff to update support requests (mark as in_progress or resolved)
drop policy if exists "Staff update support requests" on public.support_requests;
create policy "Staff update support requests"
  on public.support_requests for update to authenticated
  using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));
