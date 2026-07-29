// Static data transcribed from the prototype's logic class. In a real build
// these would come from an API; the shapes mirror the design 1:1.

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

export type Package = {
  id: 'hub' | 'combo' | 'pseudo';
  name: string;
  price: number;
  coins: number;
  popular?: boolean;
  desc: string;
  feats: string[];
};

export type HomeFeature = {
  label: string;
  icon: string;
  tint: string;
  fg: string;
  route: keyof TabParamList;
};

export type Video = {
  title: string;
  subj: string;
  len: string;
  tint: string;
  fg: string;
  tag: string;
};

// Onboarding roles
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

// Subscription plans (billed monthly in GHS)
export const packages: Package[] = [
  {
    id: 'hub',
    name: 'Hub Student',
    price: 80,
    coins: 160,
    desc: 'Tutoring + tutorials',
    feats: [
      'Online tutoring sessions',
      'Video tutorials',
      'Customized study groups',
      'Monthly subscription',
    ],
  },
  {
    id: 'combo',
    name: 'Combo Student',
    price: 120,
    coins: 240,
    popular: true,
    desc: 'Most chosen plan',
    feats: [
      'Everything in Hub Student',
      'Online help tutor access',
      'Practice rooms & past questions',
      'Academic challenges',
    ],
  },
  {
    id: 'pseudo',
    name: 'Pseudo Student',
    price: 150,
    coins: 300,
    desc: 'Full access',
    feats: [
      'Everything in Combo',
      'Priority help tutor',
      'Annual / bi-annual options',
      'All groups & debate rooms',
    ],
  },
];

// Home quick-action grid
export const homeFeatures: HomeFeature[] = [
  { label: 'Book a Tutor', icon: 'school', tint: tints.blue.bg, fg: tints.blue.fg, route: 'Tutors' },
  { label: 'Help Tutor', icon: 'support_agent', tint: tints.gold.bg, fg: tints.gold.fg, route: 'Tutors' },
  { label: 'Practice Room', icon: 'quiz', tint: tints.blueAlt.bg, fg: tints.blueAlt.fg, route: 'Compete' },
  { label: 'Challenge', icon: 'emoji_events', tint: tints.pink.bg, fg: tints.pink.fg, route: 'Compete' },
  { label: 'Tutorials', icon: 'play_circle', tint: tints.purple.bg, fg: tints.purple.fg, route: 'Class' },
  { label: 'Study Groups', icon: 'groups', tint: tints.teal.bg, fg: tints.teal.fg, route: 'Group' },
];

// Watch & learn / tutorials rail
export const videos: Video[] = [
  { title: 'Quadratic Equations Made Easy', subj: 'Mathematics', len: '12:40', tint: '#E7EEFB', fg: '#1C56C9', tag: 'MATH' },
  { title: "Newton's Laws in Real Life", subj: 'Physics', len: '09:18', tint: '#E9F0FF', fg: '#3A6FD6', tag: 'PHYS' },
  { title: 'Essay Writing: Strong Introductions', subj: 'English', len: '15:02', tint: '#FCE9EC', fg: '#D6486B', tag: 'ENG' },
  { title: 'Balancing Chemical Equations', subj: 'Chemistry', len: '11:27', tint: '#FFF4D9', fg: '#C9931F', tag: 'CHEM' },
];

// Upcoming class shown on Home
export const upcomingClass = {
  initials: 'AM',
  title: 'Mathematics · Ama M.',
  when: 'Today · 4:00 PM · 60 min',
};

export const currentUser = {
  name: 'Kojo Mensah',
  initials: 'KM',
  coins: 1240,
};

// ---- Class tab ----

// Participant avatar photos (order: aff1, aff2, aff3, aff4, asf).
export const avatarImages = [
  require('../../assets/images/aff1.png'),
  require('../../assets/images/aff2.png'),
  require('../../assets/images/aff3.jpg'),
  require('../../assets/images/aff4.png'),
  require('../../assets/images/asf.png'),
];

export type ClassItem = {
  title: string;
  time: string;
  dur: string;
  level: string;
  price: string;
  count: string;
  icon: string;
  tint: string;
  ill: string;
  live: boolean;
  av: number[]; // indices into avatarImages
};

export const classFilters = ['Today', 'Upcoming', 'Recorded', 'My classes'];

