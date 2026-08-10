import { useEffect } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import { notificationsApi, type AppNotification } from '../services/notificationsApi';
import { openSse } from '../services/sseClient';
import { registerForPush } from '../services/push';
import { useAuth } from '../context/AuthContext';

/**
 * Notifications hooks. Return types are annotated explicitly — see the note in
 * useCatalog.ts about react-query inference under Expo's `moduleResolution: node`.
 */

export const notifKeys = {
  feed: ['notifications'] as const,
  unread: ['notifications', 'unread'] as const,
};

export function useNotifications(): UseQueryResult<AppNotification[]> {
  return useQuery({ queryKey: notifKeys.feed, queryFn: notificationsApi.list });
}

export function useUnreadCount(): UseQueryResult<number> {
  return useQuery({ queryKey: notifKeys.unread, queryFn: notificationsApi.unreadCount });
}

export function useMarkRead(): UseMutationResult<unknown, Error, string> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.markRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notifKeys.feed });
      qc.invalidateQueries({ queryKey: notifKeys.unread });
    },
  });
}

export function useMarkAllRead(): UseMutationResult<unknown, Error, void> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      qc.setQueryData<number>(notifKeys.unread, 0);
      qc.invalidateQueries({ queryKey: notifKeys.feed });
    },
  });
}

/**
 * App-wide live sync: while signed in, subscribe to the notifications SSE stream
 * and keep the unread badge + feed current. Mounted once (in RootNavigator) so
 * there is a single connection. No-op while signed out.
 */
export function useNotificationsSync(): void {
  const qc = useQueryClient();
  const { status } = useAuth();

  useEffect(() => {
    if (status !== 'authed') return;
    // Register this device for push (no-op until expo-notifications is added).
    void registerForPush();
    const close = openSse('/notifications/stream', {
      onEvent: (event, data) => {
        if (event !== 'notification') return;
        const payload = data as { notification: AppNotification; unread: number };
        qc.setQueryData<number>(notifKeys.unread, payload.unread);
        qc.setQueryData<AppNotification[]>(notifKeys.feed, (prev: AppNotification[] = []) =>
          prev.some((n) => n.id === payload.notification.id) ? prev : [payload.notification, ...prev],
        );
      },
    });
    return close;
  }, [status, qc]);
}
