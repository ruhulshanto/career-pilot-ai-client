import { create } from 'zustand';
import { chatbotApi } from '@/services/api/chatbot';
import type { ChatbotMessage, ChatbotSessionResponse } from '@/shared/types/chatbot';

interface ChatbotState {
  sessions: ChatbotSessionResponse[];
  activeSessionId: string | null;
  messages: Record<string, ChatbotMessage[]>; // sessionId -> messages
  isStreaming: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setSessions: (sessions: ChatbotSessionResponse[]) => void;
  setActiveSession: (sessionId: string | null) => void;
  fetchSessions: () => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  loadMoreMessages: (sessionId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  
  // Real-time / Streaming Actions
  addMessage: (sessionId: string, message: ChatbotMessage) => void;
  updateStreamingMessage: (sessionId: string, messageId: string, content: string, isFullContent?: boolean) => void;
  setStreaming: (status: boolean) => void;
}

export const useChatbotStore = create<ChatbotState>((set, get) => ({
  sessions: [],
  activeSessionId: null,
  messages: {},
  isStreaming: false,
  isLoading: false,
  error: null,

  setSessions: (sessions) => set({ sessions }),

  setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),

  fetchSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await chatbotApi.getSessions();
      set({ sessions: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  loadSession: async (sessionId) => {
    set({ activeSessionId: sessionId, isLoading: true, error: null });
    try {
      const session = await chatbotApi.getSession(sessionId);
      set((state) => ({
        messages: {
          ...state.messages,
          [sessionId]: session.messages
        },
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addMessage: (sessionId, message) => {
    set((state) => {
      const sessionMessages = state.messages[sessionId] || [];
      // Prevent duplicates
      if (sessionMessages.some(m => m.id === message.id)) return state;
      
      return {
        messages: {
          ...state.messages,
          [sessionId]: [...sessionMessages, message]
        }
      };
    });
  },

  updateStreamingMessage: (sessionId, messageId, content, isFullContent = false) => {
    set((state) => {
      const sessionMessages = [...(state.messages[sessionId] || [])];
      const messageIndex = sessionMessages.findIndex(m => m.id === messageId);

      if (messageIndex !== -1) {
        // Update existing message content
        sessionMessages[messageIndex] = {
          ...sessionMessages[messageIndex],
          content: isFullContent ? content : sessionMessages[messageIndex].content + content
        };
      } else {
        // Create new assistant message
        sessionMessages.push({
          id: messageId,
          role: 'assistant',
          content: content,
          timestamp: new Date().toISOString()
        });
      }

      return {
        messages: {
          ...state.messages,
          [sessionId]: sessionMessages
        }
      };
    });
  },

  setStreaming: (status) => set({ isStreaming: status }),

  loadMoreMessages: async (sessionId) => {
    const { messages } = get();
    const sessionMessages = messages[sessionId] || [];
    const page = Math.floor(sessionMessages.length / 20) + 1;

    try {
      const response = await chatbotApi.getMessages(sessionId, page, 20);
      
      set((state) => ({
        messages: {
          ...state.messages,
          [sessionId]: [...response.data, ...sessionMessages]
        }
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },
  
  sendMessage: async (content) => {
    const { activeSessionId, addMessage } = get();
    if (!activeSessionId) return;

    // 1. Optimistic Update (User Message)
    const tempId = `temp_${Date.now()}`;
    const userMessage: ChatbotMessage = {
      id: tempId,
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    
    addMessage(activeSessionId, userMessage);

    try {
      // 2. Send to API
      const response = await chatbotApi.sendMessage(activeSessionId, { content });
      
      // 3. Replace temp ID with real ID from server to maintain consistency
      set((state) => {
        const sessionMessages = [...(state.messages[activeSessionId] || [])];
        const msgIndex = sessionMessages.findIndex(m => m.id === tempId);
        if (msgIndex !== -1) {
          sessionMessages[msgIndex] = {
            ...sessionMessages[msgIndex],
            id: response.messageId
          };
        }
        return {
          messages: {
            ...state.messages,
            [activeSessionId]: sessionMessages
          }
        };
      });
    } catch (err: any) {
      set({ error: err.message });
      // Rollback: Remove the failed message
      set((state) => ({
        messages: {
          ...state.messages,
          [activeSessionId]: (state.messages[activeSessionId] || []).filter(m => m.id !== tempId)
        }
      }));
    }
  }
}));

