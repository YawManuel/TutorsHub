import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../config/env';
import { StoredTokens, tokenStore } from './tokenStore';

/**
 * The shared axios instance for all API calls. Responsibilities:
 *  - attach the access token to every request
 *  - on a 401, transparently refresh the access token (single-flight) and retry
 *  - on refresh failure, clear tokens and notify the app to sign out
 *
 * Tokens are held in memory for speed and mirrored to secure storage.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

let accessToken: string | null = null;
let refreshToken: string | null = null;
let onLogout: (() => void) | null = null;

/** Register a callback fired when the session can no longer be refreshed. */
export function setOnLogout(cb: () => void) {
  onLogout = cb;
}

export function getAccessToken() {
  return accessToken;
}

/** Seed in-memory tokens from secure storage (call once at startup). */
export async function initTokens(): Promise<boolean> {
  const stored = await tokenStore.load();
  if (!stored) return false;
  accessToken = stored.accessToken;
  refreshToken = stored.refreshToken;
  return true;
}

export async function setTokens(tokens: StoredTokens) {
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken;
  await tokenStore.save(tokens);
}

export async function clearTokens() {
  accessToken = null;
  refreshToken = null;
  await tokenStore.clear();
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// --- Single-flight refresh so concurrent 401s trigger only one refresh call ---
let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshToken) return null;
  try {
    // Bare axios (not `api`) to avoid the interceptor recursing.
    const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
    const tokens: StoredTokens = res.data;
    await setTokens(tokens);
    return tokens.accessToken;
  } catch {
    await clearTokens();
    onLogout?.();
    return null;
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (AxiosRequestConfig & { _retried?: boolean }) | undefined;
    const status = error.response?.status;

    if (status === 401 && original && !original._retried && refreshToken) {
      original._retried = true;
      refreshing = refreshing ?? refreshAccessToken();
      const newToken = await refreshing;
      refreshing = null;

      if (newToken) {
        original.headers = { ...original.headers, Authorization: `Bearer ${newToken}` };
        return api(original);
      }
    }

    return Promise.reject(error);
  },
);
