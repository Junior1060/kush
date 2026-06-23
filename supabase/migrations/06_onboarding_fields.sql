-- Onboarding additions: who the user is looking for, their country, and tribe.

alter table public.profiles
  add column if not exists looking_for text check (looking_for in ('Women', 'Men', 'Everyone')),
  add column if not exists country text not null default '',
  add column if not exists tribe text not null default '';
