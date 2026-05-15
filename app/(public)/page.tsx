"use client";

import { Hero } from "./home/sections/hero";
import { Features } from "./home/sections/features";

export default function HomePage() {
  return (
    <div className="relative w-full overflow-hidden bg-background">
      <Hero />
      <Features />
    </div>
  );
}
