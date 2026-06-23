-- Kush schema: profiles, swipes, matches, messages.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  name            text not null default '',
  age             integer,
  city            text not null default '',
  route           text not null default '',
  bio             text not null default '',
  tags            text[] not null default '{}',
  photos          text[] not null default '{}',   -- storage paths in the `photos` bucket
  gender          text check (gender in ('Woman', 'Man', 'Nonbinary')),
  location_focus  text check (location_focus in ('Home', 'Diaspora', 'Both')),
  tint            text not null default 'linear-gradient(150deg,#E0A24F,#A85A22)',
  created_at      timestamptz not null default now()
);

create table if not exists public.swipes (
  id          uuid primary key default gen_random_uuid(),
  swiper_id   uuid not null references auth.users (id) on delete cascade,
  target_id   uuid not null references auth.users (id) on delete cascade,
  direction   text not null check (direction in ('like', 'pass', 'star')),
  created_at  timestamptz not null default now(),
  unique (swiper_id, target_id)
);
create index if not exists swipes_swiper_idx on public.swipes (swiper_id);
create index if not exists swipes_target_idx on public.swipes (target_id);

-- The pair is stored sorted (user_a < user_b) so a unique constraint dedupes matches.
create table if not exists public.matches (
  id          uuid primary key default gen_random_uuid(),
  user_a      uuid not null references auth.users (id) on delete cascade,
  user_b      uuid not null references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now(),
  check (user_a < user_b),
  unique (user_a, user_b)
);
create index if not exists matches_user_a_idx on public.matches (user_a);
create index if not exists matches_user_b_idx on public.matches (user_b);

create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  match_id    uuid not null references public.matches (id) on delete cascade,
  sender_id   uuid not null references auth.users (id) on delete cascade,
  body        text not null check (length(trim(body)) > 0),
  created_at  timestamptz not null default now()
);
create index if not exists messages_match_idx on public.messages (match_id, created_at);
