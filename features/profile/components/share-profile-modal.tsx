"use client";

import { Copy, ExternalLink, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function ShareProfileModal({
  open,
  profileUrl,
  onClose,
}: {
  open: boolean;
  profileUrl: string;
  onClose: () => void;
}) {
  if (!open) return null;

  const copyLink = () => {
    void navigator.clipboard?.writeText(profileUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Share profile
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Anyone with this link can view your public career portfolio.
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-xl"
            onClick={onClose}
            aria-label="Close share modal"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-5 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
          {profileUrl}
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button className="h-11 flex-1 rounded-2xl" onClick={copyLink}>
            <Copy className="mr-2 h-4 w-4" />
            Copy link
          </Button>
          <Button asChild variant="outline" className="h-11 flex-1 rounded-2xl">
            <a href={profileUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
