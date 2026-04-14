// components/layout/AppLayout.tsx — Sidebar + Topbar + content wrapper

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

interface AppLayoutProps {
  children: React.ReactNode;
  /** Page title forwarded to Topbar */
  pageTitle?: string;
  /** Optional topbar right-side actions */
  topbarActions?: React.ReactNode;
}

export default function AppLayout({
  children,
  pageTitle,
  topbarActions,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Fixed Topbar — offset by sidebar width */}
      <Topbar title={pageTitle} actions={topbarActions} />

      {/* Main content — offset sidebar + topbar */}
      <main className="pl-sidebar pt-topbar">
        <div className="max-w-[1280px] mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
