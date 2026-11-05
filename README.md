# TutorsHub — Mobile App

Expo / React Native (TypeScript) client for **TutorsHub**, a Ghana-focused
tutoring marketplace: live tutoring, on-demand help, practice, subscriptions,
and an in-app **TUT Coin (TK)** wallet. Talks to the API in the sibling
[`TutorsHub-backend`](https://github.com/YawManuel/TutorsHub-backend) repo.

**Stack:** Expo ~52 · React Native 0.76 · React 18.3 · TypeScript (strict) ·
React Navigation v7 · TanStack Query · axios · expo-secure-store.

**Status:** onboarding + all screens wired to the live API (Phases 2–7).

---

## Quick start

```bash
npm install
# Point the app at your backend (see below). Defaults work for a local backend:
export EXPO_PUBLIC_API_URL=http://localhost:4000
npx expo start
```

Then press `a` (Android), `i` (iOS), or scan the QR with Expo Go.

### Running with the backend

The backend runs with zero database setup:

```bash
# in ../TutorsHub-backend
npm install && npm run dev:mem     # API on http://localhost:4000
```

Set `EXPO_PUBLIC_API_URL` to reach it. If unset, the app falls back to:
- **Android emulator:** `http://10.0.2.2:4000` (host machine)
- **iOS simulator / web:** `http://localhost:4000`
- **Physical device:** set `EXPO_PUBLIC_API_URL=http://<your-LAN-IP>:4000`

Sign up in the app, then book a tutor, top up the wallet, request help (opens a
live chat), and watch the notification bell update in real time.

---

## Scripts

| Command | Purpose |
| --- | --- |
| `npx expo start` | Start the Metro dev server |
| `npx tsc --noEmit` | Type-check (strict) |

---

## How it's wired

Screens never call `axios` directly. Data flows through three layers:

```
src/services/*Api.ts     typed fetchers over the shared axios instance (apiClient)
src/hooks/use*.ts        TanStack Query hooks (queries + mutations, cache keys)
src/screens/**           consume the hooks; render loading/error via <ListState/>
```

- **`services/apiClient.ts`** — the axios instance: attaches the JWT, and on a
  401 transparently refreshes the token (single-flight) and retries.
- **Auth** lives in `context/AuthContext.tsx`; tokens are persisted in
  `expo-secure-store` (`services/tokenStore.ts`).
- **Real-time** (help chat + notification badge) uses SSE over an
  XHR-based client (`services/sseClient.ts`) — no extra dependency.

> **TS note:** hooks annotate their return type explicitly
> (`UseQueryResult<T>` / `UseMutationResult<…>`). Expo's base tsconfig sets
> `moduleResolution: node`, under which react-query v5's generic inference
> otherwise collapses `data` to `any`. Keep the annotations.

---

## Project structure

```
src/
  components/   shared UI (Icon, PrimaryButton, ListState, Toast, TopBar…)
  config/       env (EXPO_PUBLIC_API_URL resolution)
  context/      AuthContext (session state + sign in/out)
  hooks/        useCatalog, useBookings, useWallet, useReviews,
                useHelpChat, useNotifications
  navigation/   RootNavigator (auth-gated) + TabNavigator + route types
  screens/      onboarding/, tutors/, Home, Class, Notifications, …
  services/     apiClient + per-feature *Api + sseClient + push + tokenStore
  theme/        design tokens + typography
```

---

## Features (by backend phase)

- **Auth** — email/password signup & login, token refresh, auth-gated nav.
- **Catalog** — tutors (search + subject filter), classes, packages, videos,
  practice sets, help tutors.
- **Bookings** — book a tutor, Home “upcoming session” card, class enrollment
  + “My classes”.
- **Wallet & payments** — real TUT Coin balance, Add Coins (Paystack top-up),
  Withdraw.
- **Reviews & uploads** — rate a session (20–100 pts) on the tutor page.
- **Real-time help chat** — request help → live SSE thread with presence.
- **Notifications** — live unread badge on the bell + notifications feed.

---

## Documented seams (need a native module / config to finish)

These are wired up to the point the missing piece allows; the backend side is
ready for each:

- **Google sign-in** — button shows a placeholder; needs Google client IDs +
  `expo-auth-session` (backend `/auth/google` is ready).
- **Push registration** — `services/push.ts` no-ops until `expo-notifications`
  is added; the token-registration endpoint is ready.
- **Help-request file attachments** — the upload API + pipeline are ready;
  wiring the “Attach assignment” dropzone needs `expo-document-picker`.
- **Authed subscription purchase** — the onboarding plan screen is pre-auth
  (selection only); the subscribe API + `useSubscribe` hook await a post-signup
  plan screen.

---

## Configuration

Only one env var, read at build time by Expo:

| Var | Purpose | Default |
| --- | --- | --- |
| `EXPO_PUBLIC_API_URL` | Backend base URL | per-platform localhost (see above) |
