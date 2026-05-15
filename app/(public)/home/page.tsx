'use client';

import { Hero } from './sections/hero';
import { Features } from './sections/features';

export default function HomePage() {
  return (
    <div className="relative w-full overflow-hidden bg-background">
      <Hero />
      <Features />
    </div>
  );
}



