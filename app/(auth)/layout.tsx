import Link from "next/link";
import type { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="dark-workspace-bg relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background">
      <div className="pointer-events-none absolute left-[8%] top-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute right-[8%] top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-60" />

      <header className="sticky top-0 z-40 shrink-0 border-b border-border/80 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-85"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm shadow-primary/20">
              <span className="text-sm font-bold text-primary-foreground">C</span>
            </div>
            <span className="hidden text-lg font-semibold text-foreground sm:inline">
              Career<span className="text-primary">AI</span>
            </span>
          </Link>
          <div className="hidden rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-medium text-accent sm:block">
            Demo-ready workspace
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-[1120px] flex-1 items-center gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(380px,420px)] lg:gap-10 lg:py-4 xl:gap-14">
        <section className="hidden max-w-[620px] lg:block">
          <div className="mb-5 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            AI career operating system
          </div>
          <h1 className="text-4xl font-bold leading-[1.08] text-foreground xl:text-[2.8rem]">
            Explore every career workflow from one secure workspace.
          </h1>
          <p className="mt-4 max-w-[540px] text-base leading-7 text-muted-foreground">
            Demo accounts include resume analysis, roadmaps, interviews, job matches,
            notifications, profiles, and admin analytics, ready to test after deployment.
          </p>
          <div className="mt-6 grid max-w-[540px] grid-cols-3 gap-3">
            {["Resume AI", "Interview Mentor", "Admin Analytics"].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-border/80 bg-card/80 p-3.5 text-sm font-semibold text-foreground"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[440px] lg:mx-0 lg:justify-self-end">
          {children}
        </section>
      </main>

      <div className="relative z-10 shrink-0 px-4 py-3 text-center text-xs text-muted-foreground">
        <span>Secure - Privacy-first - Demo-ready</span>
      </div>
    </div>
  );
}
