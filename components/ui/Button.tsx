// components/ui/Button.tsx — primary / secondary / ghost variants

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-button transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizes = {
    sm: "h-8 px-3 text-caption gap-1.5",
    md: "h-10 px-5 text-body gap-2",
    lg: "h-12 px-7 text-[15px] gap-2",
  };

  const variants = {
    // Gradient CTA — brand identity
    primary:
      "bg-brand text-white hover:bg-brand-hover focus-visible:ring-[#2f8876] shadow-sm hover:shadow-md active:scale-[0.98]",
    // Border-based secondary
    secondary:
      "bg-background-primary text-text-primary border border-border hover:bg-background-secondary focus-visible:ring-border active:scale-[0.98]",
    // Minimal ghost
    ghost:
      "bg-transparent text-text-secondary hover:text-text-primary hover:bg-background-secondary focus-visible:ring-border",
  };

  return (
    <button
      disabled={disabled}
      className={[base, sizes[size], variants[variant], className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
