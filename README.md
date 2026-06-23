# Kush

Dating for South Sudanese singles — *Love that knows where it's from.* A pixel-faithful build of
the [design handoff](./design_handoff_kush/README.md) on **Next.js (App Router) + TypeScript +
Tailwind CSS**, backed by **Supabase** for auth, Postgres, photo storage, and realtime chat.

## Screens
Welcome (magic-link auth) · Discover (swipe deck + filters) · Matches · Messages · Chat (realtime)
· Profile. The 4 tabbed screens + chat are protected and redirect to Welcome when signed out.

## Stack
- Next.js 15 App Router, React 19, TypeScript
- Tailwind CSS v3 — design tokens mapped in [`tailwind.config.ts`](./tailwind.config.ts)
- Supabase via `@supabase/ssr` (cookie auth across server components, route handlers, middleware)
- Fonts: Bricolage Grotesque (display) + Hanken Grotesk (body) via `next/font`

## Getting started

### 1. Create a Supabase project
At [supabase.com](https://supabase.com) → **New project**. Grab the **Project URL** and **anon
public** key from *Settings → API*.

### 2. Apply the database setup
Run the SQL in [`supabase/migrations/`](./supabase/migrations) **in order**, then the seed:

**Option A — Supabase SQL Editor (no CLI):** paste and run each file top to bottom:
`01_schema.sql` → `02_functions.sql` → `03_rls.sql` → `04_storage.sql` → `05_realtime.sql`, then
`supabase/seed.sql`.

**Option B — Supabase CLI:**
```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push          # applies migrations/
psql "$DATABASE_URL" -f supabase/seed.sql   # or paste seed.sql in the SQL editor
```

### 3. Configure env
```bash
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 4. Set the auth redirect URL
In Supabase *Authentication → URL Configuration*, add `http://localhost:3000/**` to **Redirect
URLs** (and your Vercel URL for production). Magic links redirect to `/auth/callback`.

### 5. Run
```bash
npm install
npm run dev          # http://localhost:3000
```
Sign in with your email; click the magic link (locally, find it in Supabase *Authentication → Logs*
or the Inbucket mailbox if using `supabase start`). The seeded profiles populate the Discover deck.

## How the data flows
- **Swipe** → `recordSwipe` server action writes a `swipes` row. A mutual like/star fires the
  `handle_swipe` trigger, which creates a `matches` row.
- **Matches / Messages** read from `matches` joined to the other person's profile.
- **Chat** loads `messages` for the match and subscribes to Supabase Realtime (`postgres_changes`
  INSERT) so new messages appear live; sending uses the `sendMessage` server action.
- **Photos** live in the public `photos` storage bucket under `{user_id}/…`; profiles store paths
  in `photos[]`. Empty → the design's gradient placeholder is shown.

## Project layout
```
app/
  page.tsx                  Welcome (public, magic-link)
  auth/callback/route.ts    OAuth/magic-link code exchange
  (app)/                    Protected shell (device frame + bottom nav)
    layout.tsx  actions.ts
    discover/  matches/  messages/  chat/[matchId]/  profile/
components/                 PhoneFrame, BottomNav, discover/, chat/, …
lib/
  supabase/{client,server,middleware}.ts
  queries.ts  types.ts  photos.ts  time.ts
middleware.ts              session refresh + route protection
supabase/migrations/       schema, triggers, RLS, storage, realtime
supabase/seed.sql          6 demo profiles
```

## Scoped out (clearly marked for later)
- **Edit-profile & photo upload** — not among the 7 handoff screens. The storage bucket, RLS, and
  `firstPhotoUrl` helper are in place; add an upload form when ready.
- **Distance filter** is UI-only (no geo data in the schema). Gender / age / location-focus filters
  constrain the deck. Add lat/long columns to enable real distance.
- **Online presence** — the Messages "online dot" needs Supabase Presence; omitted until wired.

## Deploy
Push to GitHub, import into Vercel, set the two `NEXT_PUBLIC_SUPABASE_*` env vars, and add the
Vercel URL to Supabase redirect URLs. Zero extra config.
