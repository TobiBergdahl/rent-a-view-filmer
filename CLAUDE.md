# CLAUDE.md

Rent A View **filmer app**: a clickable Expo prototype. Companion to the traveller
web prototype in `~/Development/rent-a-view` (React + Vite). See `README.md` for
the flows, demo path and production gaps.

Also read `AGENTS.md`: Expo changes every SDK, so check the versioned docs
(SDK 57) before using an Expo or React Native API.

## Commands

```bash
npx expo start          # dev server; press i for the iOS Simulator
npx tsc --noEmit        # typecheck
npx expo lint           # lint
npx expo install <pkg>  # add packages (never plain npm install <pkg>)
```

Run typecheck and lint before calling a change done. Must keep working in
**Expo Go**: don't add libraries with native code that Expo Go doesn't ship, and
don't rely on Info.plist changes (e.g. per-screen `statusBarStyle` crashes in
Expo Go; use `ScreenStatusBar` from `src/components/ui.tsx`).

## Prototype rules

- **No backend.** Data is in `src/data/seed.ts`; state is in memory in
  `src/state/store.tsx`. Screens only talk to `useStore()`, so a real API means
  changing the store's actions, not the screens.
- **Fakes live in `src/services/`** (auth, location, upload). Keep real
  integrations behind the same function signatures.
- **Prototype clock.** Use `now()` / `useNow()` from `src/lib/time.ts`, never
  `Date.now()` for anything shown to the user. All times are Europe/Zagreb;
  filmers work 08:00–20:00.
- **Money is euro cents** (`payout: 2900`), formatted with `euro()`: "€29" for whole euros, "€29.50" otherwise (the web app shows "€29.00").
- Controls that fake the traveller's side carry the yellow `PrototypeTag`.

## Keep the two apps telling the same story

- Statuses and labels: `statusLabel` in `src/state/store.tsx` (Scheduled, Live
  now, Awaiting acceptance, Completed) and `StatusPill` colours match the web
  dashboard.
- Places, filmers (Luka M., Ana K., Marin B., Karlo P., Iva M.), Maya Chen as
  the Hvar traveller and €29 checks match the web app.
- Money words for filmers: **Pending** (traveller has paid, waiting for
  acceptance) and **Paid out**. Don't say "escrow" to filmers; the traveller
  web app may keep it.
- Shared shapes in `src/types.ts` are copied from the web's `App.tsx`. Change
  both if one changes.
- The people who film are "filmers". The other side are "travellers".
- **Licensed tour guides** carry `guideLicence` on the filmer. Only a
  `verified` licence shows the "Licensed tour guide" badge to travellers
  (`FilmerBadges` in `src/components/filmer.tsx`). The web app should show the
  same badge once it gets filmer data from the API.

## Design system

Tokens in `src/theme.ts`, ported from the web's `DESIGN.md` and `:root` CSS.
Don't hardcode colours or sizes in screens.

- Warm grey page `#f7f7f7`; borderless grey cards (black at 4%); white only for
  controls inside cards and for things that float (sheets).
- Ink pill buttons act, including Join call. Yellow (`accent`) is only for
  section labels (`Kicker`) and the "Licensed tour guide" badge; icon tiles,
  avatars, info notes and the Scheduled pill are neutral. Red only means live
  or hang up (Live badges, REC, End call). The web app still uses a yellow
  Scheduled pill.
- Fraunces (soft serif) for headlines and italic leads; Inter for everything
  functional. Type scale 12 / 14 / 16 / 20 / 24 / 32 / 44 / 72. No all-caps.
- One shadow (`shadow`), only for floating things.
- Retro, warm, a bit quirky; Airbnb for product feel. Proof must look real and
  current: camera screens are dark, with GPS and time stamps.
- Components: `src/components/ui.tsx` (Text, Button, Card, StatusPill, Tag,
  Chip, Notice, Avatar, …), `layout.tsx` (Sheet, ActionBar, TextField),
  `cards.tsx`, `maps.tsx`, `brief.tsx`, `camera.tsx`.

## Copy

Short, plain, honest. Sentence case. Name the next step on buttons
("Accept", "Start filming", "Upload to Jonas"). Use curly apostrophes (’) in
JSX text (lint rejects straight ones).
