"use client";

// components/layout/Topbar.tsx — Top bar with page title + user menu

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import Button from "@/components/ui/Button";

interface TopbarProps {
  /** Page title displayed on the left of the topbar */
  title?: string;
  /** Optional right-side action slot */
  actions?: React.ReactNode;
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function Topbar({ title, actions }: TopbarProps) {
  const { session, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push(ROUTES.login);
  }

  return (
    <header className="fixed top-0 left-sidebar right-0 h-topbar bg-background-primary border-b border-border flex items-center justify-between px-6 z-20">
      {/* ─── Left: Page title ─────────────────────────────────────── */}
      <div>
        {title && (
          <h2 className="text-card-title text-text-primary font-semibold">
            {title}
          </h2>
        )}
      </div>

      {/* ─── Right: Actions + user ────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {actions && <div className="flex items-center gap-2">{actions}</div>}

        {session && (
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            {/* User info */}
            <div className="text-right hidden sm:block">
              <p className="text-body font-medium text-text-primary leading-tight">
                {session.user.name}
              </p>
              <p className="text-caption text-text-secondary capitalize leading-tight">
                {session.user.role}
              </p>
            </div>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-brand-subtle flex items-center justify-center shrink-0">
              <span className="text-caption font-semibold text-[#2f8876]">
                {session.user.name.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              title="Sign out"
              className="text-text-secondary"
            >
              <LogoutIcon />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
