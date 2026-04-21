import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = { id: string; name: string; email: string };

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type AuthState = {
  user: User | null;
  token: string | null;
  guestMode: boolean;
  signup: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setGuestMode: (enabled: boolean) => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      guestMode: false,
      signup: async (name, email, password) => {
        try {
          const res = await fetch(`${API_URL}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          });
          const data = await res.json();
          if (!res.ok) return { ok: false, error: data.message };
          set({ user: data.user, token: data.token });
          return { ok: true };
        } catch (err) {
          return { ok: false, error: "Connection error" };
        }
      },
      login: async (email, password) => {
        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (!res.ok) return { ok: false, error: data.message };
          set({ user: data.user, token: data.token });
          return { ok: true };
        } catch (err) {
          return { ok: false, error: "Connection error" };
        }
      },
      logout: () => set({ user: null, token: null, guestMode: false }),
      setGuestMode: (enabled) => {
        if (enabled) {
          set({ user: { id: "guest", name: "Guest User", email: "guest@local" }, token: "guest-token", guestMode: true });
        } else {
          set({ guestMode: false });
        }
      },
      checkAuth: async () => {
        if (get().guestMode) return;
        const token = get().token;
        if (!token) return;
        try {
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const user = await res.json();
            set({ user });
          } else {
            set({ user: null, token: null });
          }
        } catch (err) {
          console.error("Auth check failed", err);
        }
      },
    }),
    { 
      name: "resumeats-auth",
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);
