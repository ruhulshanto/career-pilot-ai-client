"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Check,
  MessageSquare,
  MoreVertical,
  Pencil,
  Pin,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import type { ChatbotSessionResponse } from "@/shared/types/chatbot";

interface SessionItemProps {
  session: ChatbotSessionResponse;
  isActive: boolean;
  isPinned: boolean;
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
        "group flex h-[72px] w-full max-w-full min-w-0 items-center justify-between gap-2 overflow-hidden rounded-2xl border px-3 py-2 transition-all duration-300",
        isActive
          ? "border-primary/20 bg-primary/10 shadow-xl"
          : "border-transparent hover:bg-muted/40",
      )}
    >
      <div className="flex h-full min-w-0 flex-1 basis-0 items-center gap-3 overflow-hidden">
        <div
          className={cn(
            "flex h-10 w-10 flex-none items-center justify-center rounded-xl border transition-all duration-300",
            isActive
              ? "border-transparent bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              : "border-border/60 bg-muted/40 text-foreground/30 group-hover:text-foreground/60",
          )}
        >
          <MessageSquare className="h-5 w-5" />
        </div>

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
            className="h-10 min-w-0 flex-1 basis-0 rounded-lg px-3 text-sm font-semibold"
            aria-label="Conversation title"
          />
        ) : (
          <button
            type="button"
            onClick={onClick}
            className="flex h-full min-w-0 flex-1 basis-0 flex-col justify-center overflow-hidden rounded-xl pr-2 text-left"
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
            <span
              className={cn(
                "mt-1 block w-full min-w-0 max-w-full truncate whitespace-nowrap text-[10px] font-bold uppercase leading-4 tracking-widest",
                isActive ? "text-primary/70" : "text-foreground/30",
              )}
            >
              {session.lastMessage || "Open Consultation"}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-9 w-9 flex-none rounded-xl p-0 text-foreground/35 opacity-70 hover:bg-muted/40 hover:text-foreground group-hover:opacity-100 data-[state=open]:bg-muted/40 data-[state=open]:text-foreground data-[state=open]:opacity-100"
              aria-label="Conversation actions"
              title="Conversation actions"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={6}
            className="w-40 rounded-xl border-border/60 bg-card/95 p-1.5 shadow-2xl shadow-elevation/15 backdrop-blur"
          >
            <DropdownMenuItem
              onSelect={startRename}
              className="gap-2 rounded-lg px-2.5 py-2"
            >
              <Pencil className="h-4 w-4 text-foreground/60" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={onTogglePin}
              className="gap-2 rounded-lg px-2.5 py-2"
            >
              <Pin className="h-4 w-4 text-foreground/60" />
              {isPinned ? "Unpin" : "Pin"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={onShare}
              className="gap-2 rounded-lg px-2.5 py-2"
            >
              <Share2 className="h-4 w-4 text-foreground/60" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={onDelete}
              className="gap-2 rounded-lg px-2.5 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
});

SessionItem.displayName = "SessionItem";
