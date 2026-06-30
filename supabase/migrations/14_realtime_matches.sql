-- Broadcast new matches over Realtime so a user is notified the moment someone
-- likes them back — even when they're not on the Discover deck. RLS
-- (matches_select_member) ensures each client only receives matches it belongs to.
do $$
begin
  alter publication supabase_realtime add table public.matches;
exception
  when duplicate_object then null; -- already added; safe to re-run
end $$;
