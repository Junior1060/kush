-- Let people edit and delete their own messages.

-- Track when a message was last edited (null = never edited). The UI shows an
-- "edited" marker when this is set.
alter table public.messages
  add column if not exists edited_at timestamptz;

-- RLS: you may UPDATE only your own messages, and the row must stay yours.
drop policy if exists "messages_update_own" on public.messages;
create policy "messages_update_own" on public.messages
  for update to authenticated
  using (sender_id = auth.uid())
  with check (sender_id = auth.uid());

-- RLS: you may DELETE only your own messages.
drop policy if exists "messages_delete_own" on public.messages;
create policy "messages_delete_own" on public.messages
  for delete to authenticated
  using (sender_id = auth.uid());

-- Realtime sends only the primary key for UPDATE/DELETE by default, which means
-- the `match_id=eq.<id>` filter on the client channel can't match those events and
-- the other party would never see edits/deletions live. REPLICA IDENTITY FULL makes
-- Postgres include the whole old row, so the filter works for every event type.
alter table public.messages replica identity full;
