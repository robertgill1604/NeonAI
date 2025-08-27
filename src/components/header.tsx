"use client";

import type { User } from "firebase/auth";
import { AuthButton } from "./auth-button";
import { ThemeToggle } from "./theme-toggle";

interface HeaderProps {
  user: User | null;
  signIn: () => void;
  signOut: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export function Header({ user, signIn, signOut, theme, toggleTheme }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6">
      <h1 className="text-2xl font-bold text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]">
        Neon Chat AI
      </h1>
      <div className="flex items-center gap-4">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <AuthButton user={user} signIn={signIn} signOut={signOut} />
      </div>
    </header>
  );
}
