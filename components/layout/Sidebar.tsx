"use client";

// components/layout/Sidebar.tsx — Navigation sidebar

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { EMPLOYEE_NAV, MANAGER_NAV } from "@/lib/constants";

import Image from "next/image";

// ─── Nav icons ─────────────────────────────────────────────────────────────
// Simple inline SVG icons — no icon library dependency

function CheckinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

// Icon map by href
const NAV_ICONS: Record<string, React.ReactNode> = {
  "/checkin":   <CheckinIcon />,
  "/dashboard": <DashboardIcon />,
  "/manager":   <TeamIcon />,
};

export default function Sidebar() {
  const pathname = usePathname();
  const { role, session } = useAuth();

  const navItems = role === "manager" ? MANAGER_NAV : EMPLOYEE_NAV;

  return (
    <aside className="fixed top-0 left-0 h-screen w-sidebar bg-background-primary border-r border-border flex flex-col z-30">
      {/* ─── Brand ─────────────────────────────────────────────────── */}
      <div className="h-topbar flex items-center px-5 border-b border-border shrink-0">
        <div className="flex items-center gap-2.5 flex-1 pt-1.5">
          <div className="relative w-32 h-10 shrink-0">
            <Image src="/logo-text.png" alt="BalancIA Logo" fill sizes="128px" className="object-contain object-left" priority />
          </div>
        </div>
      </div>

      {/* ─── Navigation ────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-button text-body font-medium transition-all duration-150",
                isActive
                  ? "bg-brand-subtle text-text-primary [&>svg]:text-[#2f8876]"
                  : "text-text-secondary hover:bg-background-secondary hover:text-text-primary",
              ].join(" ")}
            >
              {/* Active gradient indicator bar */}
              {isActive && (
                <span className="absolute left-0 w-0.5 h-6 bg-brand rounded-r-full" />
              )}
              <span className={isActive ? "text-[#2f8876]" : ""}>
                {NAV_ICONS[item.href] ?? null}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ─── User Section ──────────────────────────────────────────── */}
      {session && (
        <div className="border-t border-border px-4 py-3 shrink-0">
          <div className="flex items-center gap-3">
            {/* Avatar initials */}
            <div className="w-8 h-8 rounded-full bg-brand-subtle flex items-center justify-center shrink-0">
              <span className="text-caption font-semibold text-[#2f8876]">
                {session.user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-body font-medium text-text-primary truncate leading-tight">
                {session.user.name}
              </span>
              <span className="text-caption text-text-secondary capitalize leading-tight">
                {session.user.role}
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
