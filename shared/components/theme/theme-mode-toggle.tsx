"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

function useMountedTheme() {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return { ...theme, mounted };
}

export function ThemeModeToggle({
  className,
  label = "Theme",
}: {
  className?: string;
  label?: string;
}) {
  const { theme, setTheme, mounted } = useMountedTheme();
  const activeTheme = theme ?? "system";

  if (!mounted) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border/60 bg-muted/30 p-2",
          className,
        )}
        aria-label="Loading theme preference"
      >
        <div className="mb-2 h-3 w-16 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-3 gap-1">
          <div className="h-9 animate-pulse rounded-lg bg-muted" />
          <div className="h-9 animate-pulse rounded-lg bg-muted" />
          <div className="h-9 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-border/60 bg-muted/30 p-2", className)}>
      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <div
        role="radiogroup"
        aria-label="Theme preference"
        className="grid grid-cols-3 gap-1"
      >
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const selected = activeTheme === option.value;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setTheme(option.value)}
              className={cn(
                "flex h-9 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                selected
                  ? "bg-background text-foreground shadow-sm shadow-elevation/5"
                  : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ThemeModeDropdown({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme, mounted } = useMountedTheme();
  const activeTheme = theme ?? "system";
  const TriggerIcon = resolvedTheme === "dark" ? Moon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "h-10 w-10 rounded-lg border border-border/60 bg-background/50 text-muted-foreground hover:border-border hover:bg-muted/50 hover:text-foreground",
            className,
          )}
          aria-label="Change theme"
          disabled={!mounted}
        >
          <TriggerIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 rounded-xl border-border/60 bg-popover p-2 shadow-xl shadow-elevation/10"
      >
        <DropdownMenuLabel className="px-3 py-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Theme
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={activeTheme} onValueChange={setTheme}>
          {themeOptions.map((option) => {
            const Icon = option.icon;

            return (
              <DropdownMenuRadioItem
                key={option.value}
                value={option.value}
                className="cursor-pointer rounded-lg py-2.5 pl-8 pr-3"
              >
                <Icon className="mr-2 h-4 w-4 text-primary" />
                {option.label}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
