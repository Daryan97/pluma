/* ===========================================
 INSTALL / SETUP
 - A) App schema (RUN AS NORMAL)
 - B) Storage & auth trigger (RUN AS OWNER)
 =========================================== */
-- ========== A) APP SCHEMA (RUN AS NORMAL) ==========
-- 1) Extension
CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA extensions;

-- 2) Types
do $$ begin if not exists (
    select
        1
    from
        pg_type
    where
        typname = 'user_role'
) then create type public.user_role as enum ('admin', 'author', 'reader', 'disabled');

end if;

end $$;

do $$ begin if not exists (
    select
        1
    from
        pg_type
    where
        typname = 'post_status'
) then create type public.post_status as enum ('draft', 'published', 'archived');

end if;

end $$;

-- 3) Tables
create table if not exists public.categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint categories_name_key unique (name),
    constraint categories_slug_key unique (slug)
);

create table if not exists public.profiles (
    id uuid primary key default auth.uid(),
    username text unique,
    display_name text,
    avatar_url text,
    role public.user_role not null default 'reader',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint profiles_id_fkey foreign key (id) references auth.users (id) on delete cascade
);

create table if not exists public.posts (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    content text not null,
    tags text [] not null default '{}' :: text [],
    slug text not null,
    cover_image_url text,
    author_id uuid not null,
    category_id uuid,
    status public.post_status not null default 'draft',
    comments_disabled boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint posts_slug_key unique (slug),
    constraint posts_author_id_fkey foreign key (author_id) references public.profiles (id) on delete cascade,
    constraint posts_category_id_fkey foreign key (category_id) references public.categories (id) on update cascade on delete
    set
        null
);

create table if not exists public.comments (
    id uuid primary key default gen_random_uuid(),
    post_id uuid not null,
    author_id uuid not null default auth.uid(),
    content text not null,
    approved boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint comments_post_id_fkey foreign key (post_id) references public.posts (id) on delete cascade,
    constraint comments_author_id_fkey foreign key (author_id) references public.profiles (id) on delete cascade
);

create table if not exists public.settings (
    key text primary key,
    value jsonb not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 4) Functions
create
or replace function public.touch_updated_at() returns trigger language plpgsql
set
    search_path = '' as $$ begin new.updated_at := now();

return new;

end;

$$;

create
or replace function public.is_self(row_id uuid) returns boolean language sql stable
set
    search_path = '' as $$
select
    auth.uid() = row_id;

$$;

create
or replace function public.is_author(uid uuid) returns boolean language sql stable
set
    search_path = '' as $$
select
    exists (
        select
            1
        from
            public.profiles p
        where
            p.id = uid
            and p.role in ('admin', 'author')
    );

$$;

create
or replace function public.is_author() returns boolean language sql stable
set
    search_path = '' as $$
select
    exists (
        select
            1
        from
            public.profiles p
        where
            p.id = auth.uid()
            and p.role in ('admin', 'author')
    );

$$;

create
or replace function public.is_admin() returns boolean language sql stable
set
    search_path = '' as $$
select
    exists (
        select
            1
        from
            public.profiles p
        where
            p.id = auth.uid()
            and p.role = 'admin'
    );

$$;

create
or replace function public.can_manage_own_post(author uuid) returns boolean language sql stable
set
    search_path = '' as $$
select
    author = auth.uid()
    and public.is_author(author);

$$;

-- First user -> admin, others -> reader (no mutable search_path)
create
or replace function public.handle_new_user() returns trigger language plpgsql security definer
set
    search_path = '' as $$ declare is_first boolean;

begin perform pg_advisory_lock(42000001);

select
    not exists (
        select
            1
        from
            public.profiles
        where
            role = 'admin' :: public.user_role
    ) into is_first;

insert into
    public.profiles (id, username, display_name, role)
values
    (
        new.id,
        new.raw_user_meta_data ->> 'username',
        new.raw_user_meta_data ->> 'display_name',
        case
            when is_first then 'admin' :: public.user_role
            else 'reader' :: public.user_role
        end
    ) on conflict (id) do nothing;