export const classes: ClassItem[] = [
  { title: 'Applied Mathematics', time: '08:00 – 09:00 AM', dur: '2 hour', level: 'Class X – XI', price: 'GHS 60', count: '+32', icon: 'calculate', tint: '#EAF1FF', ill: '#3A6FD6', live: true, av: [0, 1, 2] },
  { title: 'Basic Mathematics', time: '09:00 – 12:00 PM', dur: '3 hour', level: 'Class X – XI', price: 'GHS 70', count: '+23', icon: 'functions', tint: '#E8F7F0', ill: '#119C8B', live: false, av: [3, 4, 0] },
  { title: 'English Comprehension', time: '02:00 – 03:30 PM', dur: '1.5 hour', level: 'Class XI', price: 'GHS 55', count: '+18', icon: 'menu_book', tint: '#FFF0E6', ill: '#D6486B', live: false, av: [1, 2, 3] },
  { title: 'Integrated Science', time: '04:00 – 05:00 PM', dur: '1 hour', level: 'Class X', price: 'GHS 65', count: '+27', icon: 'science', tint: '#F1ECFB', ill: '#7C56D6', live: false, av: [4, 0, 1] },
];

export type PracticeSet = { name: string; count: string; icon: string; tint: string; fg: string };

export const practiceSets: PracticeSet[] = [
  { name: 'Past questions', count: '120 questions', icon: 'history_edu', tint: '#E9F0FF', fg: '#3A6FD6' },
  { name: 'Trial questions', count: '84 questions', icon: 'edit_note', tint: '#FFF4D9', fg: '#C9931F' },
  { name: 'Sample exams', count: '36 papers', icon: 'assignment', tint: '#FCE9EC', fg: '#D6486B' },
  { name: 'Aptitude tests', count: '52 questions', icon: 'psychology', tint: '#EFEAFB', fg: '#7C56D6' },
];

// ---- Tutors tab ----

export type Subject = { name: string; icon: string; tint: string; fg: string };

export const subjects: Subject[] = [
  { name: 'Mathematics', icon: 'functions', tint: '#E7EEFB', fg: '#1C56C9' },
  { name: 'English', icon: 'menu_book', tint: '#FCE9EC', fg: '#D6486B' },
  { name: 'Physics', icon: 'rocket_launch', tint: '#E9F0FF', fg: '#3A6FD6' },
  { name: 'Chemistry', icon: 'science', tint: '#FFF4D9', fg: '#C9931F' },
  { name: 'Biology', icon: 'biotech', tint: '#E6F6F4', fg: '#119C8B' },
  { name: 'ICT', icon: 'computer', tint: '#EFEAFB', fg: '#7C56D6' },
];

export type Tutor = {
  name: string;
  subj: string;
  stars: number;
  rate: number;
  sessions: number;
  rank: string;
  bg: string;
  fg: string;
  initials: string;
  bio: string;
};

export const tutors: Tutor[] = [
  { name: 'Ama Mensah', subj: 'Mathematics', stars: 5, rate: 120, sessions: 320, rank: 'Top Tutor', bg: '#E7EEFB', fg: '#1C56C9', initials: 'AM', bio: 'SHS Mathematics specialist. WASSCE prep, algebra & calculus made simple.' },
  { name: 'Kwame Boateng', subj: 'Physics', stars: 4, rate: 110, sessions: 210, rank: 'Rising Star', bg: '#E9F0FF', fg: '#3A6FD6', initials: 'KB', bio: 'Physics & elective maths. Turns hard topics into clear, simple steps.' },
  { name: 'Efua Owusu', subj: 'English', stars: 5, rate: 100, sessions: 412, rank: 'Top Tutor', bg: '#FCE9EC', fg: '#D6486B', initials: 'EO', bio: 'English language & literature. Essay coaching and comprehension drills.' },
  { name: 'Yaw Darko', subj: 'Chemistry', stars: 4, rate: 115, sessions: 158, rank: 'Verified', bg: '#FFF4D9', fg: '#C9931F', initials: 'YD', bio: 'Organic & inorganic chemistry, with past-question walkthroughs.' },
];

export const getTutor = (name: string): Tutor =>
  tutors.find((t) => t.name === name) ?? tutors[0];

export type HelpTutor = { id: string; name: string; meta: string; initials: string; bg: string; fg: string };

export const helpTutors: HelpTutor[] = [
  { id: 'abena', name: 'Ms. Abena Asante', meta: 'Maths · Available now', initials: 'AA', bg: '#E6F6F4', fg: '#119C8B' },
  { id: 'kwame', name: 'Mr. Kwame Owusu', meta: 'Maths · In 10 min', initials: 'KO', bg: '#E9F0FF', fg: '#3A6FD6' },
];
