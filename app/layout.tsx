// app/layout.tsx — Root layout — font, global styles

import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "BalancIA",
  description: "AI-powered employee wellbeing platform",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
