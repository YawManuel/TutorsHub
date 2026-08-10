import { api } from './apiClient';

/**
 * Phase 5 reviews. Students rate a booked session 20–100 points; the score
 * folds into the tutor's running average (which drives the 5-star display).
 * Listing a tutor's reviews is public; posting one is authenticated.
 */

export interface Review {
  id: string;
  score: number; // 20..100
  comment: string | null;
  createdAt: string;
  author: { name: string; initials: string };
}

export interface CreateReviewInput {
  bookingId: string;
  score: number; // 20..100
  comment?: string;
}

export interface ReviewResult {
  bookingId: string;
  tutorId: string;
  score: number;
  comment: string | null;
  tutorRating: { ratingCount: number; avg: number; stars: number };
}

export const reviewsApi = {
  tutorReviews: (tutorId: string) =>
    api.get<Review[]>(`/tutors/${tutorId}/reviews`).then((r) => r.data),
  createReview: (input: CreateReviewInput) =>
    api.post<ReviewResult>('/reviews', input).then((r) => r.data),
};
