-- Gradual access: women enter immediately, men land on a waitlist after onboarding.
-- `access_status` gates the four app surfaces (discovery, matches, likes, messaging).
-- Default 'active' grandfathers every existing row + each fresh signup stub (stubs have
-- no gender yet and are blocked by the profile-complete check anyway). The status only
-- diverges to 'waitlist' when a man completes his first onboarding (set in updateProfile).
alter table public.profiles
  add column if not exists access_status text not null default 'active'
    check (access_status in ('active', 'waitlist'));

-- Recreate the discover query to also require both sides be 'active', so waitlisted
-- men are hidden from everyone's deck (and never matched with someone who can't respond).
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
    and me.access_status = 'active'
    and p.access_status = 'active'
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
