-- Row Level Security for all tables.

alter table public.profiles enable row level security;
alter table public.swipes   enable row level security;
alter table public.matches  enable row level security;
alter table public.messages enable row level security;

-- profiles: anyone signed in can browse; you can only write your own row.
drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all" on public.profiles
  for select to authenticated using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- swipes: you insert and read only your own swipes.
drop policy if exists "swipes_insert_own" on public.swipes;
create policy "swipes_insert_own" on public.swipes
  for insert to authenticated with check (auth.uid() = swiper_id);

drop policy if exists "swipes_select_own" on public.swipes;
create policy "swipes_select_own" on public.swipes
  for select to authenticated using (auth.uid() = swiper_id);

-- matches: you can read matches you belong to. (Inserts happen via the trigger,
-- which runs as security definer and bypasses RLS.)
drop policy if exists "matches_select_member" on public.matches;
create policy "matches_select_member" on public.matches
  for select to authenticated
  using (auth.uid() = user_a or auth.uid() = user_b);

-- messages: read/insert only within a match you belong to, as yourself.
drop policy if exists "messages_select_member" on public.messages;
create policy "messages_select_member" on public.messages
  for select to authenticated
  using (
    exists (
      select 1 from public.matches m
      where m.id = messages.match_id
        and (m.user_a = auth.uid() or m.user_b = auth.uid())
    )
  );

drop policy if exists "messages_insert_member" on public.messages;
create policy "messages_insert_member" on public.messages
  for insert to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.matches m
      where m.id = messages.match_id
        and (m.user_a = auth.uid() or m.user_b = auth.uid())
    )
  );
