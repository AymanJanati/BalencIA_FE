"use client";

// components/ui/TextArea.tsx — Optional note input

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

export default function TextArea({ label, hint, className = "", ...props }: TextAreaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-body font-medium text-text-primary">{label}</label>
      )}
      <textarea
        rows={3}
        className={[
          "w-full rounded-input border border-border bg-background-primary px-4 py-3",
          "text-body text-text-primary placeholder:text-text-secondary",
          "resize-none transition-all duration-200",
          "focus:outline-none focus:border-[#2f8876] focus:ring-2 focus:ring-[#2f8876]/10",
          "hover:border-[#2f8876]/40",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {hint && (
        <span className="text-caption text-text-secondary">{hint}</span>
      )}
    </div>
  );
}
