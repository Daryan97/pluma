/* ===========================================
  Pluma features v2 (run on EXISTING DBs)
  - Scheduled publish (posts.scheduled_at)
  - Draft preview tokens
  - Post series
 =========================================== */

-- Series first (posts FKs depend on it)
create table if not exists public.series (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint series_name_key unique (name),
  constraint series_slug_key unique (slug)
);

alter table public.series enable row level security;

drop policy if exists "series_read_all" on public.series;
drop policy if exists "series_write_author_admin" on public.series;
drop policy if exists "series_update_author_admin" on public.series;
drop policy if exists "series_delete_admin" on public.series;

create policy "series_read_all" on public.series for
select to public using (true);

create policy "series_write_author_admin" on public.series for
insert to authenticated with check (public.is_author() or public.is_admin());

create policy "series_update_author_admin" on public.series for
update to authenticated using (public.is_author() or public.is_admin())
with check (public.is_author() or public.is_admin());

create policy "series_delete_admin" on public.series for
delete to authenticated using (public.is_admin());

drop trigger if exists series_set_updated_at on public.series;
create trigger series_set_updated_at before
update on public.series for each row execute function public.touch_updated_at();

-- Posts: schedule, preview, series
alter table public.posts
  add column if not exists scheduled_at timestamptz;

alter table public.posts
  add column if not exists preview_token uuid;

alter table public.posts
  add column if not exists series_id uuid references public.series (id) on delete set null;

alter table public.posts
  add column if not exists series_order integer;

create index if not exists posts_scheduled_at_idx on public.posts (scheduled_at)
  where scheduled_at is not null;

create unique index if not exists posts_preview_token_uidx on public.posts (preview_token)
  where preview_token is not null;

create index if not exists posts_series_id_idx on public.posts (series_id);

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
        else jsonb_build_object('id', c.id, 'name', c.name, 'slug', c.slug)
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
        else jsonb_build_object('id', s.id, 'name', s.name, 'slug', s.slug)
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

create or replace function public.publish_due_posts()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_count integer;
begin
  update public.posts
  set
    status = 'published'::public.post_status,
    scheduled_at = null,
    updated_at = now()
  where
    status = 'draft'::public.post_status
    and scheduled_at is not null
    and scheduled_at <= now();

  get diagnostics updated_count = row_count;
  return updated_count;
end;
$$;

grant execute on function public.publish_due_posts() to anon, authenticated;
