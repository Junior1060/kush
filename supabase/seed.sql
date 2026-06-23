-- Demo profiles so the Discover deck has content out of the box.
-- These create matching auth.users rows (they are display-only; not meant to sign in).
-- Run AFTER the migrations. Safe to re-run (upserts).

-- 1) Demo auth users.
insert into auth.users
  (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
   created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin,
   confirmation_token, recovery_token, email_change_token_new, email_change)
values
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'achol@demo.kush',    crypt('demo-password', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Achol"}',    false, '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'garang@demo.kush',   crypt('demo-password', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Garang"}',   false, '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'nyandeng@demo.kush', crypt('demo-password', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Nyandeng"}', false, '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated', 'deng@demo.kush',     crypt('demo-password', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Deng"}',     false, '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '55555555-5555-5555-5555-555555555555', 'authenticated', 'authenticated', 'aluel@demo.kush',    crypt('demo-password', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Aluel"}',    false, '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '66666666-6666-6666-6666-666666666666', 'authenticated', 'authenticated', 'mabior@demo.kush',   crypt('demo-password', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"name":"Mabior"}',   false, '', '', '', '')
on conflict (id) do nothing;

-- 2) Profiles (upsert over the stub the signup trigger may have created).
insert into public.profiles
  (id, name, age, city, country, route, bio, tags, gender, looking_for, tribe, location_focus, tint)
values
  ('11111111-1111-1111-1111-111111111111', 'Achol', 25, 'Melbourne', 'Australia', 'Lives in Melbourne, Australia · from Juba',
   'Engineering student. I make the best aseeda in Victoria. Looking for someone who still calls their mum on Sundays.',
   array['Dinka','Coffee','Afrobeats'], 'Woman', 'Men', 'Dinka', 'Diaspora', 'linear-gradient(150deg,#E0A24F,#A85A22)'),
  ('22222222-2222-2222-2222-222222222222', 'Garang', 29, 'Omaha', 'United States', 'Lives in Omaha, United States · from Bor',
   'Nurse by day. I will teach you to dance to Dynamq and lose every argument about jollof.',
   array['Family-first','Basketball','Gospel'], 'Man', 'Women', 'Dinka', 'Diaspora', 'linear-gradient(150deg,#3E8C63,#1C5436)'),
  ('33333333-3333-3333-3333-333333333333', 'Nyandeng', 27, 'Nairobi', 'Kenya', 'Lives in Nairobi, Kenya · from Juba',
   'Founder building for the continent. Diaspora kid with a Juba heart. Tea, not coffee.',
   array['Entrepreneur','Travel','Faith'], 'Woman', 'Men', 'Nuer', 'Diaspora', 'linear-gradient(150deg,#C96A4A,#7E2B22)'),
  ('44444444-4444-4444-4444-444444444444', 'Deng', 31, 'Calgary', 'Canada', 'Lives in Calgary, Canada · from Wau',
   'Civil engineer, quiet type. Sunday calls home to Wau are sacred. I cook a serious kisra.',
   array['Calm','Cooking','Football'], 'Man', 'Women', 'Dinka', 'Diaspora', 'linear-gradient(150deg,#4A6E96,#1E3A6B)'),
  ('55555555-5555-5555-5555-555555555555', 'Aluel', 24, 'Juba', 'South Sudan', 'Lives in Juba, South Sudan',
   'Teacher and stubborn reader. I want letters, not just texts. Romance me with a real plan.',
   array['Reader','Tea','Romantic'], 'Woman', 'Men', 'Dinka', 'Home', 'linear-gradient(150deg,#9C5A8C,#5A2A52)'),
  ('66666666-6666-6666-6666-666666666666', 'Mabior', 28, 'London', 'United Kingdom', 'Lives in London, United Kingdom · from Malakal',
   'DJ bringing the Juba sound to the ends. Night owl, loyal to a fault, terrible at texting back fast.',
   array['Music','Night owl','Loyal'], 'Man', 'Women', 'Shilluk', 'Diaspora', 'linear-gradient(150deg,#3F8A86,#16524F)')
on conflict (id) do update set
  name = excluded.name, age = excluded.age, city = excluded.city, country = excluded.country,
  route = excluded.route, bio = excluded.bio, tags = excluded.tags, gender = excluded.gender,
  looking_for = excluded.looking_for, tribe = excluded.tribe,
  location_focus = excluded.location_focus, tint = excluded.tint;
