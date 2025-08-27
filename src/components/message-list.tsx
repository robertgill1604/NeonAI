"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/lib/types";
import { ChatBubble } from "./chat-bubble";

interface MessageListProps {
  messages: Message[];
  currentUserUid: string | undefined;
}

export function MessageList({ messages, currentUserUid }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
      <div className="flex flex-col gap-4">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            isCurrentUser={msg.uid === currentUserUid}
            isBot={msg.uid === "ai-bot"}
          />
        ))}
      </div>
    </div>
  );
}
