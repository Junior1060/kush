# Handoff: Kush — South Sudanese Dating App

## Overview
Kush is a mobile dating app for South Sudanese singles "from Juba to the diaspora." This package
contains a **high-fidelity, tappable HTML prototype** of the full core flow: onboarding, a swipe
discovery deck, a discovery-filters sheet, matches, messages, an open chat, and the user's own
profile. It is the visual + interaction reference for building the real app.

## About the Design Files
`Kush.dc.html` is a **design reference created in HTML** — a prototype showing the intended look,
layout, and behavior. It is **not production code to ship**. (It uses a small internal "Design
Component" runtime — `class Component extends DCLogic` + `{{ }}` template holes — that exists only
in the prototyping tool, so do not try to deploy it.)

Your task is to **recreate this design in a real codebase**. Recommended stack for your goal
(GitHub → Vercel → Supabase):

- **Next.js (App Router) + TypeScript + Tailwind CSS** — deploys to Vercel with zero config.
- **Supabase** for auth, Postgres, storage (photos), and realtime (chat).
- Recreate the screens **pixel-faithfully** using the tokens below as Tailwind theme values.

## Fidelity
**High-fidelity.** Colors, typography, spacing, radii, and interactions in the prototype are final
intent. Match them closely. Photo areas are intentional placeholders — replace with real
Supabase-stored user images.

## Screens / Views

### 1. Welcome / Onboarding
- **Purpose:** Brand intro + entry to sign up / sign in.
- **Layout:** Full-height column, 26px side padding. Centered "Kush" wordmark (gold star + word) at
  top. A large rounded (30px) hero photo placeholder fills the middle with a warm
  `linear-gradient(150deg,#C97A3A,#7E2B22)`, a flag-stripe motif (black/red/green 26×5px bars), and
  the headline **"Love that knows where it's from."** in Bricolage Grotesque 34px/700. Below: muted
  subhead, a filled **Create account** button (ink, 56px, radius 18), and a text **I already have an
  account** button.
- **Action:** Both buttons → Discover. In production, route to real auth (Supabase `signInWithOtp`
  or OAuth), then to Discover.

### 2. Discover (swipe deck)
- **Purpose:** Browse candidate profiles, like / pass / super-like.
- **Layout:** Top bar = wordmark + filter button (opens Filters sheet). Center = a stacked card deck
  (up to 3 cards, back cards scaled 0.95/0.90 and offset 14px down). Bottom = 3 action buttons.
- **Card:** Full-bleed photo (per-profile warm gradient placeholder), bottom dark scrim, name
  (Bricolage 28/700) + age (24/500) + gold verified star, location row with pin + route text, 2-line
  bio (clamped), and pill tags (rgba(255,255,255,0.16), 1px translucent border).
