# Rent A View: filmer prototype

A clickable prototype of the **Rent A View filmer app**: the companion to the
traveller web app (`~/Development/rent-a-view`). Filmers are trusted locals who
pick up requests, go to the place, and film what the traveller asked for, so the
traveller can resolve a doubt before they book. A "don't book" answer counts as
a success too.

This is a **prototype**. It has no backend: data is hardcoded, and everything
lives in memory until you reload.

## Run it

Requires Node 20+ and Xcode with an iOS Simulator (or Expo Go on a phone).

```bash
npm install
npx expo start
```

Then press `i` to open it in the iOS Simulator, or scan the QR code with
**Expo Go** (SDK 57) on your phone. Any email and password signs you in as
**Luka M.**, a filmer in Split.

If the simulator times out opening the project (it can on a fresh boot), open
Expo Go once by hand and run `xcrun simctl openurl booted exp://127.0.0.1:8081`.

## Share a preview (no Apple account needed)

The client installs **Expo Go** from the App Store, then scans this QR code with
the iPhone camera (or opens the link). It always loads the latest preview.

<img src="docs/preview-qr.png" width="200" alt="QR code for the client preview">

```
exp://u.expo.dev/b41a12c2-82c5-4f4a-b67c-41d049260312?channel-name=preview&runtime-version=exposdk:57.0.0
```

To push your latest changes to everyone who has it:

```bash
npm run publish:preview
```

It's live as soon as the command finishes; the client sees it the next time
they open it. The runtime version is tied to the Expo SDK (`exposdk:57.0.0`),
so it keeps working only while Expo Go on the App Store supports SDK 57.
After an SDK upgrade, publish again and make a new QR code with the new
runtime version.

## TestFlight

Builds run in the cloud on EAS (Expo account `tobiasbergdahl`, project
`rentaview-filmer`), so no local Xcode is needed. You need an Apple Developer
account.

```bash
npx eas-cli build --platform ios --profile production --auto-submit
```

The first run asks you to sign in to Apple, creates the certificates and the
App Store Connect app (bundle ID `hr.rentaview.filmer`), then uploads the
build. It shows up in TestFlight after Apple's processing, usually 10–30
minutes. Build numbers count up by themselves; bump `version` in `app.json`
for a new marketing version.

