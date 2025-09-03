/* ===========================================
 RESET / TEARDOWN
 - Safe on blank DB (guards every drop)
 - Split into: A) storage+auth (OWNER), B) app (NORMAL)
 =========================================== */
-- ========== A) STORAGE + AUTH (RUN AS OWNER) ==========
do $ $ begin -- Drop auth trigger (if auth.users exists)
if exists (
  select
    1
  from
    pg_class c
    join pg_namespace n on n.oid = c.relnamespace
  where
    n.nspname = 'auth'
    and c.relname = 'users'
) then execute 'drop trigger if exists on_auth_user_created on auth.users';

end if;

-- storage.objects policies (if objects table exists)
if exists (
  select
    1
  from
    pg_class c
    join pg_namespace n on n.oid = c.relnamespace
  where
    n.nspname = 'storage'
    and c.relname = 'objects'
) then execute 'drop policy if exists "objects_read_all"           on storage.objects';

execute 'drop policy if exists "objects_insert_admin"              on storage.objects';

execute 'drop policy if exists "objects_delete_admin"              on storage.objects';

execute 'drop policy if exists "thumbnails_insert_author"          on storage.objects';

execute 'drop policy if exists "thumbnails_update_author_or_admin" on storage.objects';

execute 'drop policy if exists "thumbnails_delete_admin_only"      on storage.objects';

execute 'drop policy if exists "avatars_insert_owner"              on storage.objects';

execute 'drop policy if exists "avatars_update_owner"              on storage.objects';

execute 'drop policy if exists "avatars_delete_owner_or_admin"     on storage.objects';

execute 'drop policy if exists "branding_insert_admin"             on storage.objects';

execute 'drop policy if exists "branding_update_admin"             on storage.objects';

execute 'drop policy if exists "branding_delete_admin"             on storage.objects';

-- Purge objects in our three buckets (if any)
execute $ sql $
delete from
  storage.objects
where
  bucket_id in ('post-thumbnails', 'profile-avatar', 'branding') $ sql $;

end if;

-- storage.buckets policies + buckets (if buckets table exists)
if exists (
  select
    1
  from
    pg_class c
    join pg_namespace n on n.oid = c.relnamespace
  where
    n.nspname = 'storage'
    and c.relname = 'buckets'
) then execute 'drop policy if exists "buckets_list_admin"   on storage.buckets';

execute 'drop policy if exists "buckets_create_admin"        on storage.buckets';

execute 'drop policy if exists "buckets_delete_admin"        on storage.buckets';

execute $ sql $
delete from
  storage.buckets
where
  id in ('post-thumbnails', 'profile-avatar', 'branding') $ sql $;

end if;

end $ $;

-- ========== B) APP OBJECTS (RUN AS NORMAL) ==========
do $ $ begin -- --- Policies (guarded per-table) ---
if exists (
  select
    1
  from
    pg_class c
    join pg_namespace n on n.oid = c.relnamespace
  where
    n.nspname = 'public'
    and c.relname = 'categories'
) then execute 'drop policy if exists "categories_read_all"            on public.categories';

execute 'drop policy if exists "categories_insert_author_admin"        on public.categories';

execute 'drop policy if exists "categories_update_author_admin"        on public.categories';

execute 'drop policy if exists "categories_delete_author_admin"        on public.categories';

execute 'drop trigger if exists categories_set_updated_at              on public.categories';

end if;

if exists (
  select
    1
  from
    pg_class c
    join pg_namespace n on n.oid = c.relnamespace
  where
    n.nspname = 'public'
    and c.relname = 'posts'
) then execute 'drop policy if exists "posts_read_published_or_authors"   on public.posts';

execute 'drop policy if exists "posts_insert_authors"                     on public.posts';

execute 'drop policy if exists "posts_update_admin_or_owner_author"       on public.posts';

execute 'drop policy if exists "posts_delete_admin_or_owner_author"       on public.posts';

execute 'drop trigger if exists posts_set_updated_at                      on public.posts';

end if;

if exists (
  select
    1
  from
    pg_class c
    join pg_namespace n on n.oid = c.relnamespace
  where
    n.nspname = 'public'
    and c.relname = 'comments'
) then execute 'drop policy if exists "comments_read_all"             on public.comments';

execute 'drop policy if exists "comments_insert_authenticated"        on public.comments';

execute 'drop policy if exists "comments_delete_self_or_author"       on public.comments';

execute 'drop trigger if exists comments_set_updated_at               on public.comments';

end if;

if exists (
  select
    1
  from
    pg_class c
    join pg_namespace n on n.oid = c.relnamespace
  where
    n.nspname = 'public'
    and c.relname = 'profiles'
) then execute 'drop policy if exists "profiles_read_all"        on public.profiles';

execute 'drop policy if exists "profiles_update_self_or_admin"   on public.profiles';

execute 'drop trigger if exists profiles_set_updated_at          on public.profiles';

execute 'drop trigger if exists profiles_admin_only_role_change  on public.profiles';

end if;

if exists (
  select
    1
  from
    pg_class c
    join pg_namespace n on n.oid = c.relnamespace
  where
    n.nspname = 'public'
    and c.relname = 'settings'
) then execute 'drop policy if exists "settings_read_all"      on public.settings';

execute 'drop policy if exists "settings_insert_admin"         on public.settings';

execute 'drop policy if exists "settings_update_admin"         on public.settings';

execute 'drop policy if exists "settings_delete_admin"         on public.settings';

execute 'drop policy if exists "settings_insert_install_flag"  on public.settings';

execute 'drop trigger if exists settings_set_updated_at        on public.settings';

end if;

-- --- Functions (drop if exist) ---
execute 'drop function if exists public.touch_updated_at()                        cascade';

execute 'drop function if exists public.is_self(uuid)                             cascade';

execute 'drop function if exists public.is_author(uuid)                           cascade';

execute 'drop function if exists public.is_author()                               cascade';

execute 'drop function if exists public.is_admin()                                cascade';

execute 'drop function if exists public.can_manage_own_post(uuid)                 cascade';

execute 'drop function if exists public.handle_new_user()                         cascade';

execute 'drop function if exists public.prevent_non_admin_role_change()           cascade';

-- --- Tables (FK-safe order) ---
execute 'drop table if exists public.comments   cascade';

execute 'drop table if exists public.posts      cascade';

execute 'drop table if exists public.categories cascade';

execute 'drop table if exists public.settings   cascade';

execute 'drop table if exists public.profiles   cascade';

-- --- Types & extension ---
execute 'drop type if exists public.post_status cascade';

execute 'drop type if exists public.user_role   cascade';

end $ $;