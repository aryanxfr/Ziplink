import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

function useAnimatedCount(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    const numTarget = typeof target === "number" ? target : parseInt(target, 10);
    if (isNaN(numTarget)) {
      setCount(target); 
      return;
    }

    const start = prevTarget.current;
    const diff = numTarget - start;
    if (diff === 0) return;

    const startTime = performance.now();

    let raf;
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + diff * eased));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      } else {
        prevTarget.current = numTarget;
      }
    };
    raf = requestAnimationFrame(step);

    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return count;
}

export default function StatsCard({ label, value, icon: Icon, trend, className }) {
  const animatedValue = useAnimatedCount(value);
  const displayValue = typeof value === "number" ? animatedValue.toLocaleString() : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -3 }}
      className={cn("rounded-3xl border border-border bg-surface p-6 shadow-soft", className)}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-body">{label}</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-heading">{displayValue}</p>
        </div>
        {Icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-accent">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {trend && (
        <p className={cn("mt-3 text-xs font-medium", trend.positive ? "text-accent" : "text-danger")}>
          {trend.positive ? "↑" : "↓"} {trend.value}{" "}
          <span className="font-normal text-body/70">{trend.label}</span>
        </p>
      )}
    </motion.div>
  );
}
