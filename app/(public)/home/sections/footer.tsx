"use client";

import Link from "next/link";
import { Mail, Sparkles } from "lucide-react";

const footerGroups = [
  {
    title: "Product",
    links: [
      { label: "Explore", href: "/explore" },
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Dashboard", href: "/dashboard/user" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Resume Analysis", href: "/dashboard/user/resume" },
      { label: "Roadmaps", href: "/dashboard/user/roadmap" },
      { label: "AI Assistant", href: "/#assistant" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-background px-4 py-14 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1.8fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm shadow-primary/20">
                CP
              </div>
              <div>
                <span className="block text-base font-semibold">
                  Career Pilot AI
                </span>
                <span className="text-xs text-muted-foreground">
                  AI career operating system
                </span>
              </div>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
              A modern workspace for resume analysis, career roadmaps,
              interviews, job tracking, and AI-guided career progress.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border/80 bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/35 hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              Contact
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold text-foreground">
                  {group.title}
                </h3>
                <div className="mt-4 grid gap-3">
                  {group.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border/80 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            Built for practical, honest AI career guidance.
          </div>
          <p>Copyright 2026 Career Pilot AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
