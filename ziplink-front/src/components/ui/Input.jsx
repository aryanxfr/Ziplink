import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../utils/cn";

const Input = forwardRef(
  ({ label, error, hint, icon: Icon, type = "text", className, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || props.name;
    const isPassword = type === "password";
    const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-heading">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-body/70" />
          )}
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            className={cn(
              "h-11 w-full rounded-2xl border bg-surface px-4 text-sm text-heading placeholder:text-body/60 transition-all duration-200",
              "focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10",
              Icon && "pl-10.5",
              isPassword && "pr-11",
              error ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-body/70 hover:text-heading"
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
        {!error && hint && <p className="mt-1.5 text-xs text-body/80">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
