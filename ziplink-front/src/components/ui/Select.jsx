import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../utils/cn";

export default function Select({ label, options = [], value, onChange, placeholder = "Select…", error, className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="w-full" ref={ref}>
      {label && <label className="mb-1.5 block text-sm font-medium text-heading">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-2xl border bg-surface px-4 text-sm transition-all duration-200",
            "focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10",
            error ? "border-danger" : "border-border",
            selected ? "text-heading" : "text-body/60",
            className
          )}
        >
          <span>{selected ? selected.label : placeholder}</span>
          <ChevronDown className={cn("h-4 w-4 text-body/70 transition-transform", open && "rotate-180")} />
        </button>
        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-2xl border border-border bg-surface p-1.5 shadow-soft-lg"
            >
              {options.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange?.(opt.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm hover:bg-background",
                      opt.value === value ? "text-accent font-medium" : "text-heading"
                    )}
                  >
                    {opt.label}
                    {opt.value === value && <Check className="h-4 w-4" />}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
