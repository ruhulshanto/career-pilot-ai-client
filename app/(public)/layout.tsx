import type { PropsWithChildren } from 'react';

import { Navbar as SiteHeader } from './home/components/navbar';
import { Footer } from './home/sections/footer';

export default function PublicLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>{children}</main>
      <Footer />
    </div>
  );
}



