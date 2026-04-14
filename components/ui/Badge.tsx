// components/ui/Badge.tsx — low / medium / high risk badge

import type { RiskLevel } from "@/types";
import { RISK_LABELS, RISK_BADGE_STYLES } from "@/lib/constants";

interface BadgeProps {
  level: RiskLevel;
  className?: string;
}

export default function Badge({ level, className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-semibold",
        RISK_BADGE_STYLES[level],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {RISK_LABELS[level]}
    </span>
  );
}
