'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface SessionItemProps {
  session: any;
  isActive: boolean;
  onClick: () => void;
}

export const SessionItem = React.memo(({ session, isActive, onClick }: SessionItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300 relative group overflow-hidden",
      isActive 
        ? "bg-primary/10 border border-primary/20 shadow-xl" 
        : "hover:bg-white/5 border border-transparent"
    )}
  >
    {isActive && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
    )}
    <div className={cn(
      "h-10 w-10 rounded-xl flex items-center justify-center border transition-all duration-300 shrink-0",
      isActive 
        ? "bg-primary border-transparent text-white shadow-lg shadow-primary/20" 
        : "bg-white/5 border-white/10 text-foreground/30 group-hover:text-foreground/60"
    )}>
      <MessageSquare className="h-5 w-5" />
    </div>
    <div className="flex-1 overflow-hidden">
      <p className={cn(
        "text-sm font-bold truncate transition-colors",
        isActive ? "text-white" : "text-foreground/70 group-hover:text-white"
      )}>
        {session.title}
      </p>
      <p className={cn(
        "text-[10px] font-bold uppercase tracking-widest truncate mt-1",
        isActive ? "text-primary/70" : "text-foreground/30"
      )}>
        {session.lastMessage || 'Open Consultation'}
      </p>
    </div>
  </button>
));

SessionItem.displayName = 'SessionItem';
