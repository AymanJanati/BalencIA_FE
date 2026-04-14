// components/ui/Card.tsx — Base card container

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "bordered" | "hover" | "glass" | "gradient";
  padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({
  children,
  className,
  variant = "default",
  padding = "md",
  ...props
}: CardProps) {
  const paddingClasses = {
    none: "p-0",
    sm: "p-4",
    md: "p-5",
    lg: "p-8",
  };

  const variantClasses = {
    default: "bg-background-primary border shadow-[0_2px_12px_rgba(0,0,0,0.02)]",
    bordered: "bg-background-primary border",
    hover:
      "bg-background-primary border shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] cursor-pointer",
    glass: "bg-white/70 backdrop-blur-md border border-white/50 shadow-[0_4px_24px_rgba(0,0,0,0.04)]",
    gradient: "bg-brand-subtle border border-brand/20 shadow-none",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border-border/80 relative overflow-hidden",
        paddingClasses[padding],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
