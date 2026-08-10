import { useEffect, useState } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import { messagesApi, type Message } from '../services/messagesApi';
import { openSse } from '../services/sseClient';

/**
 * Live help-session chat: seeds from REST history, then keeps the thread current
 * over an SSE stream (new messages + presence). Return types are annotated
 * explicitly — see the note in useCatalog.ts about react-query inference under
 * Expo's `moduleResolution: node`.
 */

export const chatKeys = {
  messages: (id: string) => ['messages', id] as const,
};

export function useMessages(helpRequestId: string): UseQueryResult<Message[]> {
  return useQuery({
    queryKey: chatKeys.messages(helpRequestId),
    queryFn: () => messagesApi.history(helpRequestId),
  });
}

export interface HelpChatLive {
  online: number;
  connected: boolean;
}

/**
 * Subscribe to the thread's SSE stream for the component's lifetime. New
 * messages are merged into the react-query cache (deduped by id); presence is
 * returned as live state.
 */
export function useHelpChatStream(helpRequestId: string): HelpChatLive {
  const qc = useQueryClient();
  const [online, setOnline] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const close = openSse(`/help-requests/${helpRequestId}/stream`, {
      onOpen: () => setConnected(true),
      onEvent: (event, data) => {
        if (event === 'presence') {
          setOnline((data as { online: number }).online ?? 0);
        } else if (event === 'message') {
          const msg = (data as { message: Message }).message;
          qc.setQueryData<Message[]>(chatKeys.messages(helpRequestId), (prev: Message[] = []) =>
            prev.some((m) => m.id === msg.id) ? prev : [...prev, msg],
          );
        }
      },
      onError: () => setConnected(false),
    });
    return () => {
      close();
      setConnected(false);
    };
  }, [helpRequestId, qc]);

  return { online, connected };
}

export function useSendMessage(helpRequestId: string): UseMutationResult<Message, Error, string> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => messagesApi.send(helpRequestId, body),
    onSuccess: (msg) => {
      // Optimistically merge; the SSE echo is deduped by id.
      qc.setQueryData<Message[]>(chatKeys.messages(helpRequestId), (prev: Message[] = []) =>
        prev.some((m) => m.id === msg.id) ? prev : [...prev, msg],
      );
    },
  });
}
