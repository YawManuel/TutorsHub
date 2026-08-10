import axios from 'axios';

/** Extracts a human-readable message from an API/axios error. */
export function getApiErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: string; details?: unknown } | undefined;
    if (data?.error) {
      // Surface the first field validation message when present.
      if (data.error === 'ValidationError' && data.details && typeof data.details === 'object') {
        const first = Object.values(data.details as Record<string, string[]>)[0];
        if (Array.isArray(first) && first[0]) return first[0];
      }
      return data.error;
    }
    if (err.code === 'ECONNABORTED') return 'Request timed out. Check your connection.';
    if (!err.response) return 'Cannot reach the server. Check your connection.';
  }
  return fallback;
}
