import { create } from 'zustand';

type SerializableContext = {
  routePath: string;
  workspaceRole: string | null;
  pageMetadata: {
    title?: string;
    description?: string;
  };
  selectedEntityId?: string | null;
};

type AiContextState = {
  context: SerializableContext;
  updateContext: (partial: Partial<SerializableContext>) => void;
  clearContext: () => void;
};

export const useAiContextStore = create<AiContextState>((set) => ({
  context: {
    routePath: "",
    workspaceRole: null,
    pageMetadata: {},
    selectedEntityId: null,
  },
  updateContext: (partial) => 
    set((state) => ({ 
      context: { ...state.context, ...partial } 
    })),
  clearContext: () => 
    set({ 
      context: { routePath: "", workspaceRole: null, pageMetadata: {}, selectedEntityId: null } 
    }),
}));
