'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useChatbotStore } from '@/shared/store/use-chatbot-store';
import { chatbotSSE } from '@/services/sse/chatbot-sse';

export const useChatbotStream = (sessionId: string | null) => {
  const { updateStreamingMessage, setStreaming } = useChatbotStore();
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 5;

  const connect = useCallback(() => {
    if (!sessionId) return;

    const cleanup = chatbotSSE.connect(sessionId, {
      onOpen: () => {
        setStreaming(true);
        retryCountRef.current = 0;
      },
      onMessage: (data) => {
        if (data.id && data.content) {
          updateStreamingMessage(sessionId, data.id, data.content, true);
        }
      },
      onEnd: () => {
        setStreaming(false);
      },
      onError: () => {
        setStreaming(false);
        if (retryCountRef.current < MAX_RETRIES) {
          const delay = Math.pow(2, retryCountRef.current) * 1000 + Math.random() * 1000;
          setTimeout(() => {
            retryCountRef.current += 1;
            connect();
          }, delay);
        }
      }
    });

    return cleanup;
  }, [sessionId, updateStreamingMessage, setStreaming]);

  useEffect(() => {
    const cleanup = connect();
    return () => {
      if (cleanup) cleanup();
    };
  }, [connect]);
};
