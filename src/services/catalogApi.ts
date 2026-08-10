import { api } from './apiClient';

/**
 * Phase 2 marketplace read APIs. The response shapes mirror the design 1:1
 * (they replace the old `src/data/mock.ts` arrays), so screens consume them
 * with no visual change. All endpoints are public reads.
 */

export interface Subject {
  id: string;
  slug: string;
  name: string;
  icon: string;
  code: string;
  tint: string;
  fg: string;
}

export interface Tutor {
  id: string;
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
  rating?: number | null; // average review score out of 100 (null until rated)
}

export interface ClassItem {
  id: string;
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
  av: number[]; // indices into the app's local avatarImages
}

export interface Package {
  id: string; // slug: 'hub' | 'combo' | 'pseudo'
  name: string;
  price: number;
  coins: number;
  popular: boolean;
  desc: string;
  feats: string[];
}

export interface Video {
  id: string;
  title: string;
  subj: string;
  len: string;
  tint: string;
  fg: string;
  tag: string;
}

export interface PracticeSet {
  id: string;
  name: string;
  count: string;
  icon: string;
  tint: string;
  fg: string;
}

export interface HelpTutor {
  id: string;
  name: string;
  meta: string;
  initials: string;
  bg: string;
  fg: string;
}

export interface TutorQuery {
  q?: string;
  subject?: string; // subject slug
}

export const catalogApi = {
  subjects: () => api.get<Subject[]>('/subjects').then((r) => r.data),
  tutors: (params?: TutorQuery) => api.get<Tutor[]>('/tutors', { params }).then((r) => r.data),
  tutor: (id: string) => api.get<Tutor>(`/tutors/${id}`).then((r) => r.data),
  helpTutors: () => api.get<HelpTutor[]>('/help-tutors').then((r) => r.data),
  classes: () => api.get<ClassItem[]>('/classes').then((r) => r.data),
  packages: () => api.get<Package[]>('/packages').then((r) => r.data),
  videos: () => api.get<Video[]>('/videos').then((r) => r.data),
  practiceSets: () => api.get<PracticeSet[]>('/practice-sets').then((r) => r.data),
};
