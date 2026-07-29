import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import {
  clearTokens,
  initTokens,
  setOnLogout,
  setTokens,
} from '../services/apiClient';
import { AuthResult, AuthUser, RoleSlug, SignupPayload, authApi } from '../services/authApi';
import { tokenStore } from '../services/tokenStore';

type AuthStatus = 'loading' | 'authed' | 'guest';

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  signUp: (payload: SignupPayload) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (idToken: string, role?: RoleSlug) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Derives avatar initials (e.g. "Kojo Mensah" -> "KM"). */
export function initialsOf(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);

  const applyAuth = async (result: AuthResult) => {
    await setTokens({ accessToken: result.accessToken, refreshToken: result.refreshToken });
    setUser(result.user);
    setStatus('authed');
  };

  const signOut = async () => {
    const stored = await tokenStore.load();
    if (stored) {
      // Best-effort server-side revoke; ignore network/auth failures.
      await authApi.logout(stored.refreshToken).catch(() => {});
    }
    await clearTokens();
    setUser(null);
    setStatus('guest');
  };

  // Bootstrap: restore a session from storage, or fall back to guest.
  useEffect(() => {
    let mounted = true;

    // If the token can no longer be refreshed, drop to guest state.
    setOnLogout(() => {
      if (!mounted) return;
      setUser(null);
      setStatus('guest');
    });

    (async () => {
      try {
        const hasTokens = await initTokens();
        if (!hasTokens) {
          if (mounted) setStatus('guest');
          return;
        }
        const me = await authApi.me();
        if (mounted) {
          setUser(me);
          setStatus('authed');
        }
      } catch {
        await clearTokens();
        if (mounted) setStatus('guest');
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      signUp: async (payload) => applyAuth(await authApi.signup(payload)),
      signIn: async (email, password) => applyAuth(await authApi.login(email, password)),
      signInWithGoogle: async (idToken, role) => applyAuth(await authApi.google(idToken, role)),
      signOut,
    }),
    [status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
