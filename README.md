# Kush

**Love that knows where it's from.** Kush is a dating app for South Sudanese singles — from Juba to
the diaspora. It pairs a warm, culturally-rooted mobile experience with a real-time backend so
people can discover each other, match, and talk.

## What the app does

**Accounts & onboarding.** People sign up with an email and password and confirm their address by
email. Before they can browse anyone, they go through onboarding: they upload at least one photo and
fill in their name, age, gender, current city, where they're from, a short bio, and interests. The
app won't let an incomplete profile into the main experience — every protected screen checks profile
completeness and routes unfinished accounts back to onboarding.

**Discover (swipe deck).** The home screen is a stack of profile cards. Each card shows the person's
photo, name, age, a verified gold star, where they live and where they're from, a two-line bio, and
interest tags. Cards are draggable — drag right to like, left to pass — with live "LIKE" / "NOPE"
badges that fade in as you drag, and a fling-off animation when you commit. There are also Pass,
Super-like, and Like buttons. Every swipe is recorded.

**Filters & preferences.** A filters sheet (and a dedicated Preferences screen) let people tune who
they see: gender ("Show me"), age range, maximum distance, and whether they're focused on people at
home, in the diaspora, or both. Preferences persist and drive the Discover deck.

**Matches.** When two people like each other, it's a match. The Matches screen shows new matches in a
horizontal rail and all matches in a grid. Tapping a match opens the conversation.

**Messages & real-time chat.** The Messages screen lists every conversation with the last message,
timestamp, and unread count. Opening one is a full chat thread — your messages and theirs in styled
bubbles — that updates **live**: new messages appear instantly without a refresh.

**Profile & settings.** Each person has their own profile screen with their photo, a profile-strength
meter, and a settings list: edit profile & photos, preferences, account verification, and privacy &
safety (with working toggles). Plus log out.

**Verification & safety.** A verification flow lets people request the gold check, and privacy
controls let them manage visibility, online status, distance, and read receipts.

## How it's built

- **Frontend:** Next.js (App Router) + React + TypeScript, styled with Tailwind CSS using the Kush
  design tokens (cream/ink palette, South Sudan flag accents, Bricolage Grotesque + Hanken Grotesk).
  The UI is mobile-first — full screen on a phone, centered column on desktop.
- **Backend:** Supabase provides authentication, a Postgres database, photo storage, and real-time
  messaging.
- **Auth & access control:** cookie-based sessions via `@supabase/ssr`. Middleware refreshes the
  session and protects every route except the welcome and auth-callback pages.

## Data model

Four core tables in Postgres, all protected by Row Level Security:

- **`profiles`** — a row per user (name, age, city, route, bio, tags, photos, gender, location focus).
  A trigger creates a stub profile automatically when someone signs up.
- **`swipes`** — every like / pass / super-like a user makes.
- **`matches`** — created automatically by a database trigger when two users like each other.
- **`messages`** — the chat messages within a match, broadcast over Supabase Realtime.

Photos live in a public Supabase Storage bucket, with each user able to write only to their own
folder.

## Screens

Welcome / sign-up · Onboarding · Discover · Filters · Matches · Messages · Chat · Profile ·
Preferences · Verify · Privacy.

## Status

Built and deployable to Vercel against a hosted Supabase project. Discovery filtering by gender, age,
and location is live; distance is currently a UI control (no geolocation yet). Email delivery uses
Supabase's built-in sender, which is rate-limited — a custom SMTP provider is the next step before a
public launch.
