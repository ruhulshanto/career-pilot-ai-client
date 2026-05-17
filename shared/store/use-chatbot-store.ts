import { create } from "zustand";
import { chatbotApi } from "@/services/api/chatbot";
import type {
  ChatbotMessage,
  ChatbotSessionResponse,
} from "@/shared/types/chatbot";

const formatRetryAfter = (retryAfterMs?: number) => {
  if (!retryAfterMs || retryAfterMs <= 0) return "a short cooldown";
  const seconds = Math.ceil(retryAfterMs / 1000);
  if (seconds < 60) return `${seconds} second${seconds === 1 ? "" : "s"}`;
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
};

const getFriendlyChatbotError = (err: any) => {
  const code = err?.code;
  const retryAfterMs = err?.details?.retryAfterMs;

  if (code === "SESSION_EXPIRED") {
    return "Your session has expired. Please sign in again.";
  }

  if (
    ["SERVICE_UNAVAILABLE", "QUOTA_EXCEEDED", "RATE_LIMIT", "TIMEOUT"].includes(
      code,
    )
  ) {
    return `The AI service is currently experiencing high demand. Please wait ${formatRetryAfter(
      retryAfterMs,
    )} before retrying.`;
  }

  return (
    err?.message || "Unable to send your message right now. Please try again."
  );
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const PINNED_CHATBOT_SESSIONS_KEY = "career-ai:pinned-chatbot-sessions";

const readPinnedSessionIds = () => {
  if (typeof window === "undefined") return [];

  try {
    const rawValue = window.localStorage.getItem(PINNED_CHATBOT_SESSIONS_KEY);
    if (!rawValue) return [];
    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue)
      ? parsedValue.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
};

const writePinnedSessionIds = (sessionIds: string[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    PINNED_CHATBOT_SESSIONS_KEY,
    JSON.stringify(sessionIds),
  );
};

const hasAssistantReplyAfterUserMessage = (
  messages: ChatbotMessage[],
  userMessageId: string,
  startedAt: number,
) => {
  const userMessageIndex = messages.findIndex(
    (message) => message.id === userMessageId,
  );
  if (userMessageIndex !== -1) {
    return messages
      .slice(userMessageIndex + 1)
      .some((message) => message.role === "assistant");
  }

  return messages.some(
    (message) =>
      message.role === "assistant" &&
      new Date(message.timestamp).getTime() >= startedAt,
  );
};

interface ChatbotState {
  sessions: ChatbotSessionResponse[];
  pinnedSessionIds: string[];
  activeSessionId: string | null;
  messages: Record<string, ChatbotMessage[]>; // sessionId -> messages
  isStreaming: boolean;
  isLoading: boolean;
  error: string | null;
  errorCode: string | null;
  sessionStateVersion: number;

  // Actions
  setSessions: (sessions: ChatbotSessionResponse[]) => void;
  setActiveSession: (sessionId: string | null) => void;
  hydratePinnedSessions: () => void;
  togglePinSession: (sessionId: string) => void;
  fetchSessions: () => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  loadMoreMessages: (sessionId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  renameSession: (sessionId: string, title: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  resetSessionState: () => void;

  // Real-time / Streaming Actions
  addMessage: (sessionId: string, message: ChatbotMessage) => void;
  updateStreamingMessage: (
    sessionId: string,
    messageId: string,
    content: string,
    isFullContent?: boolean,
    metadata?: ChatbotMessage["metadata"],
  ) => void;
  setStreaming: (status: boolean) => void;
}

export const useChatbotStore = create<ChatbotState>((set, get) => ({
  sessions: [],
  pinnedSessionIds: [],
  activeSessionId: null,
  messages: {},
  isStreaming: false,
  isLoading: false,
  error: null,
  errorCode: null,
  sessionStateVersion: 0,

  setSessions: (sessions) => set({ sessions }),

  setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),

  hydratePinnedSessions: () => {
    set({ pinnedSessionIds: readPinnedSessionIds() });
  },

  togglePinSession: (sessionId) => {
    const { pinnedSessionIds } = get();
    const isAlreadyPinned = pinnedSessionIds.includes(sessionId);

    if (!isAlreadyPinned && pinnedSessionIds.length >= 3) {
      throw new Error("MAX_PINS_REACHED");
    }

    const nextPinnedSessionIds = isAlreadyPinned
      ? pinnedSessionIds.filter((id) => id !== sessionId)
      : [sessionId, ...pinnedSessionIds];

    writePinnedSessionIds(nextPinnedSessionIds);
    set({ pinnedSessionIds: nextPinnedSessionIds });
  },

  fetchSessions: async () => {
    const sessionStateVersion = get().sessionStateVersion;
    set({ isLoading: true, error: null, errorCode: null });
    try {
      const { data } = await chatbotApi.getSessions();
      if (get().sessionStateVersion !== sessionStateVersion) return;
      set({ sessions: data, isLoading: false });
    } catch (err: any) {
      if (get().sessionStateVersion !== sessionStateVersion) return;
      set({
        error: getFriendlyChatbotError(err),
        errorCode: err.code ?? null,
        isLoading: false,
      });
    }
  },

  loadSession: async (sessionId) => {
    const sessionStateVersion = get().sessionStateVersion;
    set({
      activeSessionId: sessionId,
      isLoading: true,
      error: null,
      errorCode: null,
    });
    try {
      const session = await chatbotApi.getSession(sessionId);
      if (get().sessionStateVersion !== sessionStateVersion) return;
      set((state) => ({
        messages: {
          ...state.messages,
          [sessionId]: session.messages,
        },
        isLoading: false,
      }));
    } catch (err: any) {
      if (get().sessionStateVersion !== sessionStateVersion) return;
      set({
        error: getFriendlyChatbotError(err),
        errorCode: err.code ?? null,
        isLoading: false,
      });
    }
  },

  addMessage: (sessionId, message) => {
    set((state) => {
      const sessionMessages = state.messages[sessionId] || [];
      // Prevent duplicates
      if (sessionMessages.some((m) => m.id === message.id)) return state;

      return {
        messages: {
          ...state.messages,
          [sessionId]: [...sessionMessages, message],
        },
      };
    });
  },

  updateStreamingMessage: (
    sessionId,
    messageId,
    content,
    isFullContent = false,
    metadata,
  ) => {
    set((state) => {
      if (state.activeSessionId !== sessionId) return state;

      const sessionMessages = [...(state.messages[sessionId] || [])];
      const messageIndex = sessionMessages.findIndex((m) => m.id === messageId);

      if (messageIndex !== -1) {
        // Update existing message content
        sessionMessages[messageIndex] = {
          ...sessionMessages[messageIndex],
          content: isFullContent
            ? content
            : sessionMessages[messageIndex].content + content,
          metadata: metadata || sessionMessages[messageIndex].metadata,
        };
      } else {
        // Create new assistant message
        sessionMessages.push({
          id: messageId,
          role: "assistant",
          content: content,
          timestamp: new Date().toISOString(),
          metadata,
        });
      }

      return {
        messages: {
          ...state.messages,
          [sessionId]: sessionMessages,
        },
      };
    });
  },

  setStreaming: (status) => set({ isStreaming: status }),

  loadMoreMessages: async (sessionId) => {
    const sessionStateVersion = get().sessionStateVersion;
    const { messages } = get();
    const sessionMessages = messages[sessionId] || [];
    const page = Math.floor(sessionMessages.length / 20) + 1;

    try {
      const response = await chatbotApi.getMessages(sessionId, page, 20);

      if (get().sessionStateVersion !== sessionStateVersion) return;
      set((state) => ({
        messages: {
          ...state.messages,
          [sessionId]: [...response.data, ...sessionMessages],
        },
      }));
    } catch (err: any) {
      if (get().sessionStateVersion !== sessionStateVersion) return;
      set({ error: getFriendlyChatbotError(err), errorCode: err.code ?? null });
    }
  },

  renameSession: async (sessionId, title) => {
    const sessionStateVersion = get().sessionStateVersion;
    const previousSessions = get().sessions;
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              title: trimmedTitle,
              updatedAt: new Date().toISOString(),
            }
          : session,
      ),
      error: null,
      errorCode: null,
    }));

    try {
      const updatedSession = await chatbotApi.updateSession(sessionId, {
        title: trimmedTitle,
      });

      if (get().sessionStateVersion !== sessionStateVersion) return;
      set((state) => ({
        sessions: state.sessions.map((session) =>
          session.id === sessionId ? updatedSession : session,
        ),
      }));
    } catch (err) {
      if (get().sessionStateVersion !== sessionStateVersion) return;
      set({
        sessions: previousSessions,
        error: getFriendlyChatbotError(err),
        errorCode: (err as any)?.code ?? null,
      });
      throw err;
    }
  },

  deleteSession: async (sessionId) => {
    const sessionStateVersion = get().sessionStateVersion;
    const previousState = get();
    const { [sessionId]: _deletedMessages, ...remainingMessages } =
      previousState.messages;
    const remainingSessions = previousState.sessions.filter(
      (session) => session.id !== sessionId,
    );
    const remainingPinnedSessionIds = previousState.pinnedSessionIds.filter(
      (id) => id !== sessionId,
    );
    const deletingActiveSession = previousState.activeSessionId === sessionId;

    writePinnedSessionIds(remainingPinnedSessionIds);
    set({
      sessions: remainingSessions,
      pinnedSessionIds: remainingPinnedSessionIds,
      messages: remainingMessages,
      activeSessionId: deletingActiveSession
        ? null
        : previousState.activeSessionId,
      isStreaming: deletingActiveSession ? false : previousState.isStreaming,
      error: null,
      errorCode: null,
    });

    try {
      await chatbotApi.deleteSession(sessionId);
    } catch (err) {
      if (get().sessionStateVersion !== sessionStateVersion) return;
      writePinnedSessionIds(previousState.pinnedSessionIds);
      set({
        sessions: previousState.sessions,
        pinnedSessionIds: previousState.pinnedSessionIds,
        messages: previousState.messages,
        activeSessionId: previousState.activeSessionId,
        isStreaming: previousState.isStreaming,
        error: getFriendlyChatbotError(err),
        errorCode: (err as any)?.code ?? null,
      });
      throw err;
    }
  },

  resetSessionState: () => {
    writePinnedSessionIds([]);
    set((state) => ({
      sessions: [],
      pinnedSessionIds: [],
      activeSessionId: null,
      messages: {},
      isStreaming: false,
      isLoading: false,
      error: null,
      errorCode: null,
      sessionStateVersion: state.sessionStateVersion + 1,
    }));
  },

  sendMessage: async (content) => {
    const { activeSessionId, addMessage } = get();
    if (!activeSessionId) return;
    const sessionStateVersion = get().sessionStateVersion;

    // 1. Optimistic Update (User Message)
    const startedAt = Date.now();
    const tempId = `temp_${Date.now()}`;
    const userMessage: ChatbotMessage = {
      id: tempId,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    set({ isStreaming: true, error: null, errorCode: null });
    addMessage(activeSessionId, userMessage);

    try {
      // 2. Send to API
      const response = await chatbotApi.sendMessage(activeSessionId, {
        content,
      });
      if (get().sessionStateVersion !== sessionStateVersion) return;

      // 3. Replace temp ID with real ID from server to maintain consistency
      set((state) => {
        const sessionMessages = [...(state.messages[activeSessionId] || [])];
        const msgIndex = sessionMessages.findIndex((m) => m.id === tempId);
        if (msgIndex !== -1) {
          sessionMessages[msgIndex] = {
            ...sessionMessages[msgIndex],
            id: response.messageId,
          };
        }
        return {
          messages: {
            ...state.messages,
            [activeSessionId]: sessionMessages,
          },
        };
      });

      void (async () => {
        const maxAttempts = 30;
        for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
          await sleep(2000);
          if (get().sessionStateVersion !== sessionStateVersion) return;
          if (!get().isStreaming) return;

          try {
            const session = await chatbotApi.getSession(activeSessionId);
            if (get().sessionStateVersion !== sessionStateVersion) return;
            set((state) => ({
              sessions: state.sessions.map((item) =>
                item.id === session.id ? session : item,
              ),
              messages: {
                ...state.messages,
                [activeSessionId]: session.messages,
              },
            }));

            if (
              hasAssistantReplyAfterUserMessage(
                session.messages,
                response.messageId,
                startedAt,
              )
            ) {
              set({ isStreaming: false });
              return;
            }
          } catch {
            // SSE is still the primary path; the watchdog only fills missed completions.
          }
        }

        if (get().isStreaming) {
          if (get().sessionStateVersion !== sessionStateVersion) return;
          set({
            isStreaming: false,
            error:
              "The AI response is taking longer than expected. Refresh the chat or try again in a moment.",
            errorCode: "CHATBOT_STREAM_TIMEOUT",
          });
        }
      })();
    } catch (err: any) {
      if (get().sessionStateVersion !== sessionStateVersion) return;
      set({
        error: getFriendlyChatbotError(err),
        errorCode: err.code ?? null,
        isStreaming: false,
      });
      // Rollback: Remove the failed message
      set((state) => ({
        messages: {
          ...state.messages,
          [activeSessionId]: (state.messages[activeSessionId] || []).filter(
            (m) => m.id !== tempId,
          ),
        },
      }));
    }
  },
}));
