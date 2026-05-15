import { apiClient } from "./client";
import type {
  ChatbotSessionResponse,
  ChatbotMessage,
  CreateSessionRequest,
  SendMessageRequest,
  GetSessionsQuery,
  PublicChatRequest,
  PublicChatResponse,
} from "@/shared/types/chatbot";

export const chatbotApi = {
  async sendPublicMessage(
    payload: PublicChatRequest,
  ): Promise<PublicChatResponse> {
    const { data } = await apiClient.post<{
      success: boolean;
      data: PublicChatResponse;
    }>("/chatbot/public-message", payload, { timeout: 30000 });
    return data.data;
  },

  async createSession(
    payload: CreateSessionRequest,
  ): Promise<ChatbotSessionResponse> {
    const { data } = await apiClient.post<{
      success: boolean;
      data: ChatbotSessionResponse;
    }>("/chatbot/sessions", payload);
    return data.data;
  },

  async getSessions(
    query: GetSessionsQuery = {},
  ): Promise<{ data: ChatbotSessionResponse[]; pagination: any }> {
    const { data } = await apiClient.get("/chatbot/sessions", {
      params: query,
    });
    return data;
  },

  async getSession(sessionId: string): Promise<ChatbotSessionResponse> {
    const { data } = await apiClient.get<{
      success: boolean;
      data: ChatbotSessionResponse;
    }>(`/chatbot/sessions/${sessionId}`);
    return data.data;
  },

  async getMessages(
    sessionId: string,
    page = 1,
    limit = 20,
  ): Promise<{ data: ChatbotMessage[]; pagination: any }> {
    const { data } = await apiClient.get(
      `/chatbot/sessions/${sessionId}/messages`,
      {
        params: { page, limit },
      },
    );
    return data;
  },

  async sendMessage(
    sessionId: string,
    payload: SendMessageRequest,
  ): Promise<{ sessionId: string; messageId: string; content: string }> {
    const { data } = await apiClient.post<{
      success: boolean;
      data: { sessionId: string; messageId: string; content: string };
    }>(`/chatbot/sessions/${sessionId}/messages`, payload);
    return data.data;
  },

  async updateSession(
    sessionId: string,
    payload: Pick<ChatbotSessionResponse, "title">,
  ): Promise<ChatbotSessionResponse> {
    const { data } = await apiClient.patch<{
      success: boolean;
      data: ChatbotSessionResponse;
    }>(`/chatbot/sessions/${sessionId}`, payload);
    return data.data;
  },

  async deleteSession(sessionId: string): Promise<void> {
    await apiClient.delete(`/chatbot/sessions/${sessionId}`);
  },

  getStreamUrl(sessionId: string): string {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    return `${baseUrl}/chatbot/sessions/${sessionId}/stream`;
  },
};
