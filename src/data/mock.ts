// Client-only static data. The marketplace data that used to live here
// (subjects, tutors, classes, packages, videos, practice sets, help tutors)
// is now served by the backend — see `src/services/catalogApi.ts` and the
// hooks in `src/hooks/useCatalog.ts`. What remains is either pure UI config or
// a placeholder for data that arrives in a later phase.

import { tints } from '../theme/tokens';
import type { TabParamList } from '../navigation/types';

export type Role = {
  key: 'student' | 'hub' | 'help';
  icon: string;
  tint: string;
  fg: string;
  title: string;
  desc: string;
};

// Onboarding roles (static UI; maps to backend role slugs in RoleScreen).
export const roles: Role[] = [
  {
    key: 'student',
    icon: 'backpack',
    tint: tints.blue.bg,
    fg: tints.blue.fg,
    title: 'Student',
    desc: 'Learn, practice and compete to earn coins',
  },
  {
    key: 'hub',
    icon: 'cast_for_education',
    tint: tints.gold.bg,
    fg: tints.gold.fg,
    title: 'Hub Tutor',
    desc: 'Teach scheduled tutoring sessions & tutorials',
  },
  {
    key: 'help',
    icon: 'support_agent',
    tint: tints.blueAlt.bg,
    fg: tints.blueAlt.fg,
    title: 'Help Tutor',
    desc: 'Help with assignments & essays on demand',
  },
];

export type HomeFeature = {
  label: string;
  icon: string;
  tint: string;
  fg: string;
  route: keyof TabParamList;
};

// Home quick-action grid (pure navigation config).
export const homeFeatures: HomeFeature[] = [
  { label: 'Book a Tutor', icon: 'school', tint: tints.blue.bg, fg: tints.blue.fg, route: 'Tutors' },
  { label: 'Help Tutor', icon: 'support_agent', tint: tints.gold.bg, fg: tints.gold.fg, route: 'Tutors' },
  { label: 'Practice Room', icon: 'quiz', tint: tints.blueAlt.bg, fg: tints.blueAlt.fg, route: 'Compete' },
  { label: 'Challenge', icon: 'emoji_events', tint: tints.pink.bg, fg: tints.pink.fg, route: 'Compete' },
  { label: 'Tutorials', icon: 'play_circle', tint: tints.purple.bg, fg: tints.purple.fg, route: 'Class' },
  { label: 'Study Groups', icon: 'groups', tint: tints.teal.bg, fg: tints.teal.fg, route: 'Group' },
];

// Class-tab filter labels (static tabs; real filtering lands with Phase 3).
export const classFilters = ['Today', 'Upcoming', 'Recorded', 'My classes'];

// Participant avatar photos, referenced by a class's `av` indices.
export const avatarImages = [
  require('../../assets/images/aff1.png'),
  require('../../assets/images/aff2.png'),
  require('../../assets/images/aff3.jpg'),
  require('../../assets/images/aff4.png'),
  require('../../assets/images/asf.png'),
];

