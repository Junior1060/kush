-- Notify a user when someone likes (or super-likes) their profile, before any
-- mutual match exists.
--
-- Realtime honors RLS: a row is only delivered to a client that can SELECT it.
-- swipes_select_own only exposes a user's *own* swipes, so a target would never
-- receive the incoming like. This policy lets a user read like/star swipes aimed
-- at them (their own incoming likes) so the app can surface a "X likes you"
-- notification. `pass` swipes stay private to the swiper.
drop policy if exists "swipes_select_incoming" on public.swipes;
create policy "swipes_select_incoming" on public.swipes
  for select to authenticated
  using (auth.uid() = target_id and direction in ('like', 'star'));

-- Broadcast swipes over Realtime so the target is notified the instant someone
-- likes them. RLS (above) ensures each client only receives like/star swipes
-- aimed at it.
do $$
begin
  alter publication supabase_realtime add table public.swipes;
exception
  when duplicate_object then null; -- already added; safe to re-run
end $$;
