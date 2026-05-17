import { apiClient } from './client';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const supportApi = {
  async sendContactMessage(data: ContactFormData) {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      '/support/contact',
      data
    );
    return response.data;
  },
};
