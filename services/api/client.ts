import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/shared/store/auth-store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

const MAX_RETRIES = 2;
const retryMap = new Map<string, number>();
let refreshPromise: Promise<string | null> | null = null;
const AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/demo-login',
  '/auth/register',
  '/auth/refresh',
  '/auth/logout',
];

const normalizeUser = (user: any) => ({
  id: user?.id,
  name:
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.firstName ||
    'User',
  email: user?.email,
});

export const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post('/auth/refresh', undefined, { headers: { Authorization: undefined } })
      .then((response) => {
        const payload = response.data?.data;
        if (!payload?.accessToken || !payload?.user) return null;

        useAuthStore.getState().setSession({
          accessToken: payload.accessToken,
          role: payload.user.role,
          user: normalizeUser(payload.user),
        });

        return payload.accessToken as string;
      })
      .catch(() => {
        useAuthStore.getState().clearSession();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    if (response.config.url) retryMap.delete(response.config.url);
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config;
    const requestConfig = config as
      | (InternalAxiosRequestConfig & { _authRetry?: boolean })
      | undefined;
    const isAuthEndpoint = requestConfig?.url
      ? AUTH_ENDPOINTS.includes(requestConfig.url)
      : false;

    if (
      requestConfig &&
      error.response?.status === 401 &&
      !requestConfig._authRetry &&
      !isAuthEndpoint
    ) {
      requestConfig._authRetry = true;
      const token = await refreshAccessToken();
      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
        return apiClient(requestConfig);
      }
      useAuthStore.getState().clearSession();
    }

    if (config && config.url && error.code === 'ECONNABORTED') {
      const retryCount = retryMap.get(config.url) || 0;
      if (retryCount < MAX_RETRIES) {
        retryMap.set(config.url, retryCount + 1);
        return apiClient(config);
      }
    }

    const payload = error.response?.data as any;
    const isSessionExpired = error.response?.status === 401 && !isAuthEndpoint;
    const normalizedError = {
      message: isSessionExpired
        ? 'Your session has expired. Please sign in again.'
        : payload?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status,
      details: payload?.details || payload?.error?.details,
      code: isSessionExpired
        ? 'SESSION_EXPIRED'
        : payload?.code || payload?.error?.code,
    };
    return Promise.reject(normalizedError);
  }
);

