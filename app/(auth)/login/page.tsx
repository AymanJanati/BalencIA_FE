"use client";

// app/(auth)/login/page.tsx — Login screen

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/constants";
import type { UserRole } from "@/types";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  // Hackathon logic: select a role directly to mock the login
  const [selectedRole, setSelectedRole] = useState<UserRole>("employee");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    // Simulate minor network delay for realism
    setTimeout(() => {
      login(selectedRole);
      
      // Redirect based on role
      if (selectedRole === "employee") {
        router.push(ROUTES.checkin);
      } else {
        router.push(ROUTES.manager);
      }
    }, 600);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background-secondary p-4">
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand rounded-full opacity-[0.04] blur-[100px] pointer-events-none" />

      <Card padding="lg" className="w-full max-w-md relative z-10 border-border/60 shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center mb-4 text-white font-bold text-2xl shadow-sm cursor-default select-none">
            B
          </div>
          <h1 className="text-page-title text-text-primary mb-2 text-center">
            Welcome to BalencIA
          </h1>
          <p className="text-body text-text-secondary text-center">
            Log in to manage your wellbeing.
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-body font-medium text-text-primary">Email address</label>
            <input 
              type="email" 
              placeholder="demo@balencia.ai"
              defaultValue="demo@balencia.ai"
              required
              className="w-full px-4 py-3 rounded-input border border-border focus:outline-none focus:ring-2 focus:ring-[#2f8876]/20 focus:border-[#2f8876] transition-colors bg-background-primary text-text-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-body font-medium text-text-primary">Select Demo Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("employee")}
                className={`py-3 px-4 rounded-input border text-body font-semibold transition-all duration-200 text-center ${
                  selectedRole === "employee" 
                    ? "bg-brand-subtle border-[#2f8876] text-[#2f8876] shadow-sm" 
                    : "bg-background-primary border-border text-text-secondary hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                Employee
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("manager")}
                className={`py-3 px-4 rounded-input border text-body font-semibold transition-all duration-200 text-center ${
                  selectedRole === "manager" 
                    ? "bg-brand-subtle border-[#2f8876] text-[#2f8876] shadow-sm" 
                    : "bg-background-primary border-border text-text-secondary hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                Manager
              </button>
            </div>
            <span className="text-caption text-text-secondary mt-1">
              (Hackathon feature to easily switch between flows)
            </span>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full justify-center"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Authenticating..." : `Login as ${selectedRole === "employee" ? "Employee" : "Manager"}`}
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
