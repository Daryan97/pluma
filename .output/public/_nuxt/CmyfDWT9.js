import{J as Se,y as Ce,u as je,P as Ee,B as Ae,Q as $e,d as p,e as g,f as e,g as u,h as l,I as c,t as b,H as Re,F as R,r as U,n as y,i as x,j as N,w as q,v as T,L as qe,E as Le,D as Be,m as d,p as J,R as pe,O as Ie,S as Pe}from"./PSvlVfzj.js";import{_ as Ue}from"./CDSpod7l.js";const Ne=`/* ===========================================\r
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
    on auth.users for each row execute function public.handle_new_user();`;function Te(){return[{name:"categories",kind:"table",status:"pending"},{name:"profiles",kind:"table",status:"pending"},{name:"posts",kind:"table",status:"pending"},{name:"comments",kind:"table",status:"pending"},{name:"settings",kind:"table",status:"pending"},{name:"series",kind:"table",status:"pending"}]}function Ve(){return[{name:"is_admin",kind:"function",status:"pending"},{name:"is_author",kind:"function",status:"pending"},{name:"handle_new_user",kind:"function",status:"pending"},{name:"touch_updated_at",kind:"function",status:"pending"},{name:"publish_due_posts",kind:"function",status:"pending"},{name:"get_post_by_preview_token",kind:"function",status:"pending"}]}function Oe(){return[{name:"post-thumbnails",kind:"bucket",status:"pending",expectedPublic:!0},{name:"profile-avatar",kind:"bucket",status:"pending",expectedPublic:!0},{name:"branding",kind:"bucket",status:"pending",expectedPublic:!0}]}function ze(){return[{name:"RLS enabled",kind:"policy",status:"pending"}]}function Me(o){for(const n of o)n.status="pending",n.detail=""}function Fe(o){return o.every(n=>n.status==="ok")}function ge(o){const n=String(o||"").toLowerCase();return n.includes("could not find")||n.includes("does not exist")||n.includes("pgrst202")||n.includes("schema cache")}async function De(o,n){for(const r of n)try{const s=r.name==="settings"?"key":"id",m=await o.from(r.name).select(s).limit(1);if(m.error)throw m.error;r.status="ok"}catch(s){r.status="fail",r.detail=s.message}}async function Qe(o,n){for(const r of n)try{if(r.name==="is_admin"||r.name==="is_author"){const s=await o.rpc(r.name);if(s.error)throw s.error;r.status="ok"}else if(r.name==="handle_new_user"){const s=await o.from("profiles").select("id").limit(1);if(s.error)throw s.error;r.status="ok"}else if(r.name==="touch_updated_at"){const s=await o.from("categories").select("id").limit(1);if(s.error)throw s.error;r.status="ok"}else if(r.name==="publish_due_posts"){const s=await o.rpc(r.name);if(s.error&&ge(s.error.message))throw s.error;r.status="ok"}else if(r.name==="get_post_by_preview_token"){const s=await o.rpc(r.name,{p_token:"00000000-0000-0000-0000-000000000000"});if(s.error&&ge(s.error.message))throw s.error;r.status="ok"}else r.status="fail",r.detail="No verification path for this function"}catch(s){r.status="fail",r.detail=s.message}}async function He(o,n){for(const r of n)try{const s=await o.storage.getBucket(r.name),m=s.data,h=s.error;if(h||!m){if(r.name.endsWith("s")){const j=r.name.slice(0,-1);try{const v=await o.storage.getBucket(j);if(v.data&&!v.error){r.status="fail",r.detail="Found '"+j+"' but expected '"+r.name+"' (rename bucket)";continue}}catch{}}r.status="fail",r.detail=h?h.message:"Bucket not found";continue}const _=m.public===!0;r.expectedPublic?_?r.status="ok":(r.status="fail",r.detail="Exists but not public"):_?(r.status="fail",r.detail="Public but expected private"):r.status="ok"}catch(s){r.status="fail",r.detail=s.message||"Error verifying bucket"}}async function We(o,n){try{const r=await o.from("categories").select("id").limit(1);if(r.error)throw r.error;n[0].status="ok"}catch(r){n[0].status="fail",n[0].detail=r.message}}async function Ge(o,n){const{tableChecks:r,functionChecks:s,bucketChecks:m,policyChecks:h}=n;return Me([...r,...s,...m,...h]),await De(o,r),await Qe(o,s),await He(o,m),await We(o,h),Fe([...r,...s,...m])}function Ye(o){const n=o.detail||"";if(!n)return"Unknown failure";const r=n.toLowerCase();return r.includes("not found")?"Bucket not found. Create it in Storage with Public enabled and correct MIME types.":r.includes("not public")||r.includes("exists but not public")?"Bucket exists but is private. Edit bucket -> toggle Public.":r.includes("rename bucket")?n+" Update policy names or bucket to match expected id.":r.includes("public but expected private")?"Bucket is public but expected private per configuration.":n}function Ke(o){const n=String(o||"").trim();if(!n)return"Required";if(n.length<3||n.length>20)return"3-20 chars: letters, numbers, - _";for(let r=0;r<n.length;r++){const s=n.charCodeAt(r),m=s>=65&&s<=90||s>=97&&s<=122,h=s>=48&&s<=57,_=n[r]==="_"||n[r]==="-";if(!m&&!h&&!_)return"3-20 chars: letters, numbers, - _"}return""}function Xe(o){const n=String(o||"");let r=0;if(n.length<8)return 10;r+=30,n.toUpperCase()!==n&&(r+=15),n.toLowerCase()!==n&&(r+=15);let s=!1,m=!1;for(let h=0;h<n.length;h++){const _=n.charCodeAt(h);_>=48&&_<=57?s=!0:_>=65&&_<=90||_>=97&&_<=122||(m=!0)}return s&&(r+=15),m&&(r+=15),n.length>=12&&(r+=10),Math.min(r,100)}function Je(o){return o<30?{label:"Weak",barClass:"bg-red-400 dark:bg-red-500",textClass:"text-red-500 dark:text-red-400"}:o<60?{label:"Fair",barClass:"bg-yellow-400 dark:bg-yellow-500",textClass:"text-yellow-600 dark:text-yellow-400"}:o<85?{label:"Good",barClass:"bg-blue-400 dark:bg-blue-500",textClass:"text-blue-600 dark:text-blue-400"}:{label:"Strong",barClass:"bg-green-500 dark:bg-green-500",textClass:"text-green-600 dark:text-green-400"}}const Ze={class:"max-w-5xl mx-auto px-4 py-12 space-y-10"},et={class:"flex items-center gap-3"},tt={class:"p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"},rt={class:"text-sm text-gray-500 dark:text-gray-400"},nt={class:"flex flex-wrap justify-center gap-4 mb-6 pt-1","aria-label":"Setup Progress"},at=["disabled","onClick"],st={class:"flex flex-col items-start leading-tight"},it={class:"text-xs font-semibold uppercase tracking-wide"},ot={class:"text-[10px] text-gray-400 dark:text-gray-500"},lt={key:0,class:"rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-6"},ut={class:"flex items-start gap-3"},ct={class:"p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300"},dt={class:"space-y-4"},pt={class:"relative"},gt={class:"rounded-md bg-gray-900 text-gray-100 text-[11px] leading-relaxed p-4 max-h-72 overflow-auto whitespace-pre-wrap"},bt={class:"flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-300 cursor-pointer select-none pt-2"},_t={class:"flex items-center gap-3 pt-2"},mt=["disabled"],ft={key:1,class:"rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-6"},xt={class:"flex items-start gap-3"},ht={class:"p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"},yt={class:"flex-1"},kt={class:"text-[13px] text-gray-500 dark:text-gray-400 mt-1"},vt={class:"space-y-5"},wt={class:"rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-4 text-xs space-y-3"},St={class:"flex items-center gap-2"},Ct={class:"grid sm:grid-cols-2 gap-4"},jt={class:"break-all text-[11px] text-gray-800 dark:text-gray-200"},Et={class:"break-all text-[11px] text-gray-800 dark:text-gray-200"},At={key:0,class:"text-[11px] text-gray-500 dark:text-gray-400"},$t={key:1,class:"text-[11px] text-gray-500 dark:text-gray-400"},Rt={class:"flex items-center gap-3 pt-2"},qt=["disabled"],Lt={class:"grid md:grid-cols-2 gap-6 pt-6 text-[11px]"},Bt={class:"space-y-1"},It={class:"space-y-1"},Pt={class:"space-y-1"},Ut={class:"flex items-center gap-1"},Nt={key:0,class:"pl-4 text-[10px] leading-snug opacity-90"},Tt={class:"space-y-1"},Vt={class:"pt-6"},Ot=["disabled"],zt={key:2,class:"rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-6"},Mt={class:"flex items-start gap-3"},Ft={class:"p-2 rounded-lg bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300"},Dt={class:"space-y-4"},Qt={class:"flex items-center gap-3 pt-2"},Ht=["disabled"],Wt={key:3,class:"rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-8"},Gt={class:"flex items-start gap-3"},Yt={class:"p-2 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300"},Kt={class:"flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"},Xt={class:"flex items-center justify-between mb-1"},Jt={class:"flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300"},Zt={class:"relative group"},er=["type"],tr=["aria-label"],rr={class:"mt-1 flex items-center gap-2 text-[11px]"},nr={class:"flex-1 h-1 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden"},ar={class:"flex items-center justify-between mb-1"},sr={class:"flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300"},ir={key:0,class:"mt-1 text-[11px] text-red-600 dark:text-red-400"},or={class:"flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"},lr={class:"flex items-center gap-3"},ur=["disabled"],cr={key:0,class:"rounded-md border border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-900/30 p-4 text-sm text-green-800 dark:text-green-200 flex items-start gap-3"},dr={key:1,class:"rounded-md border border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 p-4 text-sm text-blue-800 dark:text-blue-200 flex items-start gap-3"},br={__name:"install",setup(o){const n=Se(),r=Ce(),{locale:s,setLocale:m}=je();Ee({htmlAttrs:{lang:"en",dir:"ltr"}});const h=[{step:1,title:"SQL",description:"Copy & run migration",icon:"mdi:script-text"},{step:2,title:"Verify",description:"Check schema & storage",icon:"mdi:check-decagram"},{step:3,title:"Branding",description:"Set site name",icon:"mdi:brush"},{step:4,title:"Admin",description:"Create admin account",icon:"mdi:account-star"}],_=d(""),j=d(""),v=d(!1),Z=d(!1),f=d(1),C=d(""),S=d(""),M=d(!0),F=d(""),D=d("");let k=null;const be=J(()=>!!C.value&&!!S.value),Q=d(Te()),H=d(Ve()),W=d(Oe()),ee=d(ze()),E=d(!1),te=d(!1),L=J(()=>[...Q.value,...H.value,...W.value].every(i=>i.status==="ok")),V=d(!1),O=d(""),B=d(""),I=d(""),z=d(""),P=d(!1),A=d(""),w=Ie({percent:0,label:"Weak",barClass:"bg-red-400 dark:bg-red-500",textClass:"text-red-500 dark:text-red-400"}),$=d(!1),G=d(!1),Y=d(!1),re=d(!1),ne=String(Ne);function ae(i){C.value=i&&i.VITE_SUPABASE_URL||"",S.value=i&&i.VITE_SUPABASE_ANON_KEY||""}ae(Pe());async function _e(){try{l(s)!=="en"&&await m("en")}catch{}}Ae(async()=>{await _e();try{ae(await $e())}finally{M.value=!1}});const me=J(()=>S.value?S.value.slice(0,16)+"..."+S.value.slice(-8):"");function se(i){return i<=f.value?!1:i>=2&&!V.value||i>=3&&!L.value||i>=4&&(!L.value||!Z.value)}function ie(){return F.value="",D.value="",C.value||(F.value="Missing URL"),S.value||(D.value="Missing anon key"),!F.value&&!D.value}async function fe(){if(!_.value.trim()){n.error("Site name required");return}if(ie()){v.value=!0;try{k=pe(C.value,S.value,{auth:{persistSession:!1}});const t=(await k.from("settings").insert({key:"branding",value:{siteName:_.value.trim(),siteDescription:j.value.trim(),socialLinks:[]}})).error;if(t&&t.code!=="42501")throw t;Z.value=!0,t&&t.code==="42501"?n.info("Branding already exists (skipped). You can update it later in the dashboard."):n.success("Branding saved"),f.value=4}catch(i){n.error(i.message||"Failed to save branding")}finally{v.value=!1}}}async function xe(){if(ie()){E.value=!0,te.value=!0,k=null;try{k=pe(C.value,S.value,{auth:{persistSession:!1}}),await Ge(k,{tableChecks:Q.value,functionChecks:H.value,bucketChecks:W.value,policyChecks:ee.value})?n.success("All checks passed"):n.info("Verification finished (review results)")}catch(i){console.error(i),n.error("Verification failed")}finally{E.value=!1}}}function oe(){A.value=Ke(I.value)}function le(){const i=Xe(B.value),t=Je(i);w.percent=i,w.label=t.label,w.barClass=t.barClass,w.textClass=t.textClass}function ue(){f.value<4&&(f.value++,f.value===4&&ve())}function K(){f.value>1&&f.value--}function he(i){i<f.value&&(f.value=i)}async function ye(){try{await navigator.clipboard.writeText(ne),n.success("SQL copied")}catch{n.error("Copy failed")}}async function ke(){if(!k){n.error("Reconnect first");return}if(oe(),le(),A.value||w.percent<25){n.error("Fix validation issues");return}$.value=!0,G.value=!1;try{if(!await ce(!0)){n.error("Cannot set installation flag; aborting admin creation");return}const t=await k.auth.signUp({email:O.value,password:B.value,options:{data:{username:I.value,display_name:z.value}}});if(t.error)throw t.error;G.value=!0,n.success("Admin user created (confirm email if required)"),setTimeout(()=>{r.push({name:"Login",query:{installed:"1"}})},600)}catch(i){console.error(i),n.error(i.message||"Failed")}finally{$.value=!1}}async function ce(i){if(i===void 0&&(i=!1),!k)return!1;try{const t=await k.from("settings").select("value").eq("key","installation").maybeSingle(),a=t.data;if(!t.error&&a){const X=a.value;return X&&typeof X=="object"&&X.complete===!0?(Y.value=!0,!0):(n.error("Existing installation flag present but incomplete. Use admin to finalize."),!1)}const de=await k.from("settings").insert({key:"installation",value:{complete:!0,completed_at:new Date().toISOString()}});if(de.error)throw de.error;return Y.value=!0,i||n.success("Installation marked complete"),!0}catch(t){return console.warn("Failed to mark installation complete",t),i||n.error("Could not flag installation complete (set manually later)"),!1}}async function ve(){if(k)try{const i=await k.from("profiles").select("id").eq("role","admin").limit(1),t=i.data;!i.error&&t&&t.length>0&&(re.value=!0,n.info("Admin already exists – skipping creation"),Y.value||await ce(),setTimeout(()=>{r.push({name:"Login",query:{installed:"1"}})},600))}catch(i){console.warn("Admin existence check failed",i)}}return(i,t)=>(p(),g("div",Ze,[e("header",et,[e("div",tt,[u(l(c),{icon:"mdi:cog-play",class:"w-7 h-7"})]),e("div",null,[t[8]||(t[8]=e("h1",{class:"text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100"}," Installation Wizard ",-1)),e("p",rt," Guided setup for "+b(l(Re).name||"Pluma"),1)])]),e("nav",nt,[(p(),g(R,null,U(h,a=>e("button",{key:a.step,type:"button",disabled:se(a.step),onClick:we=>a.step<f.value?he(a.step):null,class:y(["group flex items-center gap-3 pl-0 pr-5 rounded-full border transition-colors",[f.value===a.step?"border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300":"border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-300",se(a.step)?"opacity-40 cursor-not-allowed":"cursor-pointer"]])},[e("span",{class:y(["w-9 h-9 inline-flex items-center justify-center rounded-full text-base font-semibold border",f.value===a.step?"border-blue-500 bg-white/80 dark:bg-gray-900":"border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/40"])},[u(l(c),{icon:a.icon,class:"text-lg"},null,8,["icon"])],2),e("span",st,[e("span",it,b(a.title),1),e("span",ot,b(a.description),1)])],10,at)),64))]),f.value===1?(p(),g("section",lt,[e("div",ut,[e("div",ct,[u(l(c),{icon:"mdi:script-text",class:"w-6 h-6"})]),t[9]||(t[9]=e("div",{class:"flex-1"},[e("h2",{class:"text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase"}," 1 · Run Migration SQL "),e("p",{class:"text-[13px] text-gray-500 dark:text-gray-400 mt-1"},[x(" Execute the SQL below in the "),e("strong",null,"SQL Editor"),x(" (or psql). It creates tables, functions and policies and buckets. ")])],-1))]),e("div",dt,[e("div",pt,[e("pre",gt,b(l(ne)),1),e("button",{type:"button",onClick:ye,class:"absolute top-2 right-2 inline-flex items-center gap-1 h-7 px-3 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"},[u(l(c),{icon:"mdi:content-copy",class:"text-sm"}),t[10]||(t[10]=x(" Copy ",-1))])]),e("label",bt,[u(Ue,{modelValue:V.value,"onUpdate:modelValue":t[0]||(t[0]=a=>V.value=a),"aria-label":"Confirm SQL was run"},null,8,["modelValue"]),t[11]||(t[11]=x(" I ran the SQL successfully ",-1))]),e("div",_t,[e("button",{type:"button",onClick:ue,disabled:!V.value,class:"inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-400 border border-green-200/70 dark:border-green-800/40"},[u(l(c),{icon:"mdi:arrow-right",class:"text-base"}),t[12]||(t[12]=x(" Proceed to Verify ",-1))],8,mt)])])])):f.value===2?(p(),g("section",ft,[e("div",xt,[e("div",ht,[u(l(c),{icon:"mdi:check-decagram",class:"w-6 h-6"})]),e("div",yt,[t[13]||(t[13]=e("h2",{class:"text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase"}," 2 · Verify Schema & Storage ",-1)),e("p",kt," Run automated checks for required tables, functions, buckets and policies. Supabase credentials are "+b(be.value?"loaded from runtime environment":"not configured")+". ",1)])]),e("div",vt,[e("div",wt,[e("div",St,[u(l(c),{icon:"mdi:information",class:"text-blue-500"}),t[14]||(t[14]=e("span",{class:"font-semibold text-gray-700 dark:text-gray-200"},"Using Environment Credentials",-1))]),e("div",Ct,[e("div",null,[t[15]||(t[15]=e("p",{class:"uppercase text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1"}," VITE_SUPABASE_URL ",-1)),e("code",jt,b(C.value),1)]),e("div",null,[t[16]||(t[16]=e("p",{class:"uppercase text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1"}," VITE_SUPABASE_ANON_KEY ",-1)),e("code",Et,b(me.value),1)])]),M.value?(p(),g("p",At," Loading runtime credentials… ")):(p(),g("p",$t," To override, set container env vars and restart the server. "))]),e("div",Rt,[e("button",{type:"button",onClick:xe,disabled:M.value||E.value||!C.value||!S.value,class:"inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-blue-200/70 dark:border-blue-800/40"},[u(l(c),{icon:E.value?"mdi:loading":"mdi:play-circle",class:y([E.value?"animate-spin":"","text-base"])},null,8,["icon","class"]),e("span",null,b(E.value?"Verifying...":"Run Checks"),1)],8,qt),e("button",{type:"button",onClick:K,class:"text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 inline-flex items-center gap-1 ml-auto"},[u(l(c),{icon:"mdi:arrow-left",class:"text-sm"}),t[17]||(t[17]=x(" Back ",-1))])]),te.value?(p(),g("div",{key:0,class:y(["text-xs pt-1",L.value?"text-green-600 dark:text-green-300":"text-amber-600 dark:text-amber-400"])},b(L.value?"All resources verified.":"Some resources missing or failing."),3)):N("",!0),e("div",Lt,[e("div",null,[t[18]||(t[18]=e("p",{class:"font-semibold mb-1 text-gray-700 dark:text-gray-300"}," Tables ",-1)),e("ul",Bt,[(p(!0),g(R,null,U(Q.value,a=>(p(),g("li",{key:a.name,class:y([a.status==="ok"?"text-green-600 dark:text-green-300":a.status==="fail"?"text-red-600 dark:text-red-400":"text-gray-500 dark:text-gray-400","flex items-center gap-1"])},[u(l(c),{icon:a.status==="ok"?"mdi:check-circle":a.status==="fail"?"mdi:alert-circle":"mdi:clock-outline",class:"text-xs"},null,8,["icon"]),x(" "+b(a.name),1)],2))),128))])]),e("div",null,[t[19]||(t[19]=e("p",{class:"font-semibold mb-1 text-gray-700 dark:text-gray-300"}," Functions ",-1)),e("ul",It,[(p(!0),g(R,null,U(H.value,a=>(p(),g("li",{key:a.name,class:y([a.status==="ok"?"text-green-600 dark:text-green-300":a.status==="fail"?"text-red-600 dark:text-red-400":"text-gray-500 dark:text-gray-400","flex items-center gap-1"])},[u(l(c),{icon:a.status==="ok"?"mdi:check-circle":a.status==="fail"?"mdi:alert-circle":"mdi:clock-outline",class:"text-xs"},null,8,["icon"]),x(" "+b(a.name),1)],2))),128))])]),e("div",null,[t[20]||(t[20]=e("p",{class:"font-semibold mb-1 text-gray-700 dark:text-gray-300"}," Buckets ",-1)),e("ul",Pt,[(p(!0),g(R,null,U(W.value,a=>(p(),g("li",{key:a.name,class:y([a.status==="ok"?"text-green-600 dark:text-green-300":a.status==="fail"?"text-red-600 dark:text-red-400":"text-gray-500 dark:text-gray-400","flex flex-col"])},[e("div",Ut,[u(l(c),{icon:a.status==="ok"?"mdi:check-circle":a.status==="fail"?"mdi:alert-circle":"mdi:clock-outline",class:"text-xs"},null,8,["icon"]),e("span",null,b(a.name),1)]),a.status==="fail"&&a.detail?(p(),g("div",Nt,b(l(Ye)(a)),1)):N("",!0)],2))),128))])]),e("div",null,[t[21]||(t[21]=e("p",{class:"font-semibold mb-1 text-gray-700 dark:text-gray-300"}," Policies ",-1)),e("ul",Tt,[(p(!0),g(R,null,U(ee.value,a=>(p(),g("li",{key:a.name,class:y([a.status==="ok"?"text-green-600 dark:text-green-300":a.status==="fail"?"text-red-600 dark:text-red-400":"text-gray-500 dark:text-gray-400","flex items-center gap-1"])},[u(l(c),{icon:a.status==="ok"?"mdi:check-circle":a.status==="fail"?"mdi:alert-circle":"mdi:clock-outline",class:"text-xs"},null,8,["icon"]),x(" "+b(a.name),1)],2))),128))])])]),e("div",Vt,[e("button",{onClick:ue,disabled:!L.value,class:"inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-400 border border-green-200/70 dark:border-green-800/40"},[u(l(c),{icon:"mdi:arrow-right",class:"text-base"}),t[22]||(t[22]=x(" Continue to Branding ",-1))],8,Ot)])])])):f.value===3?(p(),g("section",zt,[e("div",Mt,[e("div",Ft,[u(l(c),{icon:"mdi:brush",class:"w-6 h-6"})]),t[23]||(t[23]=e("div",{class:"flex-1"},[e("h2",{class:"text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase"}," 3 · Site Branding "),e("p",{class:"text-[13px] text-gray-500 dark:text-gray-400 mt-1"}," Set the site name and description. You can add logos and social links later in the dashboard. ")],-1))]),e("div",Dt,[e("div",null,[t[24]||(t[24]=e("label",{class:"block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1"},"Site Name",-1)),q(e("input",{"onUpdate:modelValue":t[1]||(t[1]=a=>_.value=a),type:"text",class:"w-full h-11 rounded-md px-3 bg-white dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"My Awesome Blog"},null,512),[[T,_.value,void 0,{trim:!0}]])]),e("div",null,[t[25]||(t[25]=e("label",{class:"block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1"},"Description",-1)),q(e("textarea",{"onUpdate:modelValue":t[2]||(t[2]=a=>j.value=a),rows:"3",class:"w-full rounded-md px-3 py-2 bg-white dark:bg-gray-900/40 border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"Short tagline about the site"},null,512),[[T,j.value,void 0,{trim:!0}]])]),e("div",Qt,[e("button",{type:"button",onClick:fe,disabled:v.value||!_.value,class:"inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-50 border border-blue-200/70 dark:border-blue-800/40"},[u(l(c),{icon:v.value?"mdi:loading":"mdi:content-save",class:y([v.value?"animate-spin":"","text-base"])},null,8,["icon","class"]),e("span",null,b(v.value?"Saving...":"Save & Continue"),1)],8,Ht),e("button",{type:"button",onClick:K,class:"text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 inline-flex items-center gap-1 ml-auto"},[u(l(c),{icon:"mdi:arrow-left",class:"text-sm"}),t[26]||(t[26]=x(" Back ",-1))])])])])):f.value===4?(p(),g("section",Wt,[e("div",Gt,[e("div",Yt,[u(l(c),{icon:"mdi:account-check",class:"w-6 h-6"})]),t[27]||(t[27]=e("div",{class:"flex-1"},[e("h2",{class:"text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase"}," 4 · Create Admin Account "),e("p",{class:"text-[13px] text-gray-500 dark:text-gray-400 mt-1"}," Create the first user. After email confirmation. ")],-1))]),re.value?(p(),g("div",dr,[u(l(c),{icon:"mdi:shield-account",class:"text-blue-500 dark:text-blue-300 mt-0.5"}),t[36]||(t[36]=e("div",null,[e("p",{class:"font-semibold"},"Admin already exists"),e("p",{class:"text-[12px] mt-1"},"Redirecting you to login…")],-1))])):(p(),g(R,{key:0},[e("form",{onSubmit:Be(ke,["prevent"]),class:"space-y-6",novalidate:""},[e("div",null,[e("label",Kt,[u(l(c),{icon:"mdi:email-outline",class:"text-base text-blue-500"}),t[28]||(t[28]=x(" Email ",-1))]),q(e("input",{"onUpdate:modelValue":t[3]||(t[3]=a=>O.value=a),type:"email",autocomplete:"email",placeholder:"admin@example.com",class:"w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 px-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500",required:""},null,512),[[T,O.value,void 0,{trim:!0}]])]),e("div",null,[e("div",Xt,[e("label",Jt,[u(l(c),{icon:"mdi:lock-outline",class:"text-base text-blue-500"}),t[29]||(t[29]=x(" Password ",-1))]),t[30]||(t[30]=e("span",{class:"text-[11px] text-gray-400 dark:text-gray-500"},"Min 8 chars",-1))]),e("div",Zt,[q(e("input",{type:P.value?"text":"password","onUpdate:modelValue":t[4]||(t[4]=a=>B.value=a),autocomplete:"new-password",placeholder:"••••••••",class:"w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 px-3 pr-10 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500",required:"",onInput:le},null,40,er),[[qe,B.value]]),e("button",{type:"button",onClick:t[5]||(t[5]=a=>P.value=!P.value),"aria-label":P.value?"Hide password":"Show password",class:"absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"},[u(l(c),{icon:P.value?"mdi:eye-off-outline":"mdi:eye-outline",class:"text-lg"},null,8,["icon"])],8,tr)]),e("div",rr,[e("div",nr,[e("div",{class:y(["h-full transition-all",w.barClass]),style:Le({width:w.percent+"%"})},null,6)]),e("span",{class:y(["font-medium",w.textClass])},b(w.label),3)])]),e("div",null,[e("div",ar,[e("label",sr,[u(l(c),{icon:"mdi:account-circle",class:"text-base text-blue-500"}),t[31]||(t[31]=x(" Username ",-1))]),t[32]||(t[32]=e("span",{class:"text-[11px] text-gray-400 dark:text-gray-500"},"A–Z, a–z, 0–9, - and _",-1))]),q(e("input",{"onUpdate:modelValue":t[6]||(t[6]=a=>I.value=a),type:"text",autocomplete:"username",placeholder:"yourusername",class:y(["w-full h-11 rounded-md border bg-white dark:bg-gray-900/40 px-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500",A.value?"border-red-500 focus:ring-red-500 dark:border-red-500":"border-gray-300 dark:border-gray-600"]),required:"",onInput:oe},null,34),[[T,I.value,void 0,{trim:!0}]]),A.value?(p(),g("div",ir,b(A.value),1)):N("",!0)]),e("div",null,[e("label",or,[u(l(c),{icon:"mdi:card-account-details-outline",class:"text-base text-blue-500"}),t[33]||(t[33]=x(" Display Name ",-1))]),q(e("input",{"onUpdate:modelValue":t[7]||(t[7]=a=>z.value=a),type:"text",autocomplete:"name",placeholder:"Your name",class:"w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 px-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500",required:""},null,512),[[T,z.value,void 0,{trim:!0}]])]),e("div",lr,[e("button",{type:"button",onClick:K,class:"inline-flex items-center gap-2 h-10 px-4 rounded-md text-sm font-medium bg-gray-50 dark:bg-gray-700/30 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-gray-300 border border-gray-200 dark:border-gray-600"},[u(l(c),{icon:"mdi:arrow-left",class:"text-base"}),t[34]||(t[34]=x(" Back ",-1))]),e("button",{type:"submit",disabled:$.value||!!A.value||!O.value||!B.value||!I.value||!z.value||w.percent<25,class:"inline-flex items-center justify-center gap-2 h-10 px-6 rounded-md text-sm font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 focus:outline-none focus:ring-2 focus:ring-green-400 border border-green-200/70 dark:border-green-800/40 disabled:opacity-50"},[u(l(c),{icon:$.value?"mdi:loading":"mdi:account-plus",class:y([$.value?"animate-spin":"","text-base"])},null,8,["icon","class"]),e("span",null,b($.value?"Creating...":"Create Admin"),1)],8,ur)])],32),G.value?(p(),g("div",cr,[u(l(c),{icon:"mdi:check-circle",class:"text-green-500 dark:text-green-300 mt-0.5"}),t[35]||(t[35]=e("div",null,[e("p",{class:"font-semibold"},"Admin account created."),e("p",{class:"text-[12px] mt-1"}," Please check your email to confirm the address before logging in. ")],-1))])):N("",!0)],64))])):N("",!0)]))}};export{br as default};
