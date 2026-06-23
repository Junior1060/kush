-- Triggers: auto-create a profile stub on signup, and create matches on mutual likes.

-- 1) Every new auth user gets a stub profile so the Profile screen has a row to show.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2) When a like/star is reciprocated, create a match (pair stored sorted).
create or replace function public.handle_swipe()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.direction in ('like', 'star') then
    -- Did the target already like/star the swiper back?
    if exists (
      select 1 from public.swipes s
      where s.swiper_id = new.target_id
        and s.target_id = new.swiper_id
        and s.direction in ('like', 'star')
    ) then
      insert into public.matches (user_a, user_b)
      values (
        least(new.swiper_id, new.target_id),
        greatest(new.swiper_id, new.target_id)
      )
      on conflict (user_a, user_b) do nothing;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists on_swipe_created on public.swipes;
create trigger on_swipe_created
  after insert on public.swipes
  for each row execute function public.handle_swipe();
