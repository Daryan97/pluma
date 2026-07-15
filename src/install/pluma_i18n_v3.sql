-- Pluma multi-language content (v3)
-- Adds locale to posts, categories, series; uniqueness becomes (locale, slug).
-- Safe to run on existing DBs; existing rows default to 'en'.

-- Supported UI/content locales (reference; app also lists these)
-- en, ku, ar, es, fr, de

alter table public.posts
  add column if not exists locale text not null default 'en';

alter table public.categories
  add column if not exists locale text not null default 'en';

alter table public.series
  add column if not exists locale text not null default 'en';

-- Translation group: same logical post across locales
alter table public.posts
  add column if not exists translation_group_id uuid;

alter table public.categories
  add column if not exists translation_group_id uuid;

alter table public.series
  add column if not exists translation_group_id uuid;

-- Backfill translation groups for existing rows (one group per row)
update public.posts
set translation_group_id = id
where translation_group_id is null;

update public.categories
set translation_group_id = id
where translation_group_id is null;

update public.series
set translation_group_id = id
where translation_group_id is null;

-- Drop old global slug uniqueness and add per-locale uniqueness
do $$
begin
  if exists (
    select 1 from pg_constraint where conname = 'posts_slug_key'
  ) then
    alter table public.posts drop constraint posts_slug_key;
  end if;
exception when undefined_object then null;
end $$;

do $$
begin
  if exists (
    select 1 from pg_constraint where conname = 'categories_slug_key'
  ) then
    alter table public.categories drop constraint categories_slug_key;
  end if;
exception when undefined_object then null;
end $$;

do $$
begin
  if exists (
    select 1 from pg_constraint where conname = 'series_slug_key'
  ) then
    alter table public.series drop constraint series_slug_key;
  end if;
exception when undefined_object then null;
end $$;

create unique index if not exists posts_locale_slug_uidx
  on public.posts (locale, slug);

create unique index if not exists categories_locale_slug_uidx
  on public.categories (locale, slug);

create unique index if not exists series_locale_slug_uidx
  on public.series (locale, slug);

create index if not exists posts_locale_idx on public.posts (locale);
create index if not exists posts_translation_group_idx on public.posts (translation_group_id);
create index if not exists categories_locale_idx on public.categories (locale);
create index if not exists series_locale_idx on public.series (locale);

-- Allow the same display name across locales (e.g. "News" in en and de)
alter table public.categories drop constraint if exists categories_name_key;
alter table public.series drop constraint if exists series_name_key;

create unique index if not exists categories_locale_name_uidx
  on public.categories (locale, name);

create unique index if not exists series_locale_name_uidx
  on public.series (locale, name);

-- Preview RPC: include locale fields (requires locale columns above)
create or replace function public.get_post_by_preview_token(p_token uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  result jsonb;
begin
  if p_token is null then
    return null;
  end if;

  select
    jsonb_build_object(
      'id', p.id,
      'title', p.title,
      'content', p.content,
      'tags', to_jsonb(p.tags),
      'slug', p.slug,
      'locale', p.locale,
      'translation_group_id', p.translation_group_id,
      'comments_disabled', p.comments_disabled,
      'cover_image_url', p.cover_image_url,
      'created_at', p.created_at,
      'updated_at', p.updated_at,
      'status', p.status,
      'scheduled_at', p.scheduled_at,
      'series_id', p.series_id,
      'series_order', p.series_order,
      'category', case
        when c.id is null then null
        else jsonb_build_object(
          'id', c.id,
          'name', c.name,
          'slug', c.slug,
          'locale', c.locale
        )
      end,
      'author', case
        when pr.id is null then null
        else jsonb_build_object(
          'id', pr.id,
          'username', pr.username,
          'display_name', pr.display_name
        )
      end,
      'series', case
        when s.id is null then null
        else jsonb_build_object(
          'id', s.id,
          'name', s.name,
          'slug', s.slug,
          'locale', s.locale
        )
      end
    )
  into result
  from public.posts p
  left join public.categories c on c.id = p.category_id
  left join public.profiles pr on pr.id = p.author_id
  left join public.series s on s.id = p.series_id
  where p.preview_token = p_token
  limit 1;

  return result;
end;
$$;

grant execute on function public.get_post_by_preview_token(uuid) to anon, authenticated;

-- Branding: optional list of enabled content locales in settings jsonb
-- e.g. update settings set value = value || '{"enabledLocales":["en","fr"]}'::jsonb where key = 'branding';

comment on column public.posts.locale is 'BCP-47 language tag for this post version';
comment on column public.posts.translation_group_id is 'Shared id linking translated versions of the same post';