To invite people, open the app in [App Store Connect](https://appstoreconnect.apple.com)
→ TestFlight. Internal testers (people on your Apple team) can install right
away; external testers need a short Beta App Review the first time.

## What you can click through

| Flow | Where |
| --- | --- |
| Welcome and sign in (fake auth) | `src/app/welcome.tsx`, `sign-in.tsx` |
| Onboarding, 4 steps: account → profile details and tour guide licence → payout option → confirm connection → all set | `src/app/sign-up.tsx`, `src/app/onboarding/` |
| Nearby requests: list and map | `src/app/(tabs)/index.tsx` |
| Request detail and brief: the traveller's doubt, shots, time slot or deadline, map pin; accept or decline | `src/app/request/[id].tsx` |
| Job: navigate, "I've arrived" GPS check, "Can't get in?" report, progress | `src/app/job/[id].tsx` |
| Recorded job: one continuous take with the brief as a checklist on screen → review (retake if needed) → upload | `src/app/record/[id].tsx` |
| Live job: lobby counting down to the exact minute → video call with GPS sharing, the traveller talks and guides you → end call | `src/app/live/[id].tsx` |
| Delivered / call ended: waiting for the traveller to accept | `src/app/done/[id].tsx` |
| Jobs: upcoming, awaiting acceptance, completed (paid) | `src/app/(tabs)/jobs.tsx` |
| Earnings: paid out (week, month, all time) vs pending, next payout day, ratings received | `src/app/(tabs)/earnings.tsx` |
| Profile: photo, name, bio, how travellers see you, tour guide licence, payout method | `src/app/(tabs)/profile.tsx` |

**A good demo path:** sign in → Jobs → *Hvar Beachfront Studio* → Join call →
*Skip the wait* → Maya's tile lights up while she talks → End call. Then Requests → *Split
Center* → Accept → I've arrived → Start filming → record, ticking off the checklist → stop →
Upload. On an *Awaiting acceptance* job, tap **Simulate: … accepts and
rates** to see the money move from pending to paid out.

### The prototype clock

Every launch starts the app's clock at **10:42 Croatian time today**, then it
runs in real time (`src/lib/time.ts`). That keeps the demo inside filmers'
working hours, and puts the Hvar live call (10:45) three minutes away.

## Shared story with the web app

Statuses, places, people and amounts mirror the traveller prototype so both
apps tell the same story:

- **Scheduled → Live now → Awaiting acceptance → Completed**, then rated.
  Same pill colours as the web dashboard.
- Hvar Beachfront Studio is Maya's live booking with Luka M., as on the web.
  The call shows the same balcony frame, and the GPS simulation is the same
  code as the web's `useSimulatedFilmer`, with the same white-dot-blue-ring
  marker.
- Recorded checks start at €29.00, held in escrow until the traveller accepts.
- Shared shapes (`LatLng`, `Place`, `BookingMode`, `User`) are copied into
  `src/types.ts`, not imported.

## Stack

- Expo SDK 57, React Native 0.86, TypeScript, Expo Router (native tabs, stack)
- `react-native-maps` (Apple Maps on iOS; works in Expo Go)
- Reanimated for the camera drift and small entrances
- Fonts: Inter (`@expo-google-fonts/inter`) and Fraunces with the SOFT axis at
  100, cut into static files in `assets/fonts` from the OFL variable font
  (licence: `assets/fonts/Fraunces-OFL.txt`). Expo Go can't set variable font
  axes, so the instances are pre-made: Display (600, WONK), Medium (500),
  SemiBold (600) and Italic (400).

## Project structure

| Path | What's in it |
| --- | --- |
| `src/theme.ts` | Design tokens ported from the web's `DESIGN.md` and `:root` CSS |
| `src/types.ts` | Shared shapes plus `Request`, `Job`, `Filmer` |
| `src/data/seed.ts` | Requests, jobs, Luka's profile, areas |
| `src/data/photos.ts` | Placeholder Unsplash photos (same IDs as the web) |
| `src/state/store.tsx` | In-memory store and all actions (`accept`, `deliver`, `endCall`, …) |
| `src/services/` | Fakes to swap for real services: `auth`, `location`, `upload` |
| `src/components/` | UI kit (`ui.tsx`), layout, cards, maps, brief, camera |
| `src/lib/` | Prototype clock and Zagreb time formatting, distances, money |

## Limits, and what production needs

| Area | Prototype today | Needed |
| --- | --- | --- |
| **Auth** | Fake: any email signs in as Luka | Real auth, shared with the traveller app |
| **Data** | Hardcoded in `src/data/seed.ts`, lost on reload | An API shared with the traveller app. Replace the bodies of the store actions. |
| **Filmer verification** | A "Verified filmer" badge | ID checks before the first paid job |
| **Tour guide licence** | File picked (photo or PDF) but never sent; goes straight to "In review". "Simulate: licence approved" in Profile turns on the badge | Upload to storage, a review step, and the "Licensed tour guide" badge in the traveller web app (`Filmer.guideLicence.status === 'verified'`) |
| **Location** | Simulated (`src/services/location.ts`); the filmer's area stands in for their position | `expo-location`, publish fixes to the API, verify arrival server side |
| **Camera** | A drifting placeholder photo with a GPS and time stamp | `expo-camera` recording, stamp metadata into the files |
| **Upload** | Simulated progress (`src/services/upload.ts`) | Resumable upload and storage (e.g. S3 multipart or Mux) |
| **Live video** | Simulated call: a moving placeholder frame and a fake "speaking" indicator | A live-video provider (e.g. LiveKit, Daily, Agora) |
| **Payouts** | Escrow amounts and the payout method (bank, PayPal, Wise) are display only; "Authorise connection" just waits a second | Payment provider with escrow and payouts to filmers. The platform fee split is not modelled: payout = price. |
| **Maps** | Apple Maps via `react-native-maps` | Fine on iOS; Android needs a Google Maps API key |
| **Photos** | Unsplash hotlinked; welcome photo copied from the web's `public/media/filmer-cafe.jpg` | Self-host or replace with the client's photography, and confirm the welcome photo's licence |
| **Profile photo** | Kept in memory | Upload to storage |
| **Clock** | Starts at 10:42 Zagreb time every launch | `Date.now()` |
| **Copy** | Placeholders such as "4.9 · 52 reviews", "24 hours to accept", "paid out every Friday" | Confirm with the client |

Code marked "Prototype" in the UI (yellow tag) only exists to fake the other
side of the marketplace.