- **Like/Nope badges:** "LIKE" (green #2E7D54 border, rotate −16°, top-left) and "NOPE"
  (red #CE3B33 border, rotate +16°, top-right), opacity driven by drag distance.
- **Action buttons:** Pass = white circle 58px, red ✕. Star = gold #D8A33B circle 50px, white star.
  Like = red #CE3B33 circle 58px, white heart.

### 3. Filters (bottom sheet)
- **Purpose:** Tune discovery. Slides up over a 40%-black scrim; "Done" / scrim tap closes.
- **Controls:** **Show me** segmented (Women / Men / Everyone); **Age range** two steppers
  (18–70, min < max) with a live `min–max` label; **Maximum distance** range input (5–500, step 5,
  accent gold) with `N km` / `500+ km` label; **Location focus** segmented (Home / Diaspora / Both).
- Segmented active state: ink #1B1714 fill, cream text, soft shadow.

### 4. Matches
- **Purpose:** People who matched back.
- **Layout:** Title + subhead. Horizontal **New matches** rail = 66px circular avatars (initial on
  gradient, gold ring) with name. **All matches** = 2-col grid of 3:4 cards (gradient + big faded
  initial, dark scrim, name/age + city). Tapping any match → Chat.

### 5. Messages
- **Purpose:** Conversation list.
- **Row:** 56px avatar (initial on gradient) with green online dot, name (700/16), timestamp,
  last-message preview (bold ink if unread / muted if read), red unread count badge. Tap → Chat.

### 6. Chat
- **Purpose:** 1:1 conversation.
- **Layout:** Header = back chevron + 40px avatar + name + "Active now" (green). Scrollable bubble
  thread: mine = ink fill, cream text, radius `20 20 5 20`, right-aligned; theirs = white, ink text,
  radius `20 20 20 5`, left-aligned, hairline border. Footer = pill input ("Message {name}…") + ink
  round send button. *(Input is display-only in the prototype — wire to Supabase realtime.)*

### 7. Profile (own)
- **Purpose:** View/manage own profile.
- **Layout:** Title + settings gear. Square hero photo placeholder (blue gradient) with name "Nyibol
  25" + "Juba → Kampala". **Profile strength** card (80% bar, gold→red gradient). Settings list (Edit
  profile, Preferences, Verify, Privacy). Red outline **Log out** → Welcome.

## Interactions & Behavior
- **Swipe:** Pointer drag on top card translates + rotates (`dragX/24` deg); release past ±110px
  flies the card off (translate ±600px, rotate ±22°, 0.36s ease-in) and advances the deck; under
  threshold springs back (0.25s ease). Buttons trigger the same fly-out (star flies up).
- **Nav:** Persistent bottom tab bar (Discover / Matches / Messages / Profile) on those 4 screens;
  hidden on Welcome, Chat, and while the Filters sheet is open. Active tab = gold #C9962E.
- **Empty deck:** When all profiles seen → centered "That's everyone for now" state.
- **Transitions:** 0.15–0.25s ease on segmented controls and cards.

## State Management
- `screen`: welcome | discover | matches | messages | chat | profile
- `index` (deck position), `dragX`, `dragging`, `flyOut` (like|pass|star|null)
- `filtersOpen`, `chat` (active conversation)
- Filters: `showMe`, `ageMin`, `ageMax`, `distance`, `locationFocus`
- **Production data:** profiles, matches, conversations, messages all come from Supabase (see schema
  suggestion below); like/pass writes a `swipes` row; a mutual like creates a `matches` row
  (Postgres trigger or edge function); chat uses Supabase Realtime on a `messages` table.

## Design Tokens
**Colors**
- Background cream `#F7F2EA` · surface white `#FFFFFF`
- Ink `#1B1714` · muted ink `#8A8178` · faint `#A89F94`
- Flag red (like / alerts) `#CE3B33`
- Flag green (accent / online) `#2E7D54`
- Gold star (signature / active) `#D8A33B`, active-tab gold `#C9962E`
- Flag blue (profile hero) `#1E3A6B`
- Hairline `rgba(27,23,20,0.07–0.12)`

**Typography**
- Display: **Bricolage Grotesque** (500/600/700/800), tight letter-spacing (−0.4 to −0.8px)
- Body/UI: **Hanken Grotesk** (400/500/600/700)

**Radii:** cards 26px · sheets 30px · buttons 16–18px · pills/avatars full · inputs 14–23px
**Shadows:** cards `0 20px 44px -16px rgba(27,23,20,0.5)` · buttons `0 8–10px 18–22px -8px <tint>`
**Spacing:** 4 / 8 / 12 / 14 / 18 / 22 / 26px rhythm.
**Frame:** designed at 390×844 (iPhone), 11px bezel, 42px screen radius.

## Suggested Supabase schema (starting point)
- `profiles` (id → auth.users, name, age, city, route, bio, tags text[], photos text[], gender, location_focus)
- `swipes` (swiper_id, target_id, direction, created_at)
- `matches` (user_a, user_b, created_at) — created when swipes are mutual
- `messages` (id, match_id, sender_id, body, created_at) — Realtime channel per match
- Storage bucket `photos` for user images. Enable Row Level Security on every table.

## Assets
No external image assets — all photo areas are CSS-gradient placeholders. Icons are inline SVG
(simple shapes/strokes) and can be replaced with a real icon set (e.g. lucide-react). Fonts are
Google Fonts (Bricolage Grotesque, Hanken Grotesk).

## Files
- `Kush.dc.html` — the complete prototype (all 7 screens + filters). Open it in a browser to click
  through every flow and read the exact markup/values.
