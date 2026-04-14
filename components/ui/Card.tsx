// components/ui/Card.tsx — Base card container

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "bordered" | "hover";
  padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({
  children,
  className = "",
  variant = "default",
  padding = "md",
}: CardProps) {
  const paddingClasses = {
    none: "p-0",
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
  };

  const variantClasses = {
    default: "bg-background-primary border border-border shadow-card",
    bordered: "bg-background-primary border-2 border-border",
    hover:
      "bg-background-primary border border-border shadow-card transition-shadow duration-200 hover:shadow-md cursor-pointer",
  };

  return (
    <div
      className={[
        "rounded-card",
        paddingClasses[padding],
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
