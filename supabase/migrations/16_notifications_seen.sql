-- Track when a user last opened their Notifications screen, so the app can show
-- an unseen-count badge (incoming likes + new matches created after this stamp).
-- The list itself is derived live from `swipes` (incoming like/star, see
-- migration 15) and `matches`; no separate notifications table is needed.
alter table public.profiles
  add column if not exists notifications_seen_at timestamptz not null default now();
