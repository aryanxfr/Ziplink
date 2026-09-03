import { Search, X } from "lucide-react";

export default function SearchInput({ value, onChange, placeholder = "Search…", className }) {
  return (
    <div className={`relative ${className || ""}`}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-body/60" />
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-2xl border border-border bg-surface pl-10 pr-9 text-sm text-heading placeholder:text-body/60 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
      />
      {value && (
        <button
          onClick={() => onChange?.("")}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-body/60 hover:text-heading"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
