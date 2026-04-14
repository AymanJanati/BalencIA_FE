"use client";

// context/AuthContext.tsx — BalancIA
// Stores the active user session. Calls the real backend for login.
// Falls back to mock sessions when NEXT_PUBLIC_USE_MOCK=true.
// Session is persisted in localStorage so page refreshes don't log you out.

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

import type { AuthSession, LoginFormValues, UserRole } from "@/types";
import { loginWithCredentials } from "@/services/api";

// ─── Types ─────────────────────────────────────────────────────────────────

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  /** Real async login — calls POST /auth/login (or mock). */
  login: (credentials: LoginFormValues) => Promise<void>;
  logout: () => void;
}

// ─── Context ───────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_STORAGE_KEY = "balancia_session";

// ─── Provider ──────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);

  // Rehydrate from localStorage on first mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthSession;
        setSession(parsed);
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  const login = useCallback(async (credentials: LoginFormValues) => {
    const authSession = await loginWithCredentials(credentials);
    setSession(authSession);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authSession));
    } catch {
      // ignore storage errors (e.g. private browsing)
    }
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: session !== null,
        role: (session?.user.role as UserRole) ?? null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
