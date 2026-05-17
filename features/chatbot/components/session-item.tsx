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
        "group flex h-12 w-full max-w-full min-w-0 items-center gap-2 overflow-hidden rounded-xl border px-2.5 py-0 transition-all duration-300",
        isActive
          ? "border-primary/20 bg-primary/10 shadow-lg"
          : "border-transparent hover:bg-muted/40",
      )}
    >
      {/* Left: icon or checkbox */}
      {isSelectMode ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect();
          }}
          className={cn(
            "flex h-5 w-5 flex-none cursor-pointer items-center justify-center rounded-md border transition-all duration-200",
            isSelected
              ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
              : "border-border/80 bg-muted/20 text-transparent hover:border-primary/50",
          )}
        >
          <Check className="h-3 w-3 text-primary-foreground" />
        </div>
      ) : (
        <div
          className={cn(
            "flex h-8 w-8 flex-none items-center justify-center rounded-lg border transition-all duration-200",
            isActive
              ? "border-transparent bg-primary text-primary-foreground shadow-md shadow-primary/20"
              : "border-border/50 bg-muted/30 text-foreground/30 group-hover:text-foreground/60",
          )}
        >
          <MessageSquare className="h-3.5 w-3.5" />
        </div>
      )}

      {/* Center: title / rename input — takes all remaining space */}
      <div className="min-w-0 flex-1 overflow-hidden">
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
            className="h-8 w-full rounded-lg px-2 text-sm font-semibold"
            aria-label="Conversation title"
          />
        ) : (
          <button
            type="button"
            onClick={onClick}
            className="flex w-full min-w-0 items-center gap-1 text-left"
          >
            {isPinned && (
              <Pin className="h-3 w-3 flex-none text-primary/80" />
            )}
            <span
              className={cn(
                "block min-w-0 flex-1 truncate text-sm font-semibold leading-none tracking-tight transition-colors",
                isActive
                  ? "text-primary"
                  : "text-foreground/65 group-hover:text-foreground",
              )}
              title={title}
            >
              {title}
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
            <div className="relative group/pin flex items-center justify-center">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={onTogglePin}
                className={cn(
                  "h-8 w-8 rounded-lg p-0 hover:bg-muted/40 transition-colors",
                  isPinned ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
                aria-label={isPinned ? "Unpin conversation" : "Pin conversation"}
              >
                <Pin className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max scale-0 transition-all duration-200 origin-bottom group-hover/pin:scale-100 bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950 text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-xl pointer-events-none z-50 flex flex-col items-center">
                <span>Only 3 chats can be pinned</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-950 dark:border-t-neutral-50" />
              </div>
            </div>
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
