/* ===========================================
  Run this on an EXISTING Pluma database
  (SQL Editor as postgres / owner).

  Fixes:
  - Admin branding writes failing with
    "new row violates row-level security policy"
  - Custom media buckets listing as empty
    while Studio shows objects
 =========================================== */

-- 1) Role helpers must be SECURITY DEFINER so RLS
--    policies can evaluate them reliably.
create or replace function public.is_self(row_id uuid) returns boolean
language sql stable security definer
set search_path = '' as $$
  select auth.uid() = row_id;
$$;

create or replace function public.is_author(uid uuid) returns boolean
language sql stable security definer
set search_path = '' as $$
  select exists (
    select 1 from public.profiles p
    where p.id = uid and p.role in ('admin', 'author')
  );
$$;

create or replace function public.is_author() returns boolean
language sql stable security definer
set search_path = '' as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'author')
  );
$$;

create or replace function public.is_admin() returns boolean
language sql stable security definer
set search_path = '' as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function public.can_manage_own_post(author uuid) returns boolean
language sql stable security definer
set search_path = '' as $$
  select author = auth.uid() and public.is_author(author);
$$;

grant execute on function public.is_self(uuid) to anon, authenticated;
grant execute on function public.is_author(uuid) to anon, authenticated;
grant execute on function public.is_author() to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.can_manage_own_post(uuid) to anon, authenticated;

-- 2) Settings: ensure admins can insert/update branding & other keys
drop policy if exists "settings_insert_admin" on public.settings;
drop policy if exists "settings_insert_branding_admin" on public.settings;
drop policy if exists "settings_update_admin" on public.settings;
drop policy if exists "settings_update_branding_admin" on public.settings;

create policy "settings_insert_admin" on public.settings for
insert to authenticated with check (public.is_admin());

create policy "settings_update_admin" on public.settings for
update to authenticated using (public.is_admin()) with check (public.is_admin());

-- 3) Storage object SELECT must allow anon + authenticated
--    (Studio uses service_role and bypasses RLS — so objects can
--    appear there while the app still lists an empty bucket.)
drop policy if exists "objects_read_all" on storage.objects;
create policy "objects_read_all" on storage.objects for
select to anon, authenticated using (true);

-- 4) Ensure admins can insert/update/delete any storage objects
--    (needed for custom buckets + branding upserts)
drop policy if exists "objects_insert_admin" on storage.objects;
drop policy if exists "objects_update_admin" on storage.objects;
drop policy if exists "objects_delete_admin" on storage.objects;

create policy "objects_insert_admin" on storage.objects for
insert to authenticated with check (public.is_admin());

create policy "objects_update_admin" on storage.objects for
update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "objects_delete_admin" on storage.objects for
delete to authenticated using (public.is_admin());

-- 5) Branding bucket policies (idempotent recreate)
drop policy if exists "branding_insert_admin" on storage.objects;
drop policy if exists "branding_update_admin" on storage.objects;
drop policy if exists "branding_delete_admin" on storage.objects;

create policy "branding_insert_admin" on storage.objects for
insert to authenticated with check (
  bucket_id = 'branding' and public.is_admin()
);

create policy "branding_update_admin" on storage.objects for
update to authenticated
using (bucket_id = 'branding' and public.is_admin())
with check (bucket_id = 'branding' and public.is_admin());

create policy "branding_delete_admin" on storage.objects for
delete to authenticated using (
  bucket_id = 'branding' and public.is_admin()
);

-- Quick sanity check (run while logged in as your admin user via SQL won't work;
-- in the browser console after login you can instead run:
--   const { data } = await supabase.rpc('…')  -- or just retry branding upload)
-- Verify helpers:
select public.is_admin() as i_am_admin;
