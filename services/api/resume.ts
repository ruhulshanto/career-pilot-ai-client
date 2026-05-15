import { apiClient } from './client';

export type ProcessingStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type ResumeAiFeedback = {
  id: string;
  type: string;
  provider: string;
  status: ProcessingStatus;
  score?: number;
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
  rawResponse?: {
    atsScore?: number;
    roleFitScore?: number;
    inferredTargetRole?: string;
    experienceLevel?: string;
    summary?: string;
    strengths?: string[];
    weaknesses?: string[];
    missingSkills?: string[];
    improvementSuggestions?: string[];
    keywordGaps?: string[];
    recommendedNextActions?: string[];
  };
  errorMessage?: string;
  createdAt: string;
};

export type ResumeRecord = {
  id: string;
  userId: string;
  title: string;
  fileUrl?: string;
  fileType: string;
  fileSize?: number;
  status: ProcessingStatus;
  parsedText?: string;
  createdAt: string;
  updatedAt: string;
  latestFeedback?: {
    id: string;
    status: ProcessingStatus;
    score?: number;
    summary?: string;
    createdAt: string;
  };
};

export type ResumeWithFeedback = ResumeRecord & {
  aiFeedbacks: ResumeAiFeedback[];
};

export type ResumeHistoryResponse = {
  data: ResumeRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export const resumeApi = {
  analyze: async (file: File): Promise<ResumeRecord> => {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('title', file.name.replace(/\.[^.]+$/, ''));
    
    const { data } = await apiClient.post('/resume/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  },

  getById: async (id: string): Promise<ResumeWithFeedback> => {
    const { data } = await apiClient.get(`/resume/${id}`);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/resume/${id}`);
  },
  
  getHistory: async (): Promise<ResumeHistoryResponse> => {
    const { data } = await apiClient.get('/resume');
    return data.data;
  }
};
