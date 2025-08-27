"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/hooks/use-theme";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { Message } from "@/lib/types";
import { Header } from "@/components/header";
import { MessageList } from "@/components/message-list";
import { MessageInput } from "@/components/message-input";
import { generateAIResponse } from "@/ai/flows/generate-ai-response";
import { useToast } from "@/hooks/use-toast";

const botAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-bot'%3E%3Cpath d='M12 8V4H8%3E%3Crect width='16' height='12' x='4' y='8' rx='2'/%3E%3Cpath d='M2 14h2%3E%3Cpath d='M20 14h2'/%3E%3Cpath d='M15 13v2'/%3E%3Cpath d='M9 13v2'/%3E%3C/svg%3E";

export default function ChatPage() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const auth = isFirebaseConfigured ? getAuth() : null;
  const db = isFirebaseConfigured ? getFirestore() : null;

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(50));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs.reverse());
    });
    return () => unsubscribe();
  }, [db]);

  const signInWithGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
      toast({ title: "Sign-in Error", description: "Could not sign in with Google.", variant: "destructive" });
    }
  };

  const signUpWithEmail = async (email: string, password: string):Promise<boolean> => {
    if (!auth) return false;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error: any) {
      console.error("Error signing up with email", error);
      toast({ title: "Sign-up Error", description: error.message || "Could not sign up.", variant: "destructive" });
      return false;
    }
  };

  const signInWithEmail = async (email: string, password: string):Promise<boolean> => {
    if (!auth) return false;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error: any) {
      console.error("Error signing in with email", error);
      toast({ title: "Sign-in Error", description: error.message || "Could not sign in.", variant: "destructive" });
      return false;
    }
  };

  const resetPassword = async (email: string):Promise<boolean> => {
    if (!auth) return false;
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ title: "Password Reset", description: "Password reset email sent. Please check your inbox." });
      return true;
    } catch (error: any) {
      console.error("Error sending password reset email", error);
      toast({ title: "Password Reset Error", description: error.message || "Could not send password reset email.", variant: "destructive" });
      return false;
    }
  }

  const signOut = async () => {
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
      toast({ title: "Sign-out Error", description: "Could not sign out.", variant: "destructive" });
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!db || !user) return;
    const trimmedText = text.trim();
    if (trimmedText === "") return;

    const { uid, displayName, photoURL } = user;
    await addDoc(collection(db, "messages"), {
      text: trimmedText,
      uid,
      displayName,
      photoURL,
      createdAt: serverTimestamp(),
    });

    if (trimmedText.startsWith("/ai ")) {
      const prompt = trimmedText.substring(4);
      try {
        const aiResponse = await generateAIResponse({ prompt });
        if (aiResponse.response) {
          await addDoc(collection(db, "messages"), {
            text: aiResponse.response,
            uid: "ai-bot",
            displayName: "Neon AI",
            photoURL: botAvatar,
            createdAt: serverTimestamp(),
          });
        }
      } catch (error) {
        console.error("Error generating AI response:", error);
        toast({
          title: "AI Error",
          description: "Could not generate a response.",
          variant: "destructive",
        });
      }
    }
  };

  if (!isFirebaseConfigured) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-center">
        <div className="rounded-lg border bg-card p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-destructive">Firebase Not Configured</h1>
          <p className="mt-4 text-muted-foreground">
            To use Neon Chat AI, you need to set up Firebase.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please copy <code className="font-mono">.env.local.example</code> to <code className="font-mono">.env.local</code> and fill in your Firebase project credentials.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <Header
        user={user}
        signInWithGoogle={signInWithGoogle}
        signInWithEmail={signInWithEmail}
        signUpWithEmail={signUpWithEmail}
        resetPassword={resetPassword}
        signOut={signOut}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <MessageList messages={messages} currentUserUid={user?.uid} />
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={!user || loading}
      />
    </div>
  );
}
