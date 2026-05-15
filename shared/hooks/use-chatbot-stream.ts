"use client";

import { useEffect, useCallback, useRef } from "react";
import { useChatbotStore } from "@/shared/store/use-chatbot-store";
import { chatbotSSE } from "@/services/sse/chatbot-sse";

export const useChatbotStream = (sessionId: string | null) => {
  const { updateStreamingMessage, setStreaming, loadSession } =
    useChatbotStore();
  const sessionStateVersion = useChatbotStore(
    (state) => state.sessionStateVersion,
  );
  const retryCountRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const MAX_RETRIES = 5;

  const connect = useCallback(() => {
    if (!sessionId) return;

    cleanupRef.current?.();
    const connectedSessionStateVersion =
      useChatbotStore.getState().sessionStateVersion;
    const cleanup = chatbotSSE.connect(sessionId, {
      onOpen: () => {
        retryCountRef.current = 0;
        if (reconnectTimerRef.current) {
          clearTimeout(reconnectTimerRef.current);
          reconnectTimerRef.current = null;
        }
      },
      onMessage: (data) => {
        if (
          useChatbotStore.getState().sessionStateVersion !==
          connectedSessionStateVersion
        ) {
          return;
        }
        if (data.id && data.content) {
          updateStreamingMessage(
            sessionId,
            data.id,
            data.content,
            true,
            data.metadata,
          );
          setStreaming(false);
        }
      },
      onDone: () => {
        if (
          useChatbotStore.getState().sessionStateVersion !==
          connectedSessionStateVersion
        ) {
          return;
        }
        setStreaming(false);
        void loadSession(sessionId);
      },
      onEnd: () => {
        if (
          useChatbotStore.getState().sessionStateVersion !==
          connectedSessionStateVersion
        ) {
          return;
        }
        setStreaming(false);
        void loadSession(sessionId);
      },
      onError: () => {
        if (
          useChatbotStore.getState().sessionStateVersion !==
          connectedSessionStateVersion
        ) {
          return;
        }
        setStreaming(false);
        if (retryCountRef.current < MAX_RETRIES && !reconnectTimerRef.current) {
          const delay =
            Math.pow(2, retryCountRef.current) * 1000 + Math.random() * 1000;
          reconnectTimerRef.current = setTimeout(() => {
            reconnectTimerRef.current = null;
            retryCountRef.current += 1;
            connect();
          }, delay);
        }
      },
    });

    cleanupRef.current = cleanup;
    return cleanup;
  }, [sessionId, sessionStateVersion, updateStreamingMessage, setStreaming, loadSession]);

  useEffect(() => {
    const cleanup = connect();
    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      if (cleanup) cleanup();
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [connect]);
};
