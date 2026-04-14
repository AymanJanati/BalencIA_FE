"use client";

// context/AuthContext.tsx — BalencIA
// Holds the active user session across all pages.
// For hackathon mode: session is set on login and stored in memory.
// No real JWT validation — role-based routing is handled here.

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

import type { AuthSession, UserRole } from "@/types";
import { getMockSessionByRole } from "@/mock-data";

// ─── Types ─────────────────────────────────────────────────────────────────

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (role: UserRole) => void;   // simplified for hackathon — role-based only
  logout: () => void;
}

// ─── Context ───────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);

  const login = useCallback((role: UserRole) => {
    // Hackathon mode: always resolve to seeded mock session by role
    const mockSession = getMockSessionByRole(role);
    setSession(mockSession);
  }, []);

  const logout = useCallback(() => {
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: session !== null,
        role: session?.user.role ?? null,
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
