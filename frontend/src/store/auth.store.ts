"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      setAuth: (user, accessToken) => {
        localStorage.setItem("accessToken", accessToken);
        set({ user, accessToken });
      },
      clearAuth: () => {
        localStorage.removeItem("accessToken");
        set({ user: null, accessToken: null });
      },
      isAuthenticated: () => !!get().accessToken && !!get().user,
    }),
    { name: "lms-auth" }
  )
);
