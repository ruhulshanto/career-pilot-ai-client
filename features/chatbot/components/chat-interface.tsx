"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useChatbotStore } from "@/shared/store/use-chatbot-store";
import { useChatbotStream } from "@/shared/hooks/use-chatbot-stream";

export const ChatInterface = ({ sessionId }: { sessionId: string }) => {
  const { messages, sendMessage, isStreaming } = useChatbotStore();
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useChatbotStream(sessionId);

  const sessionMessages = useMemo(
    () => messages[sessionId] || [],
    [messages, sessionId],
  );

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [sessionMessages, scrollToBottom]);

  const handleSend = async () => {
    if (!inputValue.trim() || isStreaming) return;
    const content = inputValue;
    setInputValue("");
    await sendMessage(content);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-[#111827]">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-10 scrollbar-hide"
      >
        {sessionMessages.map((msg, idx) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-5 max-w-[90%] lg:max-w-[80%]",
              msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto",
            )}
          >
            <div
              className={cn(
                "flex-shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center border shadow-sm",
                msg.role === "user"
                  ? "bg-primary border-primary/20 text-white"
                  : "bg-white/5 border-border text-primary",
              )}
            >
              {msg.role === "user" ? (
                <User className="h-6 w-6" />
              ) : (
                <Bot className="h-6 w-6" />
              )}
            </div>

            <div
              className={cn(
                "relative p-6 rounded-3xl text-sm lg:text-base leading-7 tracking-wide font-medium border shadow-sm",
                msg.role === "user"
                  ? "bg-primary/10 border-primary/20 text-white rounded-tr-none"
                  : "bg-card border-border text-foreground/90 rounded-tl-none",
              )}
            >
              {msg.content}
              {msg.role === "assistant" &&
                isStreaming &&
                idx === sessionMessages.length - 1 && (
                  <span className="inline-block w-2.5 h-6 ml-2 rounded-full bg-primary/60 animate-pulse align-middle" />
                )}
            </div>
          </div>
        ))}

        {isStreaming &&
          sessionMessages[sessionMessages.length - 1]?.role === "user" && (
            <div className="flex gap-5 mr-auto items-center">
              <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-border shadow-sm">
                <Bot className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <div className="flex-1 rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
                Processing your request...
              </div>
            </div>
          )}
      </div>

      <div className="border-t border-border bg-[#0B1120]/80 p-6">
        <div className="flex items-center gap-4 rounded-[1.5rem] border border-border bg-[#111827] px-4 py-4 shadow-sm">
          <Input
            placeholder="Command the AI Career Engine..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isStreaming}
            className="flex-1 bg-transparent border-none px-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isStreaming}
            size="icon"
            className="h-14 w-14 rounded-[1.25rem]"
          >
            {isStreaming ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
