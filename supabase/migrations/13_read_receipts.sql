-- Delivery + read receipts for messages.
--   delivered_at — the recipient's app has received the message (opened their inbox/chat).
--   read_at      — the recipient has opened the conversation and seen it.
-- Both are about the RECIPIENT acting on someone else's message, which the
-- "update your own messages" RLS policy forbids. So marking is done through
-- SECURITY DEFINER functions that bypass RLS but verify the caller is a member of
-- the match and only ever touch messages addressed TO them. This keeps body/edits
-- locked to the original sender while still allowing receipts.

alter table public.messages
  add column if not exists delivered_at timestamptz,
  add column if not exists read_at timestamptz;

-- Mark every message the caller has received (across all their matches) as
-- delivered. Called when the recipient's app loads their inbox.
create or replace function public.mark_delivered()
returns void
language sql
security definer
set search_path = public
as $$
  update public.messages msg
  set delivered_at = now()
  where msg.sender_id <> auth.uid()
    and msg.delivered_at is null
    and exists (
      select 1 from public.matches m
      where m.id = msg.match_id
        and (m.user_a = auth.uid() or m.user_b = auth.uid())
    );
$$;

-- Mark messages in one match as read (and delivered, since reading implies receipt).
-- Called when the recipient opens that conversation.
create or replace function public.mark_read(p_match_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.messages msg
  set read_at = now(),
      delivered_at = coalesce(msg.delivered_at, now())
  where msg.match_id = p_match_id
    and msg.sender_id <> auth.uid()
    and msg.read_at is null
    and exists (
      select 1 from public.matches m
      where m.id = p_match_id
        and (m.user_a = auth.uid() or m.user_b = auth.uid())
    );
$$;

grant execute on function public.mark_delivered() to authenticated;
grant execute on function public.mark_read(uuid) to authenticated;
