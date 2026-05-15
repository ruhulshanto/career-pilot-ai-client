'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { useAuthStore } from '@/shared/store/auth-store';
import { useAiStore } from '@/shared/store/ai-store';
import { useUiStore } from '@/shared/store/ui-store';
import { useChatbotStore } from '@/shared/store/use-chatbot-store';
import { createAppQueryClient } from '@/shared/lib/query-client';

const notificationPreferencesStorageKey = 'career-ai-notification-preferences';

function SessionStateReset({ children }: PropsWithChildren) {
  const sessionVersion = useAuthStore((state) => state.sessionVersion);
  const previousSessionVersionRef = useRef(sessionVersion);

  useEffect(() => {
    if (previousSessionVersionRef.current === sessionVersion) return;
    previousSessionVersionRef.current = sessionVersion;

    useChatbotStore.getState().resetSessionState();
    useAiStore.getState().resetSessionState();
    useUiStore.getState().resetSessionState();
    window.localStorage.removeItem(notificationPreferencesStorageKey);
  }, [sessionVersion]);

  return <>{children}</>;
}

export function QueryProvider({ children }: PropsWithChildren) {
  const sessionVersion = useAuthStore((state) => state.sessionVersion);
  const queryClient = useMemo(() => createAppQueryClient(), [sessionVersion]);

  useEffect(() => {
    return () => {
      void queryClient.cancelQueries();
      queryClient.clear();
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionStateReset>{children}</SessionStateReset>
    </QueryClientProvider>
  );
}

