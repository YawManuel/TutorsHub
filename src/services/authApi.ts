import { api } from './apiClient';
import { StoredTokens } from './tokenStore';

/** Backend role slugs. */
export type RoleSlug = 'student' | 'hub_tutor' | 'help_tutor';

/** The authenticated user profile returned by the API. */
export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: RoleSlug;
  avatarUrl: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthResult extends StoredTokens {
  user: AuthUser;
}

export interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
  role: RoleSlug;
  acceptTerms: true;
}

export const authApi = {
  async signup(payload: SignupPayload): Promise<AuthResult> {
    const { data } = await api.post<AuthResult>('/auth/signup', payload);
    return data;
  },

  async login(email: string, password: string): Promise<AuthResult> {
    const { data } = await api.post<AuthResult>('/auth/login', { email, password });
    return data;
  },

  async google(idToken: string, role?: RoleSlug): Promise<AuthResult> {
    const { data } = await api.post<AuthResult>('/auth/google', { idToken, role });
    return data;
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post('/auth/logout', { refreshToken });
  },

  async me(): Promise<AuthUser> {
    const { data } = await api.get<AuthUser>('/auth/me');
    return data;
  },
};
