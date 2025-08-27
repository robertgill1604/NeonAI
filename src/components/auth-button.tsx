"use client";

import { useState } from "react";
import type { User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LogIn, LogOut } from "lucide-react";
import { AuthForm } from "./auth-form";

interface AuthButtonProps {
  user: User | null;
  signInWithGoogle: () => void;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signUpWithEmail: (email: string, password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  signOut: () => void;
}

export function AuthButton({ 
  user, 
  signInWithGoogle, 
  signInWithEmail,
  signUpWithEmail,
  resetPassword,
  signOut 
}: AuthButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-9 w-9 shadow-glow-primary">
              <AvatarImage
                src={user.photoURL || undefined}
                alt={user.displayName || "User"}
              />
              <AvatarFallback>
                {user.displayName?.charAt(0) || user.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.displayName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="shadow-glow-primary transition-all hover:shadow-lg hover:shadow-primary"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]">
            Welcome to Neon Chat
          </DialogTitle>
        </DialogHeader>
        <AuthForm 
          signInWithGoogle={signInWithGoogle} 
          signInWithEmail={signInWithEmail}
          signUpWithEmail={signUpWithEmail}
          resetPassword={resetPassword}
          closeDialog={() => setDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
