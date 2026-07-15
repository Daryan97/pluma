-- Public login helper: resolve display profile for an email without exposing auth details.
-- Safe for anon (returns no rows when unknown). Does not reveal password state.

create or replace function public.lookup_login_profile(p_email text)
returns table (
  display_name text,
  username text,
  avatar_url text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid;
  normalized text;
begin
  normalized := lower(trim(coalesce(p_email, '')));
  if normalized = '' or position('@' in normalized) = 0 then
    return;
  end if;

  select u.id into uid
  from auth.users u
  where lower(u.email) = normalized
  limit 1;

  if uid is null then
    return;
  end if;

  return query
  select
    coalesce(
      nullif(trim(pr.display_name), ''),
      nullif(trim(pr.username), ''),
      split_part(normalized, '@', 1)
    )::text as display_name,
    pr.username::text,
    pr.avatar_url::text
  from public.profiles pr
  where pr.id = uid;
end;
$$;

revoke all on function public.lookup_login_profile(text) from public;
grant execute on function public.lookup_login_profile(text) to anon, authenticated;
