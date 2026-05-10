import { chatbotApi } from '../api/chatbot';

export interface SSEOptions {
  onMessage: (data: any) => void;
  onOpen?: () => void;
  onError?: (error: any) => void;
  onEnd?: () => void;
}

export const chatbotSSE = {
  connect: (sessionId: string, options: SSEOptions) => {
    const streamUrl = chatbotApi.getStreamUrl(sessionId);
    const eventSource = new EventSource(streamUrl, { withCredentials: true });

    eventSource.onopen = () => {
      options.onOpen?.();
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        options.onMessage(data);
      } catch (err) {
        console.error('[SSE] Parse Error:', err);
      }
    };

    eventSource.onerror = (error) => {
      options.onError?.(error);
    };

    eventSource.addEventListener('end', () => {
      options.onEnd?.();
      eventSource.close();
    });

    return () => {
      eventSource.close();
    };
  }
};
