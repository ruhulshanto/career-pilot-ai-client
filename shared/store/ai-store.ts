import { create } from 'zustand';

type AiState = {
  activeTool: 'resume' | 'roadmap' | 'interview' | 'cover-letter' | 'jobs' | 'chatbot' | null;
  setActiveTool: (tool: AiState['activeTool']) => void;
  resetSessionState: () => void;
};

export const useAiStore = create<AiState>((set) => ({
  activeTool: null,
  setActiveTool: (tool) => set({ activeTool: tool }),
  resetSessionState: () => set({ activeTool: null })
}));

