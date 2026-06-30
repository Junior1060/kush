-- Open access: turn OFF the men-on-waitlist gate so everyone who finishes
-- onboarding can use the whole app. This reverses the behavior added in
-- 09_access_status.sql and 10_access_status_enforcement.sql without dropping the
-- column, so the feature can be re-enabled later.

-- 1. Let everyone currently on the waitlist into the app.
update public.profiles set access_status = 'active' where access_status <> 'active';

-- 2. Stop the trigger from ever putting new users on the waitlist.
create or replace function public.enforce_access_status()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  -- Access is open: every row is active regardless of gender or what the client sends.
  new.access_status := 'active';
  return new;
end;
$$;

-- 3. Recreate the discover query WITHOUT the access_status filters, so nobody is
--    hidden from the deck for waitlist reasons.
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
