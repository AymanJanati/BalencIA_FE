"use client";

// app/(auth)/login/page.tsx — BalancIA login screen
// Real email+password login calling POST /auth/login.
// Demo credentials shown below the form for easy access.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/constants";

import Image from "next/image";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const DEMO_ACCOUNTS = [
  { label: "Employee — Youssef", email: "youssef.alaoui@balancia.demo", role: "Employee" },
  { label: "Employee — Fatima",  email: "fatimazahra.idrissi@balancia.demo", role: "Employee" },
  { label: "Employee — Mehdi",   email: "mehdi.benchrifa@balancia.demo", role: "Employee" },
  { label: "Manager — Nadia",    email: "nadia.bensouda@balancia.demo", role: "Manager"  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("demo");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email."); return; }
    setError(null);
    setIsLoading(true);
    try {
      await login({ email: email.trim().toLowerCase(), password });
      // Redirect is handled by AuthContext-aware layout after session is set.
      // We read the role from the session — give it a tick to propagate.
      await new Promise((r) => setTimeout(r, 100));
      const stored = localStorage.getItem("balancia_session");
      if (stored) {
        const { user } = JSON.parse(stored);
        router.push(user.role === "manager" ? ROUTES.manager : ROUTES.checkin);
      } else {
        router.push(ROUTES.checkin);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("demo");
    setError(null);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background-secondary p-4">
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand rounded-full opacity-[0.04] blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md flex flex-col gap-4 relative z-10">
        <Card padding="lg" className="border-border/60 shadow-xl">
          {/* Logo + title */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-48 h-12 mb-4">
              <Image src="/logo-text.png" alt="BalancIA Logo" fill sizes="192px" className="object-contain" priority />
            </div>
            <p className="text-body text-text-secondary text-center text-sm">
              Balance through AI
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-risk-high-bg border border-red-200 text-risk-high-text text-body text-sm font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-body font-medium text-text-primary text-sm">
                Work email
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 rounded-input border border-border focus:outline-none focus:ring-2 focus:ring-[#2f8876]/20 focus:border-[#2f8876] transition-colors bg-background-primary text-text-primary text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-body font-medium text-text-primary text-sm">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-input border border-border focus:outline-none focus:ring-2 focus:ring-[#2f8876]/20 focus:border-[#2f8876] transition-colors bg-background-primary text-text-primary text-sm"
              />
            </div>

            <div className="pt-1">
              <Button
                type="submit"
                size="lg"
                className="w-full justify-center"
                disabled={isLoading}
              >
                {isLoading ? "Signing in…" : "Sign in"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Demo quick-fill card */}
        <Card padding="md" className="border-border/40 bg-background-secondary/60">
          <p className="text-caption font-semibold text-text-secondary uppercase tracking-widest mb-3 text-xs">
            Demo accounts — password: <span className="font-bold text-brand">demo</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => fillDemo(acc.email)}
                className={`text-left px-3 py-2.5 rounded-lg border text-xs transition-all duration-150 ${
                  email === acc.email
                    ? "bg-brand-subtle border-[#2f8876] text-[#2f8876] font-semibold"
                    : "bg-background-primary border-border text-text-secondary hover:border-gray-300 hover:text-text-primary"
                }`}
              >
                <span className="block font-semibold">{acc.role}</span>
                <span className="block text-[10px] opacity-70 truncate">{acc.email.split("@")[0]}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
