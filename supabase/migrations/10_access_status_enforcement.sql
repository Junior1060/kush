-- Make `access_status` server-controlled so a user can't elevate themselves out of
-- the waitlist. RLS lets a user write their own profile row, so without this a
-- waitlisted user could PATCH access_status='active' directly against the API.
-- A BEFORE trigger overrides whatever value the client sends: the status is decided
-- here, never trusted from the request.

-- Mirrors isProfileComplete() in lib/profile.ts — the bar for "finished onboarding".
create or replace function public.profile_is_complete(p public.profiles)
returns boolean
language sql
immutable
as $$
  select coalesce(btrim(p.name), '') <> ''
     and coalesce(p.age, 0) > 0
     and p.gender is not null
     and p.looking_for is not null
     and coalesce(btrim(p.country), '') <> ''
     and coalesce(btrim(p.city), '') <> ''
     and coalesce(btrim(p.bio), '') <> ''
     and coalesce(array_length(p.photos, 1), 0) > 0;
$$;

create or replace function public.enforce_access_status()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    -- New rows never trust a client-supplied status. A complete profile is gated
    -- by gender; anything else (e.g. the empty signup stub) starts active.
    new.access_status := case
      when public.profile_is_complete(new) and new.gender = 'Man' then 'waitlist'
      else 'active'
    end;
    return new;
  end if;

  -- UPDATE: the status is set exactly once, on the incomplete -> complete transition
  -- (onboarding completion). Every other update keeps the stored value, so the client
  -- can never change access_status by sending it. Existing complete users editing their
  -- profile are unaffected (grandfathered: their stored status is preserved).
  if not public.profile_is_complete(old) and public.profile_is_complete(new) then
    new.access_status := case when new.gender = 'Man' then 'waitlist' else 'active' end;
  else
    new.access_status := old.access_status;
  end if;
  return new;
end;
$$;

drop trigger if exists on_profile_access_status on public.profiles;
create trigger on_profile_access_status
  before insert or update on public.profiles
  for each row execute function public.enforce_access_status();
