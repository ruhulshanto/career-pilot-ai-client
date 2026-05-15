export type ChatbotRole = 'user' | 'assistant';

export interface ChatbotMessage {
  id: string;
  role: ChatbotRole;
  content: string;
  timestamp: string; // ISO 8601
  metadata?: {
    tokens?: number;
    provider?: 'GROQ';
    confidence?: number;
    fallback?: boolean;
    reason?: string;
    retryAfterMs?: number;
    structured?: Record<string, any>;
  };
}

export interface ChatbotContext {
  recentMessages: { role: string; content: string }[];
  conversationPhase: string;
  userProfile?: Record<string, any>;
  careerContext?: Record<string, any>;
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

export interface PublicChatMessage {
  id?: string;
  role: ChatbotRole;
  content: string;
  timestamp?: string;
}

export interface PublicChatRequest {
  content: string;
  recentMessages?: Array<Pick<PublicChatMessage, 'role' | 'content'>>;
}

export interface PublicChatResponse {
  id: string;
  role: 'assistant';
  content: string;
  timestamp: string;
  metadata?: ChatbotMessage['metadata'];
}

export interface GetSessionsQuery {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'lastMessageAt';
  sortOrder?: 'asc' | 'desc';
}

