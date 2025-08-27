"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon } from "@/components/icons";

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="shrink-0 border-t bg-card p-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          type="text"
          placeholder={disabled ? "Sign in to chat" : "Type a message..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={disabled}
          className="flex-1 rounded-full border-2 border-primary/50 bg-transparent px-4 py-2 text-foreground focus:border-primary focus:shadow-glow-primary focus:ring-0"
          autoComplete="off"
        />
        <Button
          type="submit"
          disabled={disabled || !inputValue.trim()}
          className="rounded-full shadow-glow-primary transition-all hover:shadow-lg hover:shadow-primary"
          size="icon"
        >
          <SendIcon />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
