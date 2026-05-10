"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050914] px-8 py-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
            <span className="text-white font-black text-3xl">C</span>
          </div>
          <span className="text-3xl font-semibold tracking-tight text-white">
            Career<span className="text-primary">AI</span>
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="#" className="hover:text-primary transition-colors">
            Resume Intelligence
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Interview AI
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Career Roadmap
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            AI Assistant
          </Link>
        </div>

        <div className="text-muted-foreground text-sm">
          © 2024 CareerAI Platform • All rights reserved
        </div>
      </div>
    </footer>
  );
}
