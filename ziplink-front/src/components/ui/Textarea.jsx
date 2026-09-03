import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Textarea = forwardRef(({ label, error, hint, rows = 4, className, id, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-heading">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={cn(
          "w-full rounded-2xl border bg-surface px-4 py-3 text-sm text-heading placeholder:text-body/60 transition-all duration-200 resize-none",
          "focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10",
          error ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-body/80">{hint}</p>}
    </div>
  );
});

Textarea.displayName = "Textarea";
export default Textarea;
