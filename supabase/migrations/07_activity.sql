-- Track recent activity so the discover deck can surface active users.
alter table public.profiles
  add column if not exists last_active_at timestamptz not null default now();

create index if not exists profiles_last_active_idx
  on public.profiles (last_active_at desc);