perform pg_advisory_unlock(42000001);

return new;

exception
when others then perform pg_advisory_unlock(42000001);

raise;

end;

$$;

create
or replace function public.prevent_non_admin_role_change() returns trigger language plpgsql
set
    search_path = '' as $$ declare jwt_role text := coalesce(
        (
            current_setting('request.jwt.claims', true) :: jsonb ->> 'role'
        ),
        ''
    );

begin -- No change -> allow
if new.role is not distinct
from
    old.role then return new;

end if;

-- Allow Supabase service-key / API (PostgREST) calls
if jwt_role = 'service_role' then return new;

end if;

-- Allow direct Studio/SQL connections running as elevated DB roles
if current_user in ('postgres', 'supabase_admin') then return new;

end if;

-- Otherwise require an in-app admin
if not public.is_admin() then raise exception 'Only admins can change role';

end if;

return new;

end;

$$;

-- 5) Triggers (updated_at + role-change guard)
drop trigger if exists categories_set_updated_at on public.categories;

create trigger categories_set_updated_at before
update
    on public.categories for each row execute function public.touch_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;

create trigger profiles_set_updated_at before
update
    on public.profiles for each row execute function public.touch_updated_at();

drop trigger if exists posts_set_updated_at on public.posts;

create trigger posts_set_updated_at before
update
    on public.posts for each row execute function public.touch_updated_at();

drop trigger if exists comments_set_updated_at on public.comments;

create trigger comments_set_updated_at before
update
    on public.comments for each row execute function public.touch_updated_at();

drop trigger if exists settings_set_updated_at on public.settings;

create trigger settings_set_updated_at before
update
    on public.settings for each row execute function public.touch_updated_at();

drop trigger if exists profiles_admin_only_role_change on public.profiles;

create trigger profiles_admin_only_role_change before
update
    on public.profiles for each row execute function public.prevent_non_admin_role_change();

-- 6) Enable RLS
alter table
    public.categories enable row level security;

alter table
    public.profiles enable row level security;

alter table
    public.posts enable row level security;

alter table
    public.comments enable row level security;

alter table
    public.settings enable row level security;

-- 7) Policies
-- categories
drop policy if exists "categories_read_all" on public.categories;

drop policy if exists "categories_insert_author_admin" on public.categories;

drop policy if exists "categories_update_author_admin" on public.categories;

drop policy if exists "categories_delete_author_admin" on public.categories;

create policy "categories_read_all" on public.categories for
select
    to public using (true);

create policy "categories_insert_author_admin" on public.categories for
insert
    to authenticated with check (
        public.is_author()
        or public.is_admin()
    );

create policy "categories_update_author_admin" on public.categories for
update
    to authenticated using (
        public.is_author()
        or public.is_admin()
    ) with check (
        public.is_author()
        or public.is_admin()
    );

create policy "categories_delete_author_admin" on public.categories for delete to authenticated using (
    public.is_author()
    or public.is_admin()
);

-- posts
drop policy if exists "posts_read_published_or_authors" on public.posts;

drop policy if exists "posts_insert_authors" on public.posts;

drop policy if exists "posts_update_admin_or_owner_author" on public.posts;

drop policy if exists "posts_delete_admin_or_owner_author" on public.posts;

create policy "posts_read_published_or_authors" on public.posts for
select
    to public using (
        status IN ('published', 'archived')
        or public.is_author()
    );

create policy "posts_insert_authors" on public.posts for
insert
    to authenticated with check (public.is_author());

create policy "posts_update_admin_or_owner_author" on public.posts for
update
    to authenticated using (
        public.is_admin()
        or public.can_manage_own_post(author_id)
    ) with check (
        public.is_admin()
        or public.can_manage_own_post(author_id)
    );

create policy "posts_delete_admin_or_owner_author" on public.posts for delete to authenticated using (
    public.is_admin()
    or (
        author_id = auth.uid()
        and public.is_author()
    )
);

