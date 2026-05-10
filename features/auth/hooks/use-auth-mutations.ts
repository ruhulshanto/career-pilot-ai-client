import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/services/auth/auth-api';
import type { LoginSchema, SignupSchema } from '../schemas/auth-schema';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginSchema) => authApi.login(data),
  });
};

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: (data: SignupSchema) => authApi.register(data),
  });
};



