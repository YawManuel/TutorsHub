import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  bookingsApi,
  type Booking,
  type CreateBookingInput,
  type CreateHelpRequestInput,
  type EnrollResult,
  type HelpRequest,
} from '../services/bookingsApi';
import type { ClassItem } from '../services/catalogApi';

/**
 * Queries + mutations for bookings, enrollment and help requests. Return types
 * are annotated explicitly — see the note in useCatalog.ts about react-query
 * inference collapsing under the Expo base `moduleResolution: node`.
 */

export const bookingKeys = {
  all: ['bookings'] as const,
  next: ['bookings', 'next'] as const,
  myClasses: ['classes', 'mine'] as const,
  helpRequests: ['help-requests'] as const,
};

export function useNextBooking(): UseQueryResult<Booking | null> {
  return useQuery({ queryKey: bookingKeys.next, queryFn: bookingsApi.nextBooking });
}

export function useBookings(upcomingOnly = false): UseQueryResult<Booking[]> {
  return useQuery({
    queryKey: [...bookingKeys.all, { upcomingOnly }],
    queryFn: () => bookingsApi.bookings(upcomingOnly),
  });
}

export function useMyClasses(enabled = true): UseQueryResult<ClassItem[]> {
  return useQuery({ queryKey: bookingKeys.myClasses, queryFn: bookingsApi.myClasses, enabled });
}

export function useHelpRequests(): UseQueryResult<HelpRequest[]> {
  return useQuery({ queryKey: bookingKeys.helpRequests, queryFn: bookingsApi.helpRequests });
}

export function useCreateBooking(): UseMutationResult<Booking, Error, CreateBookingInput> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bookingsApi.createBooking,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}

export function useEnrollClass(): UseMutationResult<EnrollResult, Error, string> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bookingsApi.enrollClass,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bookingKeys.myClasses });
    },
  });
}

export function useCreateHelpRequest(): UseMutationResult<HelpRequest, Error, CreateHelpRequestInput> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bookingsApi.createHelpRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bookingKeys.helpRequests });
    },
  });
}
