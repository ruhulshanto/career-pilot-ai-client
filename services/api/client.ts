import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

import { useAuthStore } from '@/shared/store/auth-store';

const MAX_RETRIES = 2;
const retryMap = new Map<string, number>();

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
    if (config && config.url && (error.code === 'ECONNABORTED' || error.response?.status === 503)) {
      const retryCount = retryMap.get(config.url) || 0;
      if (retryCount < MAX_RETRIES) {
        retryMap.set(config.url, retryCount + 1);
        return apiClient(config);
      }
    }

    const normalizedError = {
      message: (error.response?.data as any)?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status,
    };
    return Promise.reject(normalizedError);
  }
);

