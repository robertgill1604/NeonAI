"use client";

import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';

interface ChatBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  isBot: boolean;
}

export function ChatBubble({ message, isCurrentUser, isBot }: ChatBubbleProps) {
  const alignment = isCurrentUser
    ? "justify-end"
    : isBot
    ? "justify-center"
    : "justify-start";
  const bubbleColor = isCurrentUser
    ? "bg-primary text-primary-foreground"
    : isBot
    ? "bg-neon-blue text-black"
    : "bg-accent text-accent-foreground";
  const glowShadow = isCurrentUser
    ? "shadow-glow-primary"
    : isBot
    ? "shadow-glow-blue"
    : "shadow-glow-accent";

  const avatar = (
    <Avatar className="h-8 w-8">
      <AvatarImage src={message.photoURL || undefined} />
      <AvatarFallback>
        {isBot ? 'AI' : message.displayName?.charAt(0) || 'U'}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <div
      className={cn("flex items-end gap-2 animate-fade-in", alignment)}
    >
      {!isCurrentUser && avatar}
      <div
        className={cn(
          "max-w-md rounded-lg px-4 py-2",
          bubbleColor,
          glowShadow
        )}
      >
        <p className="text-sm">{message.text}</p>
        <p className="mt-1 text-right text-xs opacity-70">
          {message.createdAt ? format(message.createdAt.toDate(), 'p') : ''}
        </p>
      </div>
       {isCurrentUser && avatar}
    </div>
  );
}
