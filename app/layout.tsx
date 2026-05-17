import type { Metadata } from 'next';

import { Plus_Jakarta_Sans } from 'next/font/google';

import '@/app/globals.css';
import { AppProvider } from '@/shared/providers/app-provider';

import { Toaster } from '@/shared/components/ui/toaster';

const font = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Career Pilot AI',
  description: 'AI-powered career development, resume analysis, and job tracking platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <AppProvider>
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
