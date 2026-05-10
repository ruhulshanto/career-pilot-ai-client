export type ChatbotRole = 'user' | 'assistant';

export interface ChatbotMessage {
  id: string;
  role: ChatbotRole;
  content: string;
  timestamp: string; // ISO 8601
  metadata?: {
    tokens?: number;
    provider?: 'OPENAI' | 'GEMINI';
  };
}

export interface ChatbotContext {
  recentMessages: { role: string; content: string }[];
  conversationPhase: string;
  userProfile?: Record<string, any>;
}

export interface ChatbotSessionResponse {
  id: string;
  userId: string;
  title?: string;
  messageCount: number;
  lastMessage?: string;
  lastMessageAt?: string;
  context?: ChatbotContext;
  messages: ChatbotMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionRequest {
  title?: string;
  context?: {
    userProfile?: {
      name?: string;
      role?: string;
      level?: string;
    };
  };
}

export interface SendMessageRequest {
  content: string;
  context?: Record<string, any>;
}

export interface GetSessionsQuery {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'lastMessageAt';
  sortOrder?: 'asc' | 'desc';
}

