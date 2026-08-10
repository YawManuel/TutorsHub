import { API_BASE_URL } from '../config/env';
import { getAccessToken } from './apiClient';

/**
 * A minimal Server-Sent Events client for React Native. RN has no EventSource
 * and `fetch` doesn't expose a streaming body, but XMLHttpRequest delivers the
 * response incrementally (readyState LOADING) — so we parse the growing text
 * into SSE frames ourselves. No third-party dependency required.
 *
 * Authorization goes in a normal Bearer header (unlike browser EventSource,
 * which can't set headers), reusing the app's access token.
 */

export interface SseHandlers {
  onEvent: (event: string, data: unknown) => void;
  onOpen?: () => void;
  onError?: (err: unknown) => void;
}

/** Open an SSE connection to `path` (relative to the API base). Returns close(). */
export function openSse(path: string, handlers: SseHandlers): () => void {
  const xhr = new XMLHttpRequest();
  let offset = 0; // how much of responseText we've already parsed
  let closed = false;

  const processBuffer = () => {
    const text = xhr.responseText;
    let sep: number;
    // Frames are separated by a blank line ("\n\n").
    while ((sep = text.indexOf('\n\n', offset)) !== -1) {
      const frame = text.slice(offset, sep);
      offset = sep + 2;
      dispatchFrame(frame, handlers);
    }
  };

  xhr.open('GET', `${API_BASE_URL}${path}`);
  const token = getAccessToken();
  if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
  xhr.setRequestHeader('Accept', 'text/event-stream');

  xhr.onreadystatechange = () => {
    if (closed) return;
    // HEADERS_RECEIVED → the stream is live.
    if (xhr.readyState === xhr.HEADERS_RECEIVED && xhr.status === 200) handlers.onOpen?.();
    // LOADING / DONE → parse whatever new text has arrived.
    if (xhr.readyState === xhr.LOADING || xhr.readyState === xhr.DONE) {
      if (xhr.status && xhr.status !== 200) {
        handlers.onError?.(new Error(`SSE status ${xhr.status}`));
        return;
      }
      processBuffer();
    }
  };
  xhr.onerror = () => {
    if (!closed) handlers.onError?.(new Error('SSE connection error'));
  };

  xhr.send();

  return () => {
    closed = true;
    try {
      xhr.abort();
    } catch {
      /* noop */
    }
  };
}

function dispatchFrame(frame: string, handlers: SseHandlers) {
  let event = 'message';
  let data = '';
  for (const line of frame.split('\n')) {
    if (line.startsWith(':')) return; // heartbeat comment
    if (line.startsWith('event:')) event = line.slice(6).trim();
    else if (line.startsWith('data:')) data += line.slice(5).trim();
  }
  if (!data) return;
  try {
    handlers.onEvent(event, JSON.parse(data));
  } catch {
    /* ignore malformed frame */
  }
}