-- comments
drop policy if exists "comments_read_all" on public.comments;

drop policy if exists "comments_insert_authenticated" on public.comments;

drop policy if exists "comments_delete_self_or_author" on public.comments;

drop policy if exists "comments_insert_authenticated" on public.comments;

drop policy if exists "comments_approve_admin_or_author" on public.comments;

create policy "comments_read_all" on public.comments for
select
    to public using (true);

create policy "comments_insert_authenticated" on public.comments for
insert
    to authenticated with check (
        author_id = auth.uid()
        and exists (
            select
                1
            from
                public.posts p
            where
                p.id = post_id
                and p.status IN ('published', 'archived')
                and p.comments_disabled = false
        )
    );

create policy "comments_delete_self_or_author" on public.comments for delete to authenticated using (
    public.is_self(author_id)
    or public.is_author()
);

create policy "comments_insert_authenticated" on public.comments for
insert
    to authenticated with check (
        author_id = auth.uid()
        and exists (
            select
                1
            from
                public.posts p
            where
                p.id = public.comments.post_id
                and p.status IN ('published', 'archived')
                and p.comments_disabled = false
        )
    );

create policy "comments_approve_admin_or_author" on public.comments for
update
    to authenticated using (
        public.is_admin()
        or public.is_author()
    ) with check (
        public.is_admin()
        or public.is_author()
    );

-- profiles
drop policy if exists "profiles_read_all" on public.profiles;

drop policy if exists "profiles_update_self_or_admin" on public.profiles;

create policy "profiles_read_all" on public.profiles for
select
    to public using (true);

create policy "profiles_update_self_or_admin" on public.profiles for
update
    to authenticated using (
        public.is_self(id)
        or public.is_admin()
    ) with check (
        public.is_self(id)
        or public.is_admin()
    );

-- settings (deduplicated policies)
drop policy if exists "settings_read_all" on public.settings;

drop policy if exists "settings_insert_install_flag" on public.settings;

drop policy if exists "settings_insert_branding_initial" on public.settings;

drop policy if exists "settings_insert_admin" on public.settings;

drop policy if exists "settings_update_admin" on public.settings;

drop policy if exists "settings_delete_admin" on public.settings;

-- Public read access (site metadata, etc.)
create policy "settings_read_all" on public.settings for
select
    to public using (true);

-- One-time anonymous insert of installation flag (before any installation row exists)
create policy "settings_insert_install_flag" on public.settings for
insert
    to anon with check (
        key = 'installation'
        and not exists (
            select
                1
            from
                public.settings
            where
                key = 'installation'
        )
    );

-- One-time anonymous insert of branding (must be before installation completes)
create policy "settings_insert_branding_initial" on public.settings for
insert
    to anon with check (
        key = 'branding'
        and not exists (
            select
                1
            from
                public.settings
            where
                key = 'branding'
        )
        and not exists (
            select
                1
            from
                public.settings
            where
                key = 'installation'
        )
    );

-- Admin-controlled subsequent inserts/updates/deletes
create policy "settings_insert_admin" on public.settings for
insert
    to authenticated with check (public.is_admin());

create policy "settings_update_admin" on public.settings for
update
    to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "settings_delete_admin" on public.settings for delete to authenticated using (public.is_admin());

-- 8) Indexes
create index if not exists posts_author_id_idx on public.posts (author_id);

create index if not exists posts_status_idx on public.posts (status);

create index if not exists posts_category_id_idx on public.posts (category_id);

create index if not exists posts_tags_gin_idx on public.posts using gin (tags);

create index if not exists comments_post_id_idx on public.comments (post_id);

create index if not exists comments_author_id_idx on public.comments (author_id);

-- ========== B) STORAGE + AUTH TRIGGER (RUN AS OWNER) ==========
-- 1) Buckets (create in UI OR via SQL if owner; your original snippet did this):
insert into
    storage.buckets (id, name, public)
