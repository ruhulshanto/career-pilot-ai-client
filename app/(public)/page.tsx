"use client";

import { Hero } from "./home/sections/hero";
import { Features } from "./home/sections/features";
import { Footer } from "./home/sections/footer";

export default function HomePage() {
  return (
    <div className="relative w-full overflow-hidden bg-[#0B1120]">
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
