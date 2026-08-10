import { api } from './apiClient';

/**
 * Phase 7 notifications. In-app feed (the bell), unread badge, read state, and
 * device push-token registration. Live badge/list updates arrive over SSE (see
 * the /notifications/stream subscription in useNotifications).
 */

export type NotificationType = 'booking' | 'payment' | 'help' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  read: boolean;
  createdAt: string;
}

export const notificationsApi = {
  list: () => api.get<AppNotification[]>('/notifications').then((r) => r.data),
  unreadCount: () =>
    api.get<{ unread: number }>('/notifications/unread-count').then((r) => r.data.unread),
  markRead: (id: string) =>
    api.post<{ ok: boolean; unread: number }>(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () =>
    api.post<{ updated: number; unread: number }>('/notifications/read-all').then((r) => r.data),
  registerToken: (token: string, platform?: 'ios' | 'android') =>
    api.post('/notifications/register-token', { token, platform }).then((r) => r.data),
  removeToken: (token: string) =>
    api.delete('/notifications/token', { data: { token } }).then((r) => r.data),
};
