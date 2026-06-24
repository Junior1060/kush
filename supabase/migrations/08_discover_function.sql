-- Scalable discover query: filters candidates entirely in the database via an
-- anti-join on swipes (no growing NOT IN list), enforcing bidirectional gender
-- matching. Runs as the calling user (security invoker), so RLS still applies.
create or replace function public.discover_candidates()
returns setof public.profiles
language sql
stable
security invoker
as $$
  select p.*
  from public.profiles p
  join public.profiles me on me.id = auth.uid()
  where p.id <> auth.uid()
    and not exists (
      select 1 from public.swipes s
      where s.swiper_id = auth.uid() and s.target_id = p.id
    )
    -- I only see the gender I'm looking for
    and (
      me.looking_for = 'Everyone'
      or (me.looking_for = 'Women' and p.gender = 'Woman')
      or (me.looking_for = 'Men' and p.gender = 'Man')
    )
    -- they must be looking for my gender
    and (
      p.looking_for = 'Everyone'
      or (me.gender = 'Woman' and p.looking_for = 'Women')
      or (me.gender = 'Man' and p.looking_for = 'Men')
    )
  order by p.last_active_at desc
  limit 200;
$$;
