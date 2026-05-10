'use client';

import { Hero } from './sections/hero';
import { Features } from './sections/features';
import { Footer } from './sections/footer';

export default function HomePage() {
  return (
    <div className="relative w-full overflow-hidden bg-[#0B1120]">
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}