values
    ('post-thumbnails', 'post-thumbnails', true),
    ('profile-avatar', 'profile-avatar', true),
    ('branding', 'branding', true) on conflict (id) do nothing;

-- 2) Bucket-level policies (owner)
drop policy if exists "buckets_list_admin" on storage.buckets;

drop policy if exists "buckets_create_admin" on storage.buckets;

drop policy if exists "buckets_delete_admin" on storage.buckets;

create policy "buckets_list_admin" on storage.buckets for
select
    using (true);

-- (Use your preferred rule; earlier you had admin-only.)
create policy "buckets_create_admin" on storage.buckets for
insert
    to authenticated with check (public.is_admin());

create policy "buckets_delete_admin" on storage.buckets for delete to authenticated using (public.is_admin());

-- 3) Object policies (can be owner or normal; owner is fine)
drop policy if exists "objects_read_all" on storage.objects;

create policy "objects_read_all" on storage.objects for
select
    to public using (true);

drop policy if exists "objects_insert_admin" on storage.objects;

drop policy if exists "objects_delete_admin" on storage.objects;

create policy "objects_insert_admin" on storage.objects for
insert
    to authenticated with check (public.is_admin());

create policy "objects_delete_admin" on storage.objects for delete to authenticated using (public.is_admin());

-- post-thumbnails
drop policy if exists "thumbnails_insert_author" on storage.objects;

drop policy if exists "thumbnails_update_author_or_admin" on storage.objects;

drop policy if exists "thumbnails_delete_admin_only" on storage.objects;

create policy "thumbnails_insert_author" on storage.objects for
insert
    to authenticated with check (
        bucket_id = 'post-thumbnails'
        and (
            public.is_author()
            or public.is_admin()
        )
    );

create policy "thumbnails_update_author_or_admin" on storage.objects for
update
    to authenticated using (
        bucket_id = 'post-thumbnails'
        and (
            public.is_author()
            or public.is_admin()
        )
    ) with check(
        bucket_id = 'post-thumbnails'
        and (
            public.is_author()
            or public.is_admin()
        )
    );

create policy "thumbnails_delete_admin_only" on storage.objects for delete to authenticated using (
    bucket_id = 'post-thumbnails'
    and public.is_admin()
);

-- profile-avatar
drop policy if exists "avatars_insert_owner" on storage.objects;

drop policy if exists "avatars_update_owner" on storage.objects;

drop policy if exists "avatars_delete_owner_or_admin" on storage.objects;

create policy "avatars_insert_owner" on storage.objects for
insert
    to authenticated with check (
        bucket_id = 'profile-avatar'
        and (storage.foldername(name)) [1] = auth.uid() :: text
    );

create policy "avatars_update_owner" on storage.objects for
update
    to authenticated using (
        bucket_id = 'profile-avatar'
        and (storage.foldername(name)) [1] = auth.uid() :: text
    ) with check(
        bucket_id = 'profile-avatar'
        and (storage.foldername(name)) [1] = auth.uid() :: text
    );

create policy "avatars_delete_owner_or_admin" on storage.objects for delete to authenticated using (
    bucket_id = 'profile-avatar'
    and (
        (storage.foldername(name)) [1] = auth.uid() :: text
        or public.is_admin()
    )
);

-- branding
drop policy if exists "branding_insert_admin" on storage.objects;

drop policy if exists "branding_update_admin" on storage.objects;

drop policy if exists "branding_delete_admin" on storage.objects;

create policy "branding_insert_admin" on storage.objects for
insert
    to authenticated with check (
        bucket_id = 'branding'
        and public.is_admin()
    );

create policy "branding_update_admin" on storage.objects for
update
    to authenticated using (
        bucket_id = 'branding'
        and public.is_admin()
    ) with check (
        bucket_id = 'branding'
        and public.is_admin()
    );

create policy "branding_delete_admin" on storage.objects for delete to authenticated using (
    bucket_id = 'branding'
    and public.is_admin()
);

-- 4) Auth trigger (owner)
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after
insert
    on auth.users for each row execute function public.handle_new_user();