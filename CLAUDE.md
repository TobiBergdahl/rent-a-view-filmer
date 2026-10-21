# CLAUDE.md

Rent A View **walker app**: a clickable Expo prototype. Companion to the traveler
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
  walkers work 08:00–20:00.
- **Money is euro cents** (`payout: 2300`, `WALKER_PAYOUT` in `seed.ts`: about
  79% of the €29 customer price, always paid in euros), formatted with `euro()`: "€29" for whole euros, "€29.50" otherwise (the web app shows "€29.00").
- Controls that fake the traveler's side carry the yellow `PrototypeTag`.

## Keep the two apps telling the same story

- Statuses and labels: `statusLabel` in `src/state/store.tsx` (Scheduled, Live
  now, Awaiting acceptance, Completed) and `StatusPill` colours match the web
  dashboard.
- Dubrovnik only for the PoC. Places, walkers (Luka M., Ana K., Marin B., Karlo
  P., Iva M.), and Maya Chen's live booking at Banje Beachfront Studio match
  the web app.
- **No indoor checks.** Every brief must be visible from public space; walkers
  can't enter a property. Walkers can flag a brief they can't meet.
- Money words for walkers: **Pending** and **Paid out**, and "You get paid when
  Maya accepts, or automatically after 24 hours." Never say "escrow" or
  anything that suggests RentaView holds the money.
- Shared shapes in `src/types.ts` are copied from the web's `App.tsx`. Change
  both if one changes.
- Never say "filmer". In this app the people who film are **walkers**;
  travelers call them their **local**. The other side are **travelers** (US
  spelling, as on the web). Code identifiers like `Filmer` and `filmer` are
  internal and stay for now.
- **Licensed tour guides** carry `guideLicence` on the filmer. Only a
  `verified` licence shows the "Licensed tour guide" badge to travelers
  (`FilmerBadges` in `src/components/filmer.tsx`). The web app should show the
  same badge once it gets walker data from the API.

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
