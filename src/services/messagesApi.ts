import { api } from './apiClient';

/**
 * Phase 6 real-time help-session chat (REST half). History + send go over normal
 * authenticated requests; live delivery comes from the SSE stream — see
 * sseClient.ts and the useHelpChat hook.
 */

export type SenderRole = 'student' | 'tutor' | 'system';

export interface Message {
  id: string;
  helpRequestId: string;
  senderRole: SenderRole;
  senderId: string | null;
  author: { name: string; initials: string };
  body: string;
  createdAt: string;
}

export const messagesApi = {
  history: (helpRequestId: string) =>
    api.get<Message[]>(`/help-requests/${helpRequestId}/messages`).then((r) => r.data),
  send: (helpRequestId: string, body: string) =>
    api.post<Message>(`/help-requests/${helpRequestId}/messages`, { body }).then((r) => r.data),
};
