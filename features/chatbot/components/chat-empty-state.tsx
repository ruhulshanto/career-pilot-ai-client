"use client";

import { MessageSquarePlus, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

type ChatEmptyStateProps = {
  onStart?: (initialMessage?: string) => void;
};

const starterPrompts = [
  {
    label: "Resume tips",
    prompt: "Review my resume strategy and tell me what to improve first.",
  },
  {
    label: "Interview prep",
    prompt: "Help me prepare for an interview and give me a practice plan.",
  },
  {
    label: "Career plan",
    prompt: "Help me choose the next skills to learn for my target role.",
  },
  {
    label: "Job search",
    prompt: "Give me a focused job search strategy for the next two weeks.",
  },
];

export const ChatEmptyState = ({ onStart }: ChatEmptyStateProps) => (
  <Card className="h-full border border-border shadow-sm">
    <CardContent className="flex h-full flex-col items-center justify-center gap-8 p-10 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
        <Sparkles className="h-10 w-10" />
      </div>

      <div className="space-y-3 max-w-md">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          Career Assistant Ready
        </h2>
        <p className="text-sm leading-7 text-muted-foreground">
          Start a new session to explore personalized guidance, refine your
          resume, or practice for interviews.
        </p>
      </div>

      <div className="grid w-full max-w-lg grid-cols-2 gap-3">
        {starterPrompts.map((item) => (
          <Button
            key={item.label}
            variant="outline"
            className="h-auto rounded-2xl px-4 py-3 text-xs uppercase tracking-[0.16em]"
            onClick={() => onStart?.(item.prompt)}
          >
            <MessageSquarePlus className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </div>
    </CardContent>
  </Card>
);
