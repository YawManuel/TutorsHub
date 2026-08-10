import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery, type UseQueryResult } from '@tanstack/react-query';
import {
  catalogApi,
  type ClassItem,
  type HelpTutor,
  type Package,
  type PracticeSet,
  type Subject,
  type Tutor,
  type TutorQuery,
  type Video,
} from '../services/catalogApi';

/**
 * TanStack Query hooks over the marketplace read APIs. Catalog data changes
 * rarely, so we give it a generous staleTime to avoid needless refetching.
 */

const STALE = 5 * 60 * 1000; // 5 minutes

export const catalogKeys = {
  subjects: ['subjects'] as const,
  tutors: (params: TutorQuery) => ['tutors', params] as const,
  tutor: (id: string) => ['tutor', id] as const,
  helpTutors: ['help-tutors'] as const,
  classes: ['classes'] as const,
  packages: ['packages'] as const,
  videos: ['videos'] as const,
  practiceSets: ['practice-sets'] as const,
};

// NOTE: return types are annotated explicitly. The Expo base tsconfig uses
// `moduleResolution: node`, under which react-query v5's generic inference on
// useQuery collapses `data` to `any`; the annotations restore type safety at
// the hook boundary without changing global module resolution.

export function useSubjects(): UseQueryResult<Subject[]> {
  return useQuery({ queryKey: catalogKeys.subjects, queryFn: catalogApi.subjects, staleTime: STALE });
}

export function useTutors(params: TutorQuery): UseQueryResult<Tutor[]> {
  return useQuery({
    queryKey: catalogKeys.tutors(params),
    queryFn: () => catalogApi.tutors(params),
    staleTime: STALE,
    placeholderData: keepPreviousData, // keep the list steady while searching
  });
}

export function useTutor(id: string): UseQueryResult<Tutor> {
  return useQuery({
    queryKey: catalogKeys.tutor(id),
    queryFn: () => catalogApi.tutor(id),
    staleTime: STALE,
    enabled: !!id,
  });
}

export function useHelpTutors(): UseQueryResult<HelpTutor[]> {
  return useQuery({ queryKey: catalogKeys.helpTutors, queryFn: catalogApi.helpTutors, staleTime: STALE });
}

export function useClasses(): UseQueryResult<ClassItem[]> {
  return useQuery({ queryKey: catalogKeys.classes, queryFn: catalogApi.classes, staleTime: STALE });
}

export function usePackages(): UseQueryResult<Package[]> {
  return useQuery({ queryKey: catalogKeys.packages, queryFn: catalogApi.packages, staleTime: STALE });
}

export function useVideos(): UseQueryResult<Video[]> {
  return useQuery({ queryKey: catalogKeys.videos, queryFn: catalogApi.videos, staleTime: STALE });
}

export function usePracticeSets(): UseQueryResult<PracticeSet[]> {
  return useQuery({ queryKey: catalogKeys.practiceSets, queryFn: catalogApi.practiceSets, staleTime: STALE });
}

/** Debounce a rapidly-changing value (e.g. a search box) by `delay` ms. */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
