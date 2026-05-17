"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Check,
  MessageSquare,
  Pencil,
  Pin,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import type { ChatbotSessionResponse } from "@/shared/types/chatbot";

interface SessionItemProps {
  session: ChatbotSessionResponse;
  isActive: boolean;
  isPinned: boolean;
  isSelectMode: boolean;
  isSelected: boolean;
  onToggleSelect: () => void;
  onClick: () => void;
  onRename: (title: string) => Promise<void>;
  onTogglePin: () => void;
  onShare: () => void;
  onDelete: () => void;
}

export const SessionItem = React.memo(function SessionItem({
  session,
  isActive,
  isPinned,
  isSelectMode,
  isSelected,
  onToggleSelect,
  onClick,
  onRename,
  onTogglePin,
  onShare,
  onDelete,
}: SessionItemProps) {
  const title = session.title || "Untitled conversation";
  const [isRenaming, setIsRenaming] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const [isSavingRename, setIsSavingRename] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isRenaming) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isRenaming]);

  useEffect(() => {
    if (!isRenaming) setDraftTitle(title);
  }, [isRenaming, title]);

  const startRename = () => {
    setDraftTitle(title);
    setIsRenaming(true);
  };

  const cancelRename = () => {
    setDraftTitle(title);
    setIsRenaming(false);
  };

  const saveRename = async () => {
    const nextTitle = draftTitle.trim();

    if (!nextTitle || nextTitle === title) {
      cancelRename();
      return;
    }

    setIsSavingRename(true);
    try {
      await onRename(nextTitle);
      setIsRenaming(false);
    } finally {
      setIsSavingRename(false);
    }
  };

  return (
    <div
      className={cn(
        "group flex h-14 w-full max-w-full min-w-0 items-center justify-between gap-2 overflow-hidden rounded-2xl border px-3 py-2 transition-all duration-300",
        isActive
          ? "border-primary/20 bg-primary/10 shadow-xl"
          : "border-transparent hover:bg-muted/40",
      )}
    >
      <div className="flex h-full min-w-0 flex-1 basis-0 items-center gap-3 overflow-hidden">
        {isSelectMode ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect();
            }}
            className={cn(
              "flex h-6 w-6 flex-none items-center justify-center rounded-lg border transition-all duration-300 cursor-pointer",
              isSelected
                ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "border-border/80 bg-muted/20 text-transparent hover:border-primary/50",
            )}
          >
            <Check className="h-4 w-4 text-primary-foreground" />
          </div>
        ) : (
          <div
            className={cn(
              "flex h-9 w-9 flex-none items-center justify-center rounded-xl border transition-all duration-300",
              isActive
                ? "border-transparent bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "border-border/60 bg-muted/40 text-foreground/30 group-hover:text-foreground/60",
            )}
          >
            <MessageSquare className="h-4 w-4" />
          </div>
        )}

        {isRenaming ? (
          <Input
            ref={inputRef}
            value={draftTitle}
            disabled={isSavingRename}
            onChange={(event) => setDraftTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void saveRename();
              }
              if (event.key === "Escape") {
                event.preventDefault();
                cancelRename();
              }
            }}
            className="h-9 min-w-0 flex-1 basis-0 rounded-lg px-3 text-sm font-semibold"
            aria-label="Conversation title"
          />
        ) : (
          <button
            type="button"
            onClick={onClick}
            className="flex min-w-0 flex-1 basis-0 flex-col justify-center overflow-hidden rounded-xl pr-2 text-left"
          >
            <span className="flex w-full min-w-0 max-w-full items-center gap-1.5 overflow-hidden">
              {isPinned && (
                <Pin className="h-3 w-3 flex-none text-primary/80" />
              )}
              <span
                className={cn(
                  "block min-w-0 flex-1 truncate whitespace-nowrap text-sm font-bold leading-5 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-foreground/70 group-hover:text-foreground",
                )}
              >
                {title}
              </span>
            </span>
          </button>
        )}
      </div>

      {isRenaming ? (
        <div className="flex h-9 flex-none items-center gap-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            disabled={isSavingRename}
            onClick={() => void saveRename()}
            className="h-9 w-9 rounded-xl p-0 text-primary hover:bg-primary/10"
            aria-label="Save conversation title"
            title="Save"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            disabled={isSavingRename}
            onClick={cancelRename}
            className="h-9 w-9 rounded-xl p-0 text-foreground/45 hover:bg-muted/40 hover:text-foreground"
            aria-label="Cancel rename"
            title="Cancel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        !isSelectMode && (
          <div className={cn(
            "flex h-9 flex-none items-center gap-0.5 transition-all duration-300",
            isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
          )}>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={onTogglePin}
              className={cn(
                "h-8 w-8 rounded-lg p-0 hover:bg-muted/40 transition-colors",
                isPinned ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              title={isPinned ? "Unpin" : "Pin"}
            >
              <Pin className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={onShare}
              className="h-8 w-8 rounded-lg p-0 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={startRename}
              className="h-8 w-8 rounded-lg p-0 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              title="Rename"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={onDelete}
              className="h-8 w-8 rounded-lg p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/15 transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      )}
    </div>
  );
});

SessionItem.displayName = "SessionItem";
