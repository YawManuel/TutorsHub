// Design tokens — transcribed 1:1 from the TutorsHub design handoff.
// Keep these exact for hifi parity with the prototype.

export const colors = {
  // Brand
  brand: '#1C56C9', // primary blue
  navy: '#10286B',
  navyDeep: '#0B1E52',

  // Ink / text
  ink: '#13234D', // headings
  bodyDark: '#3C4D45',
  body: '#5A6B63',
  secondary: '#7A8A82',
  muted: '#94A39B',
  mutedSoft: '#A6B2AB',
  faint: '#C4CFC9',

  // Gold accent
  gold: '#F4C24B',
  goldDeep: '#E0A92E',
  goldText: '#08333F',
  goldTextAlt: '#0B2350',

  // Onboarding teal gradient stops
  teal1: '#0C4756',
  teal2: '#08333F',
  teal3: '#052730',

  // Tutor green
  tutorGreen: '#0E7C5A',
  tutorGreenDeep: '#0A5C43',

  // Surfaces
  appBg: '#FBF8F1',
  card: '#FFFFFF',
  divider: '#EFEADE',
  dividerAlt: '#ECE6D8',
  dividerWarm: '#F1ECDF',

  // Semantic
  success: '#0E7C5A',
  error: '#D6486B',
  errorAlt: '#E5495F',
  star: '#E0A92E',

  white: '#FFFFFF',
  black: '#000000',
} as const;

// Category tints (tile backgrounds) + matching foreground for icon/initials.
export const tints = {
  blue: { bg: '#E7EEFB', fg: '#1C56C9' },
  blueAlt: { bg: '#E9F0FF', fg: '#3A6FD6' },
  pink: { bg: '#FCE9EC', fg: '#D6486B' },
  gold: { bg: '#FFF4D9', fg: '#C9931F' },
  purple: { bg: '#EFEAFB', fg: '#7C56D6' },
  teal: { bg: '#E6F6F4', fg: '#119C8B' },
  green: { bg: '#E7F4EE', fg: '#0E7C5A' },
} as const;

export const radius = {
  pill: 999,
  button: 18,
  buttonSm: 14,
  card: 24,
  cardSm: 18,
  tile: 16,
  tileSm: 13,
} as const;

export const spacing = {
  screenX: 22, // screen horizontal padding
  section: 24,
  cardPad: 18,
} as const;

// Soft, navy-tinted shadows. RN needs discrete props; these approximate the
// design's `0 8-14px … rgba(24,46,104,.2-.3)` blur/spread language.
export const shadows = {
  card: {
    shadowColor: '#182E68',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 4,
  },
  cardSoft: {
    shadowColor: '#182E68',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  primaryButton: {
    shadowColor: '#1C56C9',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 6,
  },
  goldButton: {
    shadowColor: '#F4C24B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 22,
    elevation: 6,
  },
} as const;

// Currency rule: 1 point = 20 TK; 1 TK = GHS 0.50.
export const TK_TO_GHS = 0.5;
