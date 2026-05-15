'use client';

import type { PropsWithChildren } from 'react';

import { AuthSessionHydrator } from '@/shared/providers/auth-session-hydrator';
import { QueryProvider } from '@/shared/providers/query-provider';
import { ThemeProvider } from '@/shared/providers/theme-provider';

export function AppProvider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthSessionHydrator>{children}</AuthSessionHydrator>
      </QueryProvider>
    </ThemeProvider>
  );
}

