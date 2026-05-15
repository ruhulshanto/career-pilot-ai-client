"use client";

import { useEffect } from "react";
import { useUiStore } from "@/shared/store/ui-store";

export function useKeyboardShortcuts() {
  const toggleCommandPalette = useUiStore((s) => s.toggleCommandPalette);
  const toggleAiDrawer = useUiStore((s) => s.toggleAiDrawer);
  const closeAllDrawers = useUiStore((s) => s.closeAllDrawers);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        // Allow ESC to close drawers even if focused in an input
        if (e.key === "Escape") {
          closeAllDrawers();
          target.blur();
        }
        return;
      }

      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleCommandPalette();
      }

      // Cmd+J or Ctrl+J
      if ((e.metaKey || e.ctrlKey) && e.key === "j") {
        e.preventDefault();
        toggleAiDrawer();
      }

      // ESC
      if (e.key === "Escape") {
        e.preventDefault();
        closeAllDrawers();
      }
      
      // "/" for search
      if (e.key === "/") {
        e.preventDefault();
        toggleCommandPalette();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleCommandPalette, toggleAiDrawer, closeAllDrawers]);
}
