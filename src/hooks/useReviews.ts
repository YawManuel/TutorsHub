import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  reviewsApi,
  type CreateReviewInput,
  type Review,
  type ReviewResult,
} from '../services/reviewsApi';
import { catalogKeys } from './useCatalog';

/**
 * Reviews hooks. Return types are annotated explicitly — see the note in
 * useCatalog.ts about react-query inference under Expo's `moduleResolution: node`.
 */

export const reviewKeys = {
  forTutor: (tutorId: string) => ['reviews', 'tutor', tutorId] as const,
};

export function useTutorReviews(tutorId: string): UseQueryResult<Review[]> {
  return useQuery({
    queryKey: reviewKeys.forTutor(tutorId),
    queryFn: () => reviewsApi.tutorReviews(tutorId),
  });
}

export function useCreateReview(tutorId: string): UseMutationResult<ReviewResult, Error, CreateReviewInput> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reviewsApi.createReview,
    onSuccess: () => {
      // Refresh the review list and the tutor (its stars/rating just changed).
      qc.invalidateQueries({ queryKey: reviewKeys.forTutor(tutorId) });
      qc.invalidateQueries({ queryKey: catalogKeys.tutor(tutorId) });
      qc.invalidateQueries({ queryKey: ['tutors'] }); // all list queries (any params)
    },
  });
}
