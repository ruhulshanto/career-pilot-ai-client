"use client";

import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/shared/components/ui/dialog";
import { getPublicImageUrl } from "@/shared/utils/image";
import { X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ProfileImagePreviewProps {
  children: React.ReactNode;
  avatarUrl?: string | null;
  name?: string;
}

export function ProfileImagePreview({ children, avatarUrl, name }: ProfileImagePreviewProps) {
  if (!avatarUrl) return <>{children}</>;

  const fullImageUrl = getPublicImageUrl(avatarUrl);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full transition-transform active:scale-95">
          {children}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] md:max-w-[600px] border-none bg-transparent p-0 shadow-none outline-none">
        <VisuallyHidden>
          <DialogTitle>Profile Image Preview of {name || 'User'}</DialogTitle>
        </VisuallyHidden>
        <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-black/40 backdrop-blur-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fullImageUrl ?? ""}
            alt={name || "Profile Picture"}
            className="h-full w-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
