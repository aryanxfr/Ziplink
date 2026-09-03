import { cn } from "../../utils/cn";

const VARIANTS = {
  success: "bg-primary/10 text-accent",
  neutral: "bg-black/5 text-body",
  danger: "bg-danger/10 text-danger",
  warning: "bg-[#C6954D]/10 text-[#93701F]",
};

export default function Badge({ children, variant = "neutral", className, dot = false }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        VARIANTS[variant],
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
