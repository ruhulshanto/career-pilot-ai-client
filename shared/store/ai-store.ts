import { create } from 'zustand';

type AiState = {
  activeTool: 'resume' | 'roadmap' | 'interview' | 'cover-letter' | 'jobs' | 'chatbot' | null;
  setActiveTool: (tool: AiState['activeTool']) => void;
};

export const useAiStore = create<AiState>((set) => ({
  activeTool: null,
  setActiveTool: (tool) => set({ activeTool: tool })
}));

