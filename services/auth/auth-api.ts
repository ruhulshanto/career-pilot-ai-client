import { apiClient } from '../api/client';
import type { LoginSchema } from '@/features/auth/schemas/auth-schema';

export const authApi = {
  login: async (data: LoginSchema) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },
  
  register: async (data: any) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },
  
  logout: async () => {
    await apiClient.post('/auth/logout');
  }
};

