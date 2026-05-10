import { apiClient } from './client';

export const interviewApi = {
  startSession: async (payload: { role: string; difficulty: string }) => {
    const { data } = await apiClient.post('/interview/sessions', payload);
    return data.data;
  },
  
  submitAnswer: async (sessionId: string, answer: string) => {
    const { data } = await apiClient.post(`/interview/sessions/${sessionId}/answers`, { answer });
    return data.data;
  },
  
  getHistory: async () => {
    const { data } = await apiClient.get('/interview/history');
    return data.data;
  }
};
