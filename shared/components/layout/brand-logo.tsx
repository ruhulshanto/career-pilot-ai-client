"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { CareerPilotTrajectoryIcon } from "@/shared/components/icons/CareerPilotTrajectoryIcon";

interface BrandLogoProps {
  variant?: "navbar" | "sidebar" | "footer";
  collapsed?: boolean;
  className?: string;
}

export function BrandLogo({
  variant = "navbar",
  collapsed = false,
  className,
}: BrandLogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);
  };

  const isSidebar = variant === "sidebar";

  return (
    <Link
      href="/"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className={cn(
        "group flex min-w-0 items-center outline-none transition-all duration-300",
        isSidebar && collapsed ? "justify-center" : "gap-3",
        isHovered && "scale-[1.02]",
        className
      )}
    >
      {/* ── Trajectory Mark ── original aerospace-navigation icon ── */}
      <div className="relative flex h-[34px] w-[34px] shrink-0 items-center justify-center transition-all duration-300">
        <CareerPilotTrajectoryIcon
          isHovered={isHovered}
          isClicked={isClicked}
          className="text-primary"
        />
      </div>

      {/* ── Wordmark ── custom typographic hierarchy ── */}
      {(!collapsed || !isSidebar) && (
        <div className="flex flex-col overflow-hidden leading-none">
          <div className="flex items-baseline gap-[4px]">
            <span
              className={cn(
                "text-[11px] font-light uppercase tracking-[0.2em] transition-all duration-300",
                isHovered ? "text-foreground/60" : "text-foreground/45"
              )}
            >
              Career
            </span>
            <span
              className={cn(
                "text-[15px] font-semibold tracking-[-0.02em] transition-all duration-300",
                isHovered ? "text-foreground" : "text-foreground/90"
              )}
            >
              Pilot
            </span>
          </div>
        </div>
      )}
    </Link>
  );
}
