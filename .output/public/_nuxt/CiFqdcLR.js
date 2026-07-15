import{N as ve,J as we,B as Se,C as je,O as Ce,o as l,c as u,a as t,b as s,k as a,I as i,t as g,G as $e,F as C,r as N,n as m,d as _,l as U,m as $,v as I,L as Ae,H as Ee,E as qe,y as A,x as o,P as Re,M as Pe,Q as oe}from"./CVl9Nd-T.js";import{_ as Be}from"./Dc4eTF5t.js";const Ne=`/* ===========================================\r
 INSTALL / SETUP — fresh Pluma schema\r
 - Includes: core tables, series, scheduling, preview tokens,\r
   locales / translation groups, RLS helpers, storage buckets\r
 - Existing DBs: use pluma_features_v2.sql then pluma_i18n_v3.sql\r
   (and pluma_rls_fix.sql only if RLS/storage is broken)\r
 - A) App schema (RUN AS NORMAL)\r
 - B) Storage & auth trigger (RUN AS OWNER)\r
 =========================================== */\r
-- ========== A) APP SCHEMA (RUN AS NORMAL) ==========\r
-- 1) Extension\r
CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA extensions;\r
\r
-- 2) Types\r
do $$ begin if not exists (\r
    select\r
        1\r
    from\r
        pg_type\r
    where\r
        typname = 'user_role'\r
) then create type public.user_role as enum ('admin', 'author', 'reader', 'disabled');\r
\r
end if;\r
\r
end $$;\r
\r
do $$ begin if not exists (\r
    select\r
        1\r
    from\r
        pg_type\r
    where\r
        typname = 'post_status'\r
) then create type public.post_status as enum ('draft', 'published', 'archived');\r
\r
end if;\r
\r
end $$;\r
\r
-- 3) Tables\r
create table if not exists public.categories (\r
    id uuid primary key default gen_random_uuid(),\r
    name text not null,\r
    slug text not null,\r
    locale text not null default 'en',\r
    translation_group_id uuid,\r
    created_at timestamptz not null default now(),\r
    updated_at timestamptz not null default now(),\r
    constraint categories_locale_slug_key unique (locale, slug)\r
);\r
\r
create table if not exists public.profiles (\r
    id uuid primary key default auth.uid(),\r
    username text unique,\r
    display_name text,\r
    avatar_url text,\r
    role public.user_role not null default 'reader',\r
    created_at timestamptz not null default now(),\r
    updated_at timestamptz not null default now(),\r
    constraint profiles_id_fkey foreign key (id) references auth.users (id) on delete cascade\r
);\r
\r
create table if not exists public.series (\r
    id uuid primary key default gen_random_uuid(),\r
    name text not null,\r
    slug text not null,\r
    description text,\r
    locale text not null default 'en',\r
    translation_group_id uuid,\r
    created_at timestamptz not null default now(),\r
    updated_at timestamptz not null default now(),\r
    constraint series_locale_slug_key unique (locale, slug)\r
);\r
\r
create table if not exists public.posts (\r
    id uuid primary key default gen_random_uuid(),\r
    title text not null,\r
    content text not null,\r
    tags text [] not null default '{}' :: text [],\r
    slug text not null,\r
    locale text not null default 'en',\r
    translation_group_id uuid,\r
    cover_image_url text,\r
    author_id uuid not null,\r
    category_id uuid,\r
    series_id uuid,\r
    series_order integer,\r
    status public.post_status not null default 'draft',\r
    comments_disabled boolean not null default false,\r
    scheduled_at timestamptz,\r
    preview_token uuid,\r
    created_at timestamptz not null default now(),\r
    updated_at timestamptz not null default now(),\r
    constraint posts_locale_slug_key unique (locale, slug),\r
    constraint posts_author_id_fkey foreign key (author_id) references public.profiles (id) on delete cascade,\r
    constraint posts_category_id_fkey foreign key (category_id) references public.categories (id) on update cascade on delete\r
    set\r
        null,\r
    constraint posts_series_id_fkey foreign key (series_id) references public.series (id) on delete\r
    set\r
        null\r
);\r
\r
create table if not exists public.comments (\r
    id uuid primary key default gen_random_uuid(),\r
    post_id uuid not null,\r
    author_id uuid not null default auth.uid(),\r
    content text not null,\r
    approved boolean not null default false,\r
    created_at timestamptz not null default now(),\r
    updated_at timestamptz not null default now(),\r
    constraint comments_post_id_fkey foreign key (post_id) references public.posts (id) on delete cascade,\r
    constraint comments_author_id_fkey foreign key (author_id) references public.profiles (id) on delete cascade\r
);\r
\r
create table if not exists public.settings (\r
    key text primary key,\r
    value jsonb not null,\r
    created_at timestamptz not null default now(),\r
    updated_at timestamptz not null default now()\r
);\r
\r
-- 4) Functions\r
create\r
or replace function public.touch_updated_at() returns trigger language plpgsql\r
set\r
    search_path = '' as $$ begin new.updated_at := now();\r
\r
return new;\r
\r
end;\r
\r
$$;\r
\r
create\r
or replace function public.is_self(row_id uuid) returns boolean language sql stable security definer\r
set\r
    search_path = '' as $$\r
select\r
    auth.uid() = row_id;\r
\r
$$;\r
\r
create\r
or replace function public.is_author(uid uuid) returns boolean language sql stable security definer\r
set\r
    search_path = '' as $$\r
select\r
    exists (\r
        select\r
            1\r
        from\r
            public.profiles p\r
        where\r
            p.id = uid\r
            and p.role in ('admin', 'author')\r
    );\r
\r
$$;\r
\r
create\r
or replace function public.is_author() returns boolean language sql stable security definer\r
set\r
    search_path = '' as $$\r
select\r
    exists (\r
        select\r
            1\r
        from\r
            public.profiles p\r
        where\r
            p.id = auth.uid()\r
            and p.role in ('admin', 'author')\r
    );\r
\r
$$;\r
\r
create\r
or replace function public.is_admin() returns boolean language sql stable security definer\r
set\r
    search_path = '' as $$\r
select\r
    exists (\r
        select\r
            1\r
        from\r
            public.profiles p\r
        where\r
            p.id = auth.uid()\r
            and p.role = 'admin'\r
    );\r
\r
$$;\r
\r
create\r
or replace function public.can_manage_own_post(author uuid) returns boolean language sql stable security definer\r
set\r
    search_path = '' as $$\r
select\r
    author = auth.uid()\r
    and public.is_author(author);\r
\r
$$;\r
\r
grant execute on function public.is_self(uuid) to anon, authenticated;\r
grant execute on function public.is_author(uuid) to anon, authenticated;\r
grant execute on function public.is_author() to anon, authenticated;\r
grant execute on function public.is_admin() to anon, authenticated;\r
grant execute on function public.can_manage_own_post(uuid) to anon, authenticated;\r
\r
-- First user -> admin, others -> reader (no mutable search_path)\r
create\r
or replace function public.handle_new_user() returns trigger language plpgsql security definer\r
set\r
    search_path = '' as $$ declare is_first boolean;\r
\r
begin perform pg_advisory_lock(42000001);\r
\r
select\r
    not exists (\r
        select\r
            1\r
        from\r
            public.profiles\r
        where\r
            role = 'admin' :: public.user_role\r
    ) into is_first;\r
\r
insert into\r
    public.profiles (id, username, display_name, role)\r
values\r
    (\r
        new.id,\r
        new.raw_user_meta_data ->> 'username',\r
        new.raw_user_meta_data ->> 'display_name',\r
        case\r
            when is_first then 'admin' :: public.user_role\r
            else 'reader' :: public.user_role\r
        end\r
    ) on conflict (id) do nothing;\r
\r
perform pg_advisory_unlock(42000001);\r
\r
return new;\r
\r
exception\r
when others then perform pg_advisory_unlock(42000001);\r
\r
raise;\r
\r
end;\r
\r
$$;\r
\r
create\r
or replace function public.prevent_non_admin_role_change() returns trigger language plpgsql\r
set\r
    search_path = '' as $$ declare jwt_role text := coalesce(\r
        (\r
            current_setting('request.jwt.claims', true) :: jsonb ->> 'role'\r
        ),\r
        ''\r
    );\r
\r
begin -- No change -> allow\r
if new.role is not distinct\r
from\r
    old.role then return new;\r
\r
end if;\r
\r
-- Allow Supabase service-key / API (PostgREST) calls\r
if jwt_role = 'service_role' then return new;\r
\r
end if;\r
\r
-- Allow direct Studio/SQL connections running as elevated DB roles\r
if current_user in ('postgres', 'supabase_admin') then return new;\r
\r
end if;\r
\r
-- Otherwise require an in-app admin\r
if not public.is_admin() then raise exception 'Only admins can change role';\r
\r
end if;\r
\r
return new;\r
\r
end;\r
\r
$$;\r
\r
-- 5) Triggers (updated_at + role-change guard)\r
drop trigger if exists categories_set_updated_at on public.categories;\r
\r
create trigger categories_set_updated_at before\r
update\r
    on public.categories for each row execute function public.touch_updated_at();\r
\r
drop trigger if exists profiles_set_updated_at on public.profiles;\r
\r
create trigger profiles_set_updated_at before\r
update\r
    on public.profiles for each row execute function public.touch_updated_at();\r
\r
drop trigger if exists posts_set_updated_at on public.posts;\r
\r
create trigger posts_set_updated_at before\r
update\r
    on public.posts for each row execute function public.touch_updated_at();\r
\r
drop trigger if exists comments_set_updated_at on public.comments;\r
\r
create trigger comments_set_updated_at before\r
update\r
    on public.comments for each row execute function public.touch_updated_at();\r
\r
drop trigger if exists settings_set_updated_at on public.settings;\r
\r
create trigger settings_set_updated_at before\r
update\r
    on public.settings for each row execute function public.touch_updated_at();\r
\r
drop trigger if exists series_set_updated_at on public.series;\r
\r
create trigger series_set_updated_at before\r
update\r
    on public.series for each row execute function public.touch_updated_at();\r
\r
drop trigger if exists profiles_admin_only_role_change on public.profiles;\r
\r
create trigger profiles_admin_only_role_change before\r
update\r
    on public.profiles for each row execute function public.prevent_non_admin_role_change();\r
\r
-- 6) Enable RLS\r
alter table\r
    public.categories enable row level security;\r
\r
alter table\r
    public.profiles enable row level security;\r
\r
alter table\r
    public.posts enable row level security;\r
\r
alter table\r
    public.comments enable row level security;\r
\r
alter table\r
    public.settings enable row level security;\r
\r
-- 7) Policies\r
-- categories\r
drop policy if exists "categories_read_all" on public.categories;\r
\r
drop policy if exists "categories_insert_author_admin" on public.categories;\r
\r
drop policy if exists "categories_update_author_admin" on public.categories;\r
\r
drop policy if exists "categories_delete_author_admin" on public.categories;\r
\r
create policy "categories_read_all" on public.categories for\r
select\r
    to public using (true);\r
\r
create policy "categories_insert_author_admin" on public.categories for\r
insert\r
    to authenticated with check (\r
        public.is_author()\r
        or public.is_admin()\r
    );\r
\r
create policy "categories_update_author_admin" on public.categories for\r
update\r
    to authenticated using (\r
        public.is_author()\r
        or public.is_admin()\r
    ) with check (\r
        public.is_author()\r
        or public.is_admin()\r
    );\r
\r
create policy "categories_delete_author_admin" on public.categories for delete to authenticated using (\r
    public.is_author()\r
    or public.is_admin()\r
);\r
\r
-- posts\r
drop policy if exists "posts_read_published_or_authors" on public.posts;\r
\r
drop policy if exists "posts_insert_authors" on public.posts;\r
\r
drop policy if exists "posts_update_admin_or_owner_author" on public.posts;\r
\r
drop policy if exists "posts_delete_admin_or_owner_author" on public.posts;\r
\r
create policy "posts_read_published_or_authors" on public.posts for\r
select\r
    to public using (\r
        status IN ('published', 'archived')\r
        or public.is_author()\r
    );\r
\r
create policy "posts_insert_authors" on public.posts for\r
insert\r
    to authenticated with check (public.is_author());\r
\r
create policy "posts_update_admin_or_owner_author" on public.posts for\r
update\r
    to authenticated using (\r
        public.is_admin()\r
        or public.can_manage_own_post(author_id)\r
    ) with check (\r
        public.is_admin()\r
        or public.can_manage_own_post(author_id)\r
    );\r
\r
create policy "posts_delete_admin_or_owner_author" on public.posts for delete to authenticated using (\r
    public.is_admin()\r
    or (\r
        author_id = auth.uid()\r
        and public.is_author()\r
    )\r
);\r
\r
-- comments\r
drop policy if exists "comments_read_all" on public.comments;\r
\r
drop policy if exists "comments_delete_self_or_author" on public.comments;\r
\r
drop policy if exists "comments_insert_authenticated" on public.comments;\r
\r
drop policy if exists "comments_approve_admin_or_author" on public.comments;\r
\r
create policy "comments_read_all" on public.comments for\r
select\r
    to public using (true);\r
\r
\r
create policy "comments_delete_self_or_author" on public.comments for delete to authenticated using (\r
    public.is_self(author_id)\r
    or public.is_author()\r
);\r
\r
create policy "comments_insert_authenticated" on public.comments for\r
insert\r
    to authenticated with check (\r
        author_id = auth.uid()\r
        and exists (\r
            select\r
                1\r
            from\r
                public.posts p\r
            where\r
                p.id = public.comments.post_id\r
                and p.status IN ('published', 'archived')\r
                and p.comments_disabled = false\r
        )\r
    );\r
\r
create policy "comments_approve_admin_or_author" on public.comments for\r
update\r
    to authenticated using (\r
        public.is_admin()\r
        or public.is_author()\r
    ) with check (\r
        public.is_admin()\r
        or public.is_author()\r
    );\r
\r
-- profiles\r
drop policy if exists "profiles_read_all" on public.profiles;\r
\r
drop policy if exists "profiles_update_self_or_admin" on public.profiles;\r
\r
create policy "profiles_read_all" on public.profiles for\r
select\r
    to public using (true);\r
\r
create policy "profiles_update_self_or_admin" on public.profiles for\r
update\r
    to authenticated using (\r
        public.is_self(id)\r
        or public.is_admin()\r
    ) with check (\r
        public.is_self(id)\r
        or public.is_admin()\r
    );\r
\r
-- settings (deduplicated policies)\r
drop policy if exists "settings_read_all" on public.settings;\r
\r
drop policy if exists "settings_insert_install_flag" on public.settings;\r
\r
drop policy if exists "settings_insert_branding_initial" on public.settings;\r
\r
drop policy if exists "settings_insert_admin" on public.settings;\r
\r
drop policy if exists "settings_insert_branding_admin" on public.settings;\r
\r
drop policy if exists "settings_update_admin" on public.settings;\r
\r
drop policy if exists "settings_update_branding_admin" on public.settings;\r
\r
drop policy if exists "settings_delete_admin" on public.settings;\r
\r
-- Public read access (site metadata, etc.)\r
create policy "settings_read_all" on public.settings for\r
select\r
    to public using (true);\r
\r
-- One-time anonymous insert of installation flag (before any installation row exists)\r
create policy "settings_insert_install_flag" on public.settings for\r
insert\r
    to anon with check (\r
        key = 'installation'\r
        and not exists (\r
            select\r
                1\r
            from\r
                public.settings\r
            where\r
                key = 'installation'\r
        )\r
    );\r
\r
-- One-time anonymous insert of branding (must be before installation completes)\r
create policy "settings_insert_branding_initial" on public.settings for\r
insert\r
    to anon with check (\r
        key = 'branding'\r
        and not exists (\r
            select\r
                1\r
            from\r
                public.settings\r
            where\r
                key = 'branding'\r
        )\r
        and not exists (\r
            select\r
                1\r
            from\r
                public.settings\r
            where\r
                key = 'installation'\r
        )\r
    );\r
\r
-- Admin-controlled subsequent inserts/updates/deletes\r
create policy "settings_insert_admin" on public.settings for\r
insert\r
    to authenticated with check (public.is_admin());\r
\r
create policy "settings_update_admin" on public.settings for\r
update\r
    to authenticated using (public.is_admin()) with check (public.is_admin());\r
\r
create policy "settings_delete_admin" on public.settings for delete to authenticated using (public.is_admin());\r
\r
-- series\r
alter table public.series enable row level security;\r
\r
drop policy if exists "series_read_all" on public.series;\r
\r
drop policy if exists "series_write_author_admin" on public.series;\r
\r
drop policy if exists "series_update_author_admin" on public.series;\r
\r
drop policy if exists "series_delete_admin" on public.series;\r
\r
create policy "series_read_all" on public.series for\r
select\r
    to public using (true);\r
\r
create policy "series_write_author_admin" on public.series for\r
insert\r
    to authenticated with check (\r
        public.is_author()\r
        or public.is_admin()\r
    );\r
\r
create policy "series_update_author_admin" on public.series for\r
update\r
    to authenticated using (\r
        public.is_author()\r
        or public.is_admin()\r
    ) with check (\r
        public.is_author()\r
        or public.is_admin()\r
    );\r
\r
create policy "series_delete_admin" on public.series for delete to authenticated using (public.is_admin());\r
\r
-- publish due + preview helpers\r
create or replace function public.publish_due_posts() returns integer language plpgsql security definer\r
set\r
    search_path = '' as $$\r
declare\r
    updated_count integer;\r
\r
begin\r
update\r
    public.posts\r
set\r
    status = 'published' :: public.post_status,\r
    scheduled_at = null,\r
    updated_at = now()\r
where\r
    status = 'draft' :: public.post_status\r
    and scheduled_at is not null\r
    and scheduled_at <= now();\r
\r
get diagnostics updated_count = row_count;\r
\r
return updated_count;\r
\r
end;\r
\r
$$;\r
\r
grant execute on function public.publish_due_posts() to anon,\r
authenticated;\r
\r
create or replace function public.get_post_by_preview_token(p_token uuid) returns jsonb language plpgsql security definer\r
set\r
    search_path = '' as $$\r
declare\r
    result jsonb;\r
\r
begin if p_token is null then return null;\r
\r
end if;\r
\r
select\r
    jsonb_build_object(\r
        'id',\r
        p.id,\r
        'title',\r
        p.title,\r
        'content',\r
        p.content,\r
        'tags',\r
        to_jsonb(p.tags),\r
        'slug',\r
        p.slug,\r
        'locale',\r
        p.locale,\r
        'translation_group_id',\r
        p.translation_group_id,\r
        'comments_disabled',\r
        p.comments_disabled,\r
        'cover_image_url',\r
        p.cover_image_url,\r
        'created_at',\r
        p.created_at,\r
        'updated_at',\r
        p.updated_at,\r
        'status',\r
        p.status,\r
        'scheduled_at',\r
        p.scheduled_at,\r
        'series_id',\r
        p.series_id,\r
        'series_order',\r
        p.series_order,\r
        'category',\r
        case\r
            when c.id is null then null\r
            else jsonb_build_object(\r
                'id',\r
                c.id,\r
                'name',\r
                c.name,\r
                'slug',\r
                c.slug,\r
                'locale',\r
                c.locale\r
            )\r
        end,\r
        'author',\r
        case\r
            when pr.id is null then null\r
            else jsonb_build_object(\r
                'id',\r
                pr.id,\r
                'username',\r
                pr.username,\r
                'display_name',\r
                pr.display_name\r
            )\r
        end,\r
        'series',\r
        case\r
            when s.id is null then null\r
            else jsonb_build_object(\r
                'id',\r
                s.id,\r
                'name',\r
                s.name,\r
                'slug',\r
                s.slug,\r
                'locale',\r
                s.locale\r
            )\r
        end\r
    ) into result\r
from\r
    public.posts p\r
    left join public.categories c on c.id = p.category_id\r
    left join public.profiles pr on pr.id = p.author_id\r
    left join public.series s on s.id = p.series_id\r
where\r
    p.preview_token = p_token\r
limit\r
    1;\r
\r
return result;\r
\r
end;\r
\r
$$;\r
\r
grant execute on function public.get_post_by_preview_token(uuid) to anon,\r
authenticated;\r
\r
-- 8) Indexes\r
create index if not exists posts_author_id_idx on public.posts (author_id);\r
\r
create index if not exists posts_status_idx on public.posts (status);\r
\r
create index if not exists posts_category_id_idx on public.posts (category_id);\r
\r
create index if not exists posts_tags_gin_idx on public.posts using gin (tags);\r
\r
create index if not exists posts_series_id_idx on public.posts (series_id);\r
\r
create index if not exists posts_scheduled_at_idx on public.posts (scheduled_at)\r
where\r
    scheduled_at is not null;\r
\r
create unique index if not exists posts_preview_token_uidx on public.posts (preview_token)\r
where\r
    preview_token is not null;\r
\r
create index if not exists posts_locale_idx on public.posts (locale);\r
\r
create index if not exists posts_translation_group_idx on public.posts (translation_group_id);\r
\r
create index if not exists categories_locale_idx on public.categories (locale);\r
\r
create index if not exists series_locale_idx on public.series (locale);\r
\r
create unique index if not exists categories_locale_name_uidx on public.categories (locale, name);\r
\r
create unique index if not exists series_locale_name_uidx on public.series (locale, name);\r
\r
create index if not exists comments_post_id_idx on public.comments (post_id);\r
\r
create index if not exists comments_author_id_idx on public.comments (author_id);\r
\r
comment on column public.posts.locale is 'BCP-47 language tag for this post version';\r
\r
comment on column public.posts.translation_group_id is 'Shared id linking translated versions of the same post';\r
\r
-- ========== B) STORAGE + AUTH TRIGGER (RUN AS OWNER) ==========\r
-- 1) Buckets (create in UI OR via SQL if owner; your original snippet did this):\r
insert into\r
    storage.buckets (id, name, public)\r
values\r
    ('post-thumbnails', 'post-thumbnails', true),\r
    ('profile-avatar', 'profile-avatar', true),\r
    ('branding', 'branding', true) on conflict (id) do nothing;\r
\r
-- 2) Bucket-level policies (owner)\r
drop policy if exists "buckets_list_admin" on storage.buckets;\r
\r
drop policy if exists "buckets_create_admin" on storage.buckets;\r
\r
drop policy if exists "buckets_delete_admin" on storage.buckets;\r
\r
create policy "buckets_list_admin" on storage.buckets for\r
select\r
    using (true);\r
\r
-- (Use your preferred rule; earlier you had admin-only.)\r
create policy "buckets_create_admin" on storage.buckets for\r
insert\r
    to authenticated with check (public.is_admin());\r
\r
create policy "buckets_delete_admin" on storage.buckets for delete to authenticated using (public.is_admin());\r
\r
-- 3) Object policies (can be owner or normal; owner is fine)\r
drop policy if exists "objects_read_all" on storage.objects;\r
\r
create policy "objects_read_all" on storage.objects for\r
select\r
    to anon,\r
    authenticated using (true);\r
\r
drop policy if exists "objects_insert_admin" on storage.objects;\r
\r
drop policy if exists "objects_update_admin" on storage.objects;\r
\r
drop policy if exists "objects_delete_admin" on storage.objects;\r
\r
create policy "objects_insert_admin" on storage.objects for\r
insert\r
    to authenticated with check (public.is_admin());\r
\r
create policy "objects_update_admin" on storage.objects for\r
update\r
    to authenticated using (public.is_admin()) with check (public.is_admin());\r
\r
create policy "objects_delete_admin" on storage.objects for delete to authenticated using (public.is_admin());\r
\r
-- post-thumbnails\r
drop policy if exists "thumbnails_insert_author" on storage.objects;\r
\r
drop policy if exists "thumbnails_update_author_or_admin" on storage.objects;\r
\r
drop policy if exists "thumbnails_delete_admin_only" on storage.objects;\r
\r
create policy "thumbnails_insert_author" on storage.objects for\r
insert\r
    to authenticated with check (\r
        bucket_id = 'post-thumbnails'\r
        and (\r
            public.is_author()\r
            or public.is_admin()\r
        )\r
    );\r
\r
create policy "thumbnails_update_author_or_admin" on storage.objects for\r
update\r
    to authenticated using (\r
        bucket_id = 'post-thumbnails'\r
        and (\r
            public.is_author()\r
            or public.is_admin()\r
        )\r
    ) with check(\r
        bucket_id = 'post-thumbnails'\r
        and (\r
            public.is_author()\r
            or public.is_admin()\r
        )\r
    );\r
\r
create policy "thumbnails_delete_admin_only" on storage.objects for delete to authenticated using (\r
    bucket_id = 'post-thumbnails'\r
    and public.is_admin()\r
);\r
\r
-- profile-avatar\r
drop policy if exists "avatars_insert_owner" on storage.objects;\r
\r
drop policy if exists "avatars_update_owner" on storage.objects;\r
\r
drop policy if exists "avatars_delete_owner_or_admin" on storage.objects;\r
\r
create policy "avatars_insert_owner" on storage.objects for\r
insert\r
    to authenticated with check (\r
        bucket_id = 'profile-avatar'\r
        and (storage.foldername(name)) [1] = auth.uid() :: text\r
    );\r
\r
create policy "avatars_update_owner" on storage.objects for\r
update\r
    to authenticated using (\r
        bucket_id = 'profile-avatar'\r
        and (storage.foldername(name)) [1] = auth.uid() :: text\r
    ) with check(\r
        bucket_id = 'profile-avatar'\r
        and (storage.foldername(name)) [1] = auth.uid() :: text\r
    );\r
\r
create policy "avatars_delete_owner_or_admin" on storage.objects for delete to authenticated using (\r
    bucket_id = 'profile-avatar'\r
    and (\r
        (storage.foldername(name)) [1] = auth.uid() :: text\r
        or public.is_admin()\r
    )\r
);\r
\r
-- branding\r
drop policy if exists "branding_insert_admin" on storage.objects;\r
\r
drop policy if exists "branding_update_admin" on storage.objects;\r
\r
drop policy if exists "branding_delete_admin" on storage.objects;\r
\r
create policy "branding_insert_admin" on storage.objects for\r
insert\r
    to authenticated with check (\r
        bucket_id = 'branding'\r
        and public.is_admin()\r
    );\r
\r
create policy "branding_update_admin" on storage.objects for\r
update\r
    to authenticated using (\r
        bucket_id = 'branding'\r
        and public.is_admin()\r
    ) with check (\r
        bucket_id = 'branding'\r
        and public.is_admin()\r
    );\r
\r
create policy "branding_delete_admin" on storage.objects for delete to authenticated using (\r
    bucket_id = 'branding'\r
    and public.is_admin()\r
);\r
\r
-- 4) Auth trigger (owner)\r
drop trigger if exists on_auth_user_created on auth.users;\r
\r
create trigger on_auth_user_created\r
after\r
insert\r
    on auth.users for each row execute function public.handle_new_user();`,Ue={class:"max-w-5xl mx-auto px-4 py-12 space-y-10"},Ie={class:"flex items-center gap-3"},Te={class:"p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"},Le={class:"text-sm text-gray-500 dark:text-gray-400"},Ve={class:"flex flex-wrap justify-center gap-4 mb-6 pt-1","aria-label":"Setup Progress"},ze=["disabled","onClick"],Oe={class:"flex flex-col items-start leading-tight"},Me={class:"text-xs font-semibold uppercase tracking-wide"},Fe={class:"text-[10px] text-gray-400 dark:text-gray-500"},De={key:0,class:"rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-6"},Qe={class:"flex items-start gap-3"},Ge={class:"p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300"},He={class:"space-y-4"},We={class:"relative"},Ye={class:"rounded-md bg-gray-900 text-gray-100 text-[11px] leading-relaxed p-4 max-h-72 overflow-auto whitespace-pre-wrap"},Ke={class:"flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-300 cursor-pointer select-none pt-2"},Ze={class:"flex items-center gap-3 pt-2"},Xe=["disabled"],Je={key:1,class:"rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-6"},et={class:"flex items-start gap-3"},tt={class:"p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"},rt={class:"flex-1"},nt={class:"text-[13px] text-gray-500 dark:text-gray-400 mt-1"},at={class:"space-y-5"},st={class:"rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-4 text-xs space-y-3"},it={class:"flex items-center gap-2"},ot={class:"grid sm:grid-cols-2 gap-4"},lt={class:"break-all text-[11px] text-gray-800 dark:text-gray-200"},ut={class:"break-all text-[11px] text-gray-800 dark:text-gray-200"},dt={key:0,class:"text-[11px] text-gray-500 dark:text-gray-400"},ct={key:1,class:"text-[11px] text-gray-500 dark:text-gray-400"},pt={class:"flex items-center gap-3 pt-2"},gt=["disabled"],bt={class:"grid md:grid-cols-2 gap-6 pt-6 text-[11px]"},_t={class:"space-y-1"},mt={class:"space-y-1"},ft={class:"space-y-1"},xt={class:"flex items-center gap-1"},yt={key:0,class:"pl-4 text-[10px] leading-snug opacity-90"},ht={class:"space-y-1"},kt={class:"pt-6"},vt=["disabled"],wt={key:2,class:"rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-6"},St={class:"flex items-start gap-3"},jt={class:"p-2 rounded-lg bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300"},Ct={class:"space-y-4"},$t={class:"flex items-center gap-3 pt-2"},At=["disabled"],Et={key:3,class:"rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-8"},qt={class:"flex items-start gap-3"},Rt={class:"p-2 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300"},Pt={class:"flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"},Bt={class:"flex items-center justify-between mb-1"},Nt={class:"flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300"},Ut={class:"relative group"},It=["type"],Tt=["aria-label"],Lt={class:"mt-1 flex items-center gap-2 text-[11px]"},Vt={class:"flex-1 h-1 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden"},zt={class:"flex items-center justify-between mb-1"},Ot={class:"flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300"},Mt={key:0,class:"mt-1 text-[11px] text-red-600 dark:text-red-400"},Ft={class:"flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"},Dt={class:"flex items-center gap-3"},Qt=["disabled"],Gt={key:0,class:"rounded-md border border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-900/30 p-4 text-sm text-green-800 dark:text-green-200 flex items-start gap-3"},Ht={key:1,class:"rounded-md border border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 p-4 text-sm text-blue-800 dark:text-blue-200 flex items-start gap-3"},Zt=ve({__name:"install",setup(Wt){const p=we(),K=Se(),le=[{step:1,title:"SQL",description:"Copy & run migration",icon:"mdi:script-text"},{step:2,title:"Verify",description:"Check schema & storage",icon:"mdi:check-decagram",disabled:A(()=>!z.value)},{step:3,title:"Branding",description:"Set site name",icon:"mdi:brush",disabled:A(()=>!v.value)},{step:4,title:"Admin",description:"Create admin account",icon:"mdi:account-star",disabled:A(()=>!v.value||!Z.value)}],E=o(""),F=o(""),h=o(!1),Z=o(!1),b=o(1),y=o(""),f=o(""),D=o(!0),Q=o(""),G=o("");let d=null;const ue=A(()=>!!y.value&&!!f.value);function X(r){y.value=r.VITE_SUPABASE_URL||"",f.value=r.VITE_SUPABASE_ANON_KEY||""}X(Re()),je(async()=>{try{X(await Ce())}finally{D.value=!1}});const de=A(()=>f.value?f.value.slice(0,16)+"..."+f.value.slice(-8):""),T=o([{name:"categories",type:"table",status:"pending"},{name:"profiles",type:"table",status:"pending"},{name:"posts",type:"table",status:"pending"},{name:"comments",type:"table",status:"pending"},{name:"settings",type:"table",status:"pending"},{name:"series",type:"table",status:"pending"}]),L=o([{name:"is_admin",type:"function",status:"pending"},{name:"is_author",type:"function",status:"pending"},{name:"handle_new_user",type:"function",status:"pending"},{name:"touch_updated_at",type:"function",status:"pending"},{name:"publish_due_posts",type:"function",status:"pending"},{name:"get_post_by_preview_token",type:"function",status:"pending"}]),V=o([{name:"post-thumbnails",type:"bucket",status:"pending",expectedPublic:!0},{name:"profile-avatar",type:"bucket",status:"pending",expectedPublic:!0},{name:"branding",type:"bucket",status:"pending",expectedPublic:!0}]),q=o([{name:"RLS enabled",type:"policy",status:"pending"}]),k=o(!1),J=o(!1),v=A(()=>[...T.value,...L.value,...V.value].every(r=>r.status==="ok")),z=o(!1),O=o(""),R=o(""),P=o(""),M=o(""),B=o(!1),x=o(""),c=Pe({percent:0,label:"Weak",barClass:"bg-red-400 dark:bg-red-500",textClass:"text-red-500 dark:text-red-400"}),w=o(!1),H=o(!1),W=o(!1),ee=o(!1),te=Ne;function re(){return Q.value="",G.value="",y.value||(Q.value="Missing URL"),f.value||(G.value="Missing anon key"),!Q.value&&!G.value}async function ce(){if(!E.value.trim()){p.error("Site name required");return}if(re()){h.value=!0;try{d=oe(y.value,f.value,{auth:{persistSession:!1}});const{error:r}=await d.from("settings").insert({key:"branding",value:{siteName:E.value.trim(),siteDescription:F.value.trim(),socialLinks:[]}});if(r&&r.code!=="42501")throw r;Z.value=!0,r&&r.code==="42501"?p.info("Branding already exists (skipped). You can update it later in the dashboard."):p.success("Branding saved"),b.value=4}catch(r){p.error(r.message||"Failed to save branding")}finally{h.value=!1}}}async function pe(){if(re()){k.value=!0,J.value=!0,d=null,[...T.value,...L.value,...V.value,...q.value].forEach(r=>{r.status="pending",r.detail=""});try{d=oe(y.value,f.value,{auth:{persistSession:!1}});for(const r of T.value)try{const e=r.name==="settings"?"key":"id",{error:n}=await d.from(r.name).select(e).limit(1);if(n)throw n;r.status="ok"}catch(e){r.status="fail",r.detail=e.message}for(const r of L.value)try{if(["is_admin","is_author"].includes(r.name)){const{error:e}=await d.rpc(r.name);if(e)throw e;r.status="ok"}else if(r.name==="handle_new_user"){const{error:e}=await d.from("profiles").select("id").limit(1);if(e)throw e;r.status="ok"}else if(r.name==="touch_updated_at"){const{error:e}=await d.from("categories").select("id").limit(1);if(e)throw e;r.status="ok"}else if(r.name==="publish_due_posts"){const{error:e}=await d.rpc(r.name);if(e&&/could not find|does not exist|PGRST202|schema cache/i.test(e.message||""))throw e;r.status="ok"}else if(r.name==="get_post_by_preview_token"){const{error:e}=await d.rpc(r.name,{p_token:"00000000-0000-0000-0000-000000000000"});if(e&&/could not find|does not exist|PGRST202|schema cache/i.test(e.message||""))throw e;r.status="ok"}else r.status="fail",r.detail="No verification path for this function"}catch(e){r.status="fail",r.detail=e.message}for(const r of V.value)try{const{data:e,error:n}=await d.storage.getBucket(r.name);if(n||!e){if(r.name.endsWith("s")){const j=r.name.slice(0,-1);try{const{data:he,error:ke}=await d.storage.getBucket(j);if(he&&!ke){r.status="fail",r.detail=`Found '${j}' but expected '${r.name}' (rename bucket)`;continue}}catch{}}r.status="fail",r.detail=n?n.message:"Bucket not found";continue}const S=e.public===!0;r.expectedPublic?S?r.status="ok":(r.status="fail",r.detail="Exists but not public"):S?(r.status="fail",r.detail="Public but expected private"):r.status="ok"}catch(e){r.status="fail",r.detail=e.message||"Error verifying bucket"}try{const{error:r}=await d.from("categories").select("id").limit(1);if(r)throw r;q.value[0].status="ok"}catch(r){q.value[0].status="fail",q.value[0].detail=r.message}v.value?p.success("All checks passed"):p.info("Verification finished (review results)")}catch(r){console.error(r),p.error("Verification failed")}finally{k.value=!1}}}function ne(){const r=P.value.trim();r?/^[A-Za-z0-9_-]{3,20}$/.test(r)?x.value="":x.value="3-20 chars: letters, numbers, - _":x.value="Required"}function ge(r){let e=0;if(r.length>=8)e+=30;else return 10;return/[A-Z]/.test(r)&&(e+=15),/[a-z]/.test(r)&&(e+=15),/[0-9]/.test(r)&&(e+=15),/[^A-Za-z0-9]/.test(r)&&(e+=15),r.length>=12&&(e+=10),Math.min(e,100)}function ae(){const r=ge(R.value);c.percent=r,r<30?(c.label="Weak",c.barClass="bg-red-400 dark:bg-red-500",c.textClass="text-red-500 dark:text-red-400"):r<60?(c.label="Fair",c.barClass="bg-yellow-400 dark:bg-yellow-500",c.textClass="text-yellow-600 dark:text-yellow-400"):r<85?(c.label="Good",c.barClass="bg-blue-400 dark:bg-blue-500",c.textClass="text-blue-600 dark:text-blue-400"):(c.label="Strong",c.barClass="bg-green-500 dark:bg-green-500",c.textClass="text-green-600 dark:text-green-400")}function be(){ae()}function _e(r){return r.detail?/not found/i.test(r.detail)?"Bucket not found. Create it in Storage with Public enabled and correct MIME types.":/not public|exists but not public/i.test(r.detail)?"Bucket exists but is private. Edit bucket -> toggle Public.":/rename bucket/i.test(r.detail)?r.detail+" Update policy names or bucket to match expected id.":/public but expected private/i.test(r.detail)?"Bucket is public but expected private per configuration.":r.detail:"Unknown failure"}function se(){b.value<4&&(b.value++,b.value===4&&ye())}function Y(){b.value>1&&b.value--}function me(r){r<b.value&&(b.value=r)}async function fe(){try{await navigator.clipboard.writeText(te),p.success("SQL copied")}catch{p.error("Copy failed")}}async function xe(){if(!d){p.error("Reconnect first");return}if(ne(),ae(),x.value||c.percent<25){p.error("Fix validation issues");return}w.value=!0,H.value=!1;try{if(!await ie(!0)){p.error("Cannot set installation flag; aborting admin creation");return}const{error:e}=await d.auth.signUp({email:O.value,password:R.value,options:{data:{username:P.value,display_name:M.value}}});if(e)throw e;H.value=!0,p.success("Admin user created (confirm email if required)"),setTimeout(()=>{K.push({name:"Login",query:{installed:"1"}})},600)}catch(r){console.error(r),p.error(r.message||"Failed")}finally{w.value=!1}}async function ie(r=!1){if(!d)return!1;try{const{data:e,error:n}=await d.from("settings").select("value").eq("key","installation").maybeSingle();if(!n&&e){const j=e.value;return j&&typeof j=="object"&&j.complete===!0?(W.value=!0,!0):(p.error("Existing installation flag present but incomplete. Use admin to finalize."),!1)}const{error:S}=await d.from("settings").insert({key:"installation",value:{complete:!0,completed_at:new Date().toISOString()}});if(S)throw S;return W.value=!0,r||p.success("Installation marked complete"),!0}catch(e){return console.warn("Failed to mark installation complete",e),r||p.error("Could not flag installation complete (set manually later)"),!1}}async function ye(){if(d)try{const{data:r,error:e}=await d.from("profiles").select("id").eq("role","admin").limit(1);!e&&r&&r.length>0&&(ee.value=!0,p.info("Admin already exists – skipping creation"),W.value||await ie(),setTimeout(()=>{K.push({name:"Login",query:{installed:"1"}})},600))}catch(r){console.warn("Admin existence check failed",r)}}return(r,e)=>(l(),u("div",Ue,[t("header",Ie,[t("div",Te,[s(a(i),{icon:"mdi:cog-play",class:"w-7 h-7"})]),t("div",null,[e[8]||(e[8]=t("h1",{class:"text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100"}," Installation Wizard ",-1)),t("p",Le," Guided setup for "+g(a($e).name),1)])]),t("nav",Ve,[(l(),u(C,null,N(le,n=>t("button",{key:n.step,type:"button",disabled:n.disabled&&n.step>b.value,onClick:S=>n.step<b.value?me(n.step):null,class:m(["group flex items-center gap-3 pl-0 pr-5 rounded-full border transition-colors",[b.value===n.step?"border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300":"border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-300",n.disabled&&n.step>b.value?"opacity-40 cursor-not-allowed":"cursor-pointer"]])},[t("span",{class:m(["w-9 h-9 inline-flex items-center justify-center rounded-full text-base font-semibold border",b.value===n.step?"border-blue-500 bg-white/80 dark:bg-gray-900":"border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/40"])},[s(a(i),{icon:n.icon,class:"text-lg"},null,8,["icon"])],2),t("span",Oe,[t("span",Me,g(n.title),1),t("span",Fe,g(n.description),1)])],10,ze)),64))]),b.value===1?(l(),u("section",De,[t("div",Qe,[t("div",Ge,[s(a(i),{icon:"mdi:script-text",class:"w-6 h-6"})]),e[9]||(e[9]=t("div",{class:"flex-1"},[t("h2",{class:"text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase"}," 1 · Run Migration SQL "),t("p",{class:"text-[13px] text-gray-500 dark:text-gray-400 mt-1"},[_(" Execute the SQL below in the "),t("strong",null,"SQL Editor"),_(" (or psql). It creates tables, functions and policies and buckets. ")])],-1))]),t("div",He,[t("div",We,[t("pre",Ye,g(a(te)),1),t("button",{type:"button",onClick:fe,class:"absolute top-2 right-2 inline-flex items-center gap-1 h-7 px-3 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"},[s(a(i),{icon:"mdi:content-copy",class:"text-sm"}),e[10]||(e[10]=_(" Copy ",-1))])]),t("label",Ke,[s(Be,{modelValue:z.value,"onUpdate:modelValue":e[0]||(e[0]=n=>z.value=n),"aria-label":"Confirm SQL was run"},null,8,["modelValue"]),e[11]||(e[11]=_(" I ran the SQL successfully ",-1))]),t("div",Ze,[t("button",{type:"button",onClick:se,disabled:!z.value,class:"inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-400 border border-green-200/70 dark:border-green-800/40"},[s(a(i),{icon:"mdi:arrow-right",class:"text-base"}),e[12]||(e[12]=_(" Proceed to Verify ",-1))],8,Xe)])])])):b.value===2?(l(),u("section",Je,[t("div",et,[t("div",tt,[s(a(i),{icon:"mdi:check-decagram",class:"w-6 h-6"})]),t("div",rt,[e[13]||(e[13]=t("h2",{class:"text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase"}," 2 · Verify Schema & Storage ",-1)),t("p",nt," Run automated checks for required tables, functions, buckets and policies. Supabase credentials are "+g(ue.value?"loaded from runtime environment":"not configured")+". ",1)])]),t("div",at,[t("div",st,[t("div",it,[s(a(i),{icon:"mdi:information",class:"text-blue-500"}),e[14]||(e[14]=t("span",{class:"font-semibold text-gray-700 dark:text-gray-200"},"Using Environment Credentials",-1))]),t("div",ot,[t("div",null,[e[15]||(e[15]=t("p",{class:"uppercase text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1"}," VITE_SUPABASE_URL ",-1)),t("code",lt,g(y.value),1)]),t("div",null,[e[16]||(e[16]=t("p",{class:"uppercase text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1"}," VITE_SUPABASE_ANON_KEY ",-1)),t("code",ut,g(de.value),1)])]),D.value?(l(),u("p",dt," Loading runtime credentials… ")):(l(),u("p",ct," To override, set container env vars and restart the server. "))]),t("div",pt,[t("button",{type:"button",onClick:pe,disabled:D.value||k.value||!y.value||!f.value,class:"inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-blue-200/70 dark:border-blue-800/40"},[s(a(i),{icon:k.value?"mdi:loading":"mdi:play-circle",class:m([k.value?"animate-spin":"","text-base"])},null,8,["icon","class"]),t("span",null,g(k.value?"Verifying...":"Run Checks"),1)],8,gt),t("button",{type:"button",onClick:Y,class:"text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 inline-flex items-center gap-1 ml-auto"},[s(a(i),{icon:"mdi:arrow-left",class:"text-sm"}),e[17]||(e[17]=_(" Back ",-1))])]),J.value?(l(),u("div",{key:0,class:m(["text-xs pt-1",v.value?"text-green-600 dark:text-green-300":"text-amber-600 dark:text-amber-400"])},g(v.value?"All resources verified.":"Some resources missing or failing."),3)):U("",!0),t("div",bt,[t("div",null,[e[18]||(e[18]=t("p",{class:"font-semibold mb-1 text-gray-700 dark:text-gray-300"}," Tables ",-1)),t("ul",_t,[(l(!0),u(C,null,N(T.value,n=>(l(),u("li",{key:n.name,class:m([n.status==="ok"?"text-green-600 dark:text-green-300":n.status==="fail"?"text-red-600 dark:text-red-400":"text-gray-500 dark:text-gray-400","flex items-center gap-1"])},[s(a(i),{icon:n.status==="ok"?"mdi:check-circle":n.status==="fail"?"mdi:alert-circle":"mdi:clock-outline",class:"text-xs"},null,8,["icon"]),_(" "+g(n.name),1)],2))),128))])]),t("div",null,[e[19]||(e[19]=t("p",{class:"font-semibold mb-1 text-gray-700 dark:text-gray-300"}," Functions ",-1)),t("ul",mt,[(l(!0),u(C,null,N(L.value,n=>(l(),u("li",{key:n.name,class:m([n.status==="ok"?"text-green-600 dark:text-green-300":n.status==="fail"?"text-red-600 dark:text-red-400":"text-gray-500 dark:text-gray-400","flex items-center gap-1"])},[s(a(i),{icon:n.status==="ok"?"mdi:check-circle":n.status==="fail"?"mdi:alert-circle":"mdi:clock-outline",class:"text-xs"},null,8,["icon"]),_(" "+g(n.name),1)],2))),128))])]),t("div",null,[e[20]||(e[20]=t("p",{class:"font-semibold mb-1 text-gray-700 dark:text-gray-300"}," Buckets ",-1)),t("ul",ft,[(l(!0),u(C,null,N(V.value,n=>(l(),u("li",{key:n.name,class:m([n.status==="ok"?"text-green-600 dark:text-green-300":n.status==="fail"?"text-red-600 dark:text-red-400":"text-gray-500 dark:text-gray-400","flex flex-col"])},[t("div",xt,[s(a(i),{icon:n.status==="ok"?"mdi:check-circle":n.status==="fail"?"mdi:alert-circle":"mdi:clock-outline",class:"text-xs"},null,8,["icon"]),t("span",null,g(n.name),1)]),n.status==="fail"&&n.detail?(l(),u("div",yt,g(_e(n)),1)):U("",!0)],2))),128))])]),t("div",null,[e[21]||(e[21]=t("p",{class:"font-semibold mb-1 text-gray-700 dark:text-gray-300"}," Policies ",-1)),t("ul",ht,[(l(!0),u(C,null,N(q.value,n=>(l(),u("li",{key:n.name,class:m([n.status==="ok"?"text-green-600 dark:text-green-300":n.status==="fail"?"text-red-600 dark:text-red-400":"text-gray-500 dark:text-gray-400","flex items-center gap-1"])},[s(a(i),{icon:n.status==="ok"?"mdi:check-circle":n.status==="fail"?"mdi:alert-circle":"mdi:clock-outline",class:"text-xs"},null,8,["icon"]),_(" "+g(n.name),1)],2))),128))])])]),t("div",kt,[t("button",{onClick:se,disabled:!v.value,class:"inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-400 border border-green-200/70 dark:border-green-800/40"},[s(a(i),{icon:"mdi:arrow-right",class:"text-base"}),e[22]||(e[22]=_(" Continue to Branding ",-1))],8,vt)])])])):b.value===3?(l(),u("section",wt,[t("div",St,[t("div",jt,[s(a(i),{icon:"mdi:brush",class:"w-6 h-6"})]),e[23]||(e[23]=t("div",{class:"flex-1"},[t("h2",{class:"text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase"}," 3 · Site Branding "),t("p",{class:"text-[13px] text-gray-500 dark:text-gray-400 mt-1"}," Set the site name and description. You can add logos and social links later in the dashboard. ")],-1))]),t("div",Ct,[t("div",null,[e[24]||(e[24]=t("label",{class:"block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1"},"Site Name",-1)),$(t("input",{"onUpdate:modelValue":e[1]||(e[1]=n=>E.value=n),type:"text",class:"w-full h-11 rounded-md px-3 bg-white dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"My Awesome Blog"},null,512),[[I,E.value,void 0,{trim:!0}]])]),t("div",null,[e[25]||(e[25]=t("label",{class:"block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1"},"Description",-1)),$(t("textarea",{"onUpdate:modelValue":e[2]||(e[2]=n=>F.value=n),rows:"3",class:"w-full rounded-md px-3 py-2 bg-white dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"Short tagline about the site"},null,512),[[I,F.value,void 0,{trim:!0}]])]),t("div",$t,[t("button",{type:"button",onClick:ce,disabled:h.value||!E.value,class:"inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-50 border border-blue-200/70 dark:border-blue-800/40"},[s(a(i),{icon:h.value?"mdi:loading":"mdi:content-save",class:m([h.value?"animate-spin":"","text-base"])},null,8,["icon","class"]),t("span",null,g(h.value?"Saving...":"Save & Continue"),1)],8,At),t("button",{type:"button",onClick:Y,class:"text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 inline-flex items-center gap-1 ml-auto"},[s(a(i),{icon:"mdi:arrow-left",class:"text-sm"}),e[26]||(e[26]=_(" Back ",-1))])])])])):b.value===4?(l(),u("section",Et,[t("div",qt,[t("div",Rt,[s(a(i),{icon:"mdi:account-check",class:"w-6 h-6"})]),e[27]||(e[27]=t("div",{class:"flex-1"},[t("h2",{class:"text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase"}," 4 · Create Admin Account "),t("p",{class:"text-[13px] text-gray-500 dark:text-gray-400 mt-1"}," Create the first user. After email confirmation. ")],-1))]),ee.value?(l(),u("div",Ht,[s(a(i),{icon:"mdi:shield-account",class:"text-blue-500 dark:text-blue-300 mt-0.5"}),e[36]||(e[36]=t("div",null,[t("p",{class:"font-semibold"},"Admin already exists"),t("p",{class:"text-[12px] mt-1"},"Redirecting you to login…")],-1))])):(l(),u(C,{key:0},[t("form",{onSubmit:qe(xe,["prevent"]),class:"space-y-6",novalidate:""},[t("div",null,[t("label",Pt,[s(a(i),{icon:"mdi:email-outline",class:"text-base text-blue-500"}),e[28]||(e[28]=_(" Email ",-1))]),$(t("input",{"onUpdate:modelValue":e[3]||(e[3]=n=>O.value=n),type:"email",autocomplete:"email",placeholder:"admin@example.com",class:"w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 px-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500",required:""},null,512),[[I,O.value,void 0,{trim:!0}]])]),t("div",null,[t("div",Bt,[t("label",Nt,[s(a(i),{icon:"mdi:lock-outline",class:"text-base text-blue-500"}),e[29]||(e[29]=_(" Password ",-1))]),e[30]||(e[30]=t("span",{class:"text-[11px] text-gray-400 dark:text-gray-500"},"Min 8 chars",-1))]),t("div",Ut,[$(t("input",{type:B.value?"text":"password","onUpdate:modelValue":e[4]||(e[4]=n=>R.value=n),autocomplete:"new-password",placeholder:"••••••••",class:"w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 px-3 pr-10 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500",required:"",onInput:be},null,40,It),[[Ae,R.value]]),t("button",{type:"button",onClick:e[5]||(e[5]=n=>B.value=!B.value),"aria-label":B.value?"Hide password":"Show password",class:"absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"},[s(a(i),{icon:B.value?"mdi:eye-off-outline":"mdi:eye-outline",class:"text-lg"},null,8,["icon"])],8,Tt)]),t("div",Lt,[t("div",Vt,[t("div",{class:m(["h-full transition-all",c.barClass]),style:Ee({width:c.percent+"%"})},null,6)]),t("span",{class:m(["font-medium",c.textClass])},g(c.label),3)])]),t("div",null,[t("div",zt,[t("label",Ot,[s(a(i),{icon:"mdi:account-circle",class:"text-base text-blue-500"}),e[31]||(e[31]=_(" Username ",-1))]),e[32]||(e[32]=t("span",{class:"text-[11px] text-gray-400 dark:text-gray-500"},"A–Z, a–z, 0–9, - and _",-1))]),$(t("input",{"onUpdate:modelValue":e[6]||(e[6]=n=>P.value=n),type:"text",autocomplete:"username",placeholder:"yourusername",class:m(["w-full h-11 rounded-md border bg-white dark:bg-gray-900/40 px-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500",x.value?"border-red-500 focus:ring-red-500 dark:border-red-500":"border-gray-300 dark:border-gray-600"]),required:"",onInput:ne},null,34),[[I,P.value,void 0,{trim:!0}]]),x.value?(l(),u("div",Mt,g(x.value),1)):U("",!0)]),t("div",null,[t("label",Ft,[s(a(i),{icon:"mdi:card-account-details-outline",class:"text-base text-blue-500"}),e[33]||(e[33]=_(" Display Name ",-1))]),$(t("input",{"onUpdate:modelValue":e[7]||(e[7]=n=>M.value=n),type:"text",autocomplete:"name",placeholder:"Your name",class:"w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 px-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500",required:""},null,512),[[I,M.value,void 0,{trim:!0}]])]),t("div",Dt,[t("button",{type:"button",onClick:Y,class:"inline-flex items-center gap-2 h-10 px-4 rounded-md text-sm font-medium bg-gray-50 dark:bg-gray-700/30 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-gray-300 border border-gray-200 dark:border-gray-600"},[s(a(i),{icon:"mdi:arrow-left",class:"text-base"}),e[34]||(e[34]=_(" Back ",-1))]),t("button",{type:"submit",disabled:w.value||!!x.value||!O.value||!R.value||!P.value||!M.value||c.percent<25,class:"inline-flex items-center justify-center gap-2 h-10 px-6 rounded-md text-sm font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 focus:outline-none focus:ring-2 focus:ring-green-400 border border-green-200/70 dark:border-green-800/40 disabled:opacity-50"},[s(a(i),{icon:w.value?"mdi:loading":"mdi:account-plus",class:m([w.value?"animate-spin":"","text-base"])},null,8,["icon","class"]),t("span",null,g(w.value?"Creating...":"Create Admin"),1)],8,Qt)])],32),H.value?(l(),u("div",Gt,[s(a(i),{icon:"mdi:check-circle",class:"text-green-500 dark:text-green-300 mt-0.5"}),e[35]||(e[35]=t("div",null,[t("p",{class:"font-semibold"},"Admin account created."),t("p",{class:"text-[12px] mt-1"}," Please check your email to confirm the address before logging in. ")],-1))])):U("",!0)],64))])):U("",!0)]))}});export{Zt as default};
