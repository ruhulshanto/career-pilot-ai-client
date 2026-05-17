"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { CareerPilotTrajectoryIcon } from "@/shared/components/icons/CareerPilotTrajectoryIcon";

import { BrandLogo } from "@/shared/components/layout/brand-logo";

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
    <footer className="relative border-t border-border/50 bg-background pt-24 pb-12 text-foreground overflow-hidden">
      {/* Background Aesthetic */}
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[1.5fr_2.5fr]">
          {/* Brand & Mission Column */}
          <div className="flex flex-col items-start">
            <BrandLogo />
            <p className="mt-8 max-w-xs text-base leading-relaxed text-muted-foreground/80">
              The high-fidelity career operating system. Built for modern professionals 
              who demand precision in their growth.
            </p>
            
            <div className="mt-10 flex items-center gap-4">
              <Link
                href="/contact"
                className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/20 px-5 py-3 text-sm font-bold transition-all hover:border-primary/50 hover:bg-background"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
                   <Mail className="h-4 w-4" />
                </div>
                Contact Support
              </Link>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-12 sm:grid-cols-4 sm:gap-8">
            {footerGroups.map((group) => (
              <div key={group.title} className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">
                  {group.title}
                </h3>
                <div className="flex flex-col gap-4">
                  {group.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Meta Bar */}
        <div className="mt-24 flex flex-col items-center justify-between gap-8 border-t border-border/50 pt-10 sm:flex-row">
          <div className="flex items-center gap-4">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/30">
                <CareerPilotTrajectoryIcon className="h-5 w-5 text-primary/60" />
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Career Pilot AI</span>
                <span className="text-[10px] font-medium text-muted-foreground">© 2026 • All Rights Reserved</span>
             </div>
          </div>

          <div className="flex items-center gap-6">
            {["Twitter", "LinkedIn", "GitHub"].map((social) => (
               <Link 
                key={social} 
                href={`#${social.toLowerCase()}`}
                className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
               >
                 {social}
               </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 rounded-full border border-border/60 bg-muted/10 px-4 py-2">
             <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">System Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
