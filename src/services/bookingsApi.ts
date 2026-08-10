import { api } from './apiClient';
import type { ClassItem } from './catalogApi';

/**
 * Phase 3 bookings & scheduling APIs — all authenticated. Covers 1:1 tutor
 * bookings (+ the Home upcoming card), class enrollment ("My classes"), and the
 * on-demand help-request queue.
 */

export interface BookingTutor {
  id: string;
  name: string;
  subj: string;
  initials: string;
}

export interface Booking {
  id: string;
  status: string;
  scheduledAt: string;
  durationMinutes: number;
  price: number;
  meetingUrl: string | null;
  note: string | null;
  tutor: BookingTutor;
  title: string; // "Mathematics · Ama M."
  whenLabel: string; // "Today · 4:00 PM · 90 min"
}

export interface HelpRequest {
  id: string;
  subject: string;
  question: string;
  status: string;
  createdAt: string;
  helpTutor: { id: string; name: string };
}

export interface CreateBookingInput {
  tutorId: string;
  scheduledAt?: string;
  note?: string;
}

export interface CreateHelpRequestInput {
  helpTutorId: string; // help-tutor slug
  subject: string;
  question: string;
}

export interface EnrollResult {
  enrolled: boolean;
  alreadyEnrolled: boolean;
}

export const bookingsApi = {
  createBooking: (input: CreateBookingInput) =>
    api.post<Booking>('/bookings', input).then((r) => r.data),
  bookings: (upcomingOnly = false) =>
    api
      .get<Booking[]>('/bookings', { params: upcomingOnly ? { upcoming: 'true' } : undefined })
      .then((r) => r.data),
  nextBooking: () => api.get<Booking | null>('/bookings/next').then((r) => r.data),

  enrollClass: (classId: string) =>
    api.post<EnrollResult>(`/classes/${classId}/enroll`).then((r) => r.data),
  myClasses: () => api.get<ClassItem[]>('/classes/mine').then((r) => r.data),

  createHelpRequest: (input: CreateHelpRequestInput) =>
    api.post<HelpRequest>('/help-requests', input).then((r) => r.data),
  helpRequests: () => api.get<HelpRequest[]>('/help-requests').then((r) => r.data),
};
