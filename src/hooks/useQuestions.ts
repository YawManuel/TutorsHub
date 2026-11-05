import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { questionsApi, type Question, type QuestionQuery } from '../services/questionsApi';

/**
 * TanStack Query hook over the practice question bank. Each quiz session is a
 * fresh shuffle, so we keep it out of the cache (staleTime 0) and let the screen
 * refetch to reshuffle on "Try again".
 *
 * Return type is annotated explicitly — under Expo's `moduleResolution: node`,
 * react-query v5's generic inference collapses `data` to `any`; see useCatalog.
 */

export const questionKeys = {
  questions: (params: QuestionQuery) => ['practice-questions', params] as const,
  topics: (grade: string, subject: string) => ['practice-topics', grade, subject] as const,
};

export function useQuestions(params: QuestionQuery): UseQueryResult<Question[]> {
  return useQuery({
    queryKey: questionKeys.questions(params),
    queryFn: () => questionsApi.questions(params),
    enabled: !!params.grade,
    staleTime: 0,
    gcTime: 0,
  });
}
