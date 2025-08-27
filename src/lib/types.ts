import type { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Message {
  id: string;
  text: string;
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
}
