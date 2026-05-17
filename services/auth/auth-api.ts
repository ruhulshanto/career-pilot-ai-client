import { apiClient } from '../api/client';
import type { LoginSchema } from '@/features/auth/schemas/auth-schema';

export type AuthUser = {
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  username?: string;
  avatarUrl?: string | null;
  emailVerifiedAt?: string | null;
  isDemo?: boolean;
  role: 'USER' | 'ADMIN' | 'MENTOR';
};

export type AuthResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: AuthUser;
  };
};

export const authApi = {
  login: async (data: LoginSchema): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  demoLogin: async (role: 'USER' | 'ADMIN' | 'MENTOR'): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/demo-login', { role });
    return response.data;
  },
  
  register: async (data: any): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  refresh: async (): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },
  
  logout: async () => {
    await apiClient.post('/auth/logout');
  },

  me: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await apiClient.post('/auth/verify-email', { token });
    return response.data;
  },

  resendVerification: async () => {
    const response = await apiClient.post('/auth/resend-verification');
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      password,
    });
    return response.data;
  },

  sessions: async () => {
    const response = await apiClient.get('/auth/sessions');
    return response.data;
  },

  revokeSession: async (sessionId: string) => {
    const response = await apiClient.delete(`/auth/sessions/${sessionId}`);
    return response.data;
  },

  revokeOtherSessions: async () => {
    const response = await apiClient.post('/auth/sessions/revoke-others');
    return response.data;
  },
};

