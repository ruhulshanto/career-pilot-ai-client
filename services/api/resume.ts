import { apiClient } from './client';

export const resumeApi = {
  analyze: async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    
    const { data } = await apiClient.post('/resume/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  },
  
  getHistory: async () => {
    const { data } = await apiClient.get('/resume/history');
    return data.data;
  }
};
