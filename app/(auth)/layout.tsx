import Link from "next/link";
import type { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="hidden sm:inline text-lg font-semibold text-foreground">
              Career<span className="text-primary">AI</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Background gradients */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full px-6 py-12">
        {children}
      </div>

      {/* Footer - optional security badges */}
      <div className="text-center py-6 text-xs text-muted-foreground opacity-50">
        <span>Secure • Privacy-First • Enterprise Grade</span>
      </div>
    </div>
  );
}
