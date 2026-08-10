# TutorsHub — Mobile App (Expo / React Native + TypeScript)

Implementation of the TutorsHub design handoff (`../design_handoff_tutorshub_app`).
Ghana-localized learning app: live tutoring, practice, challenges, study groups,
and an in-app TUT Coin (TK) currency.

## Status

Built so far:

- **Onboarding flow** — Welcome → Role → Plan → Create account
- **Home** — greeting, TUT Coin balance card, quick-action grid, upcoming class, "Watch & learn" rail
- **Class tab** — sub-tabs Class / Practice / Tutorials (filter chips + class cards with
  avatar stacks & LIVE badges; subject selector + practice-set grid; tutorial video list)
- **Tutors tab** — sub-tabs Hub Tutor / Help Tutor (search + subject filter + tutor cards;
  help-request form with tutor picker), and **Tutor detail** (blue header, stats, about,
  sticky "Book session" footer)
- **Bottom tab shell** — Home · Class · Tutors · Compete · Group (Compete & Group are
  placeholders wired for navigation)

Leaf actions that lead to not-yet-built screens (join a live class, open a tutorial/practice
set, book a session, request help) surface a toast for now.

Remaining screens from the handoff (Live session, Practice/Quiz, Compete, Groups, Videos,
Wallet, Payment, Profiles, Become-a-tutor) are next.

## Requirements

- Node 18–20 recommended (works on newer, but Expo SDK 52 targets LTS)
- `npx expo` (installed as a dependency; no global install needed)

## Run

```bash
cd "TutorsHub mobile app screens/TutorsHubApp"
npm install          # if not already installed
npm start            # Expo dev server (press i / a, or scan QR in Expo Go)
npm run ios          # iOS simulator
npm run android      # Android emulator
npm run web          # web preview
npm run typecheck    # tsc --noEmit
```

## Architecture

```
App.tsx                     Font loading, NavigationContainer, providers
index.js                    Expo entry
src/
  theme/
    tokens.ts               Colors, tints, radius, spacing, shadows (from handoff)
    typography.ts           Plus Jakarta Sans + Nunito font map/names
  data/mock.ts              Static data transcribed from the prototype arrays
  navigation/
    types.ts                Typed route params (RootStack + Tabs)
    RootNavigator.tsx       Onboarding stack -> Main tabs -> TutorDetail
    TabNavigator.tsx        5-tab bottom bar (custom tab bar)
  components/
    Icon.tsx                Material Symbols -> MaterialIcons glyph mapping
    PrimaryButton.tsx       Blue / gold / navy / ghost button
    BackButton.tsx          Rounded back button
    TopBar.tsx              Logo + notifications + avatar
    SubTabs.tsx             Underline sub-tab bar
    Chip.tsx                Pill filter chip
    StarRating.tsx          Five-star rating row
    AvatarStack.tsx         Overlapping participant photos + count
    Toast.tsx               Transient bottom pill + useToast() hook
  screens/
    onboarding/             Welcome, Role, Package, CreateAccount
    HomeScreen.tsx
    ClassScreen.tsx         Class / Practice / Tutorials sub-tabs
    tutors/
      TutorsScreen.tsx      Hub Tutor / Help Tutor sub-tabs
      TutorDetailScreen.tsx Tutor profile + book session
    PlaceholderScreen.tsx   Stub for Compete/Group
assets/images/              Logo, onboarding student, class avatars
```

## Design fidelity notes

- **Tokens** in `src/theme/tokens.ts` are transcribed 1:1 from the handoff. Keep exact.
- **Fonts:** headings/labels use Plus Jakarta Sans; body uses Nunito (via `@expo-google-fonts`).
- **Icons:** the prototype uses Material Symbols Rounded; here we map the same glyph
  names to `@expo/vector-icons` MaterialIcons (`src/components/Icon.tsx`). MaterialIcons
  has no fill-variant toggle, so active/inactive states differ by color only.
- **Shadows:** CSS blur/spread are approximated with RN `shadow*` / `elevation`.
- **Currency:** 1 point = 20 TK; 1 TK = GHS 0.50 (`TK_TO_GHS` in tokens).
```
