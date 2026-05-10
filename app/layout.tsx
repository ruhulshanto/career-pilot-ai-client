import type { Metadata } from 'next';

import '@/app/globals.css';
import { AppProvider } from '@/shared/providers/app-provider';

import { Toaster } from '@/shared/components/ui/toaster';

export const metadata: Metadata = {
  title: 'CareerAI Platform',
  description: 'AI-powered career platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProvider>
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}



