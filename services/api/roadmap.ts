import { apiClient } from './client';

export const roadmapApi = {
  generate: async () => {
    const { data } = await apiClient.post('/roadmap/generate');
    return data.data;
  },
  
  getLatest: async () => {
    const { data } = await apiClient.get('/roadmap/latest');
    return data.data;
  }
};
