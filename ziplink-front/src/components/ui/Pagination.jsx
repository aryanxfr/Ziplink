import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn";

export default function Pagination({ page = 1, totalPages = 1, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  const items = [];
  let prev = 0;
  for (const p of pages) {
    if (p - prev > 1) items.push("…" + p);
    items.push(p);
    prev = p;
  }

  return (
    <div className="flex items-center justify-center gap-1.5">
      <button
        onClick={() => onPageChange?.(Math.max(1, page - 1))}
        disabled={page === 1}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-body hover:border-primary hover:text-primary disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {items.map((item, i) =>
        typeof item === "string" ? (
          <span key={i} className="px-1.5 text-sm text-body/60">
            ⋯
          </span>
        ) : (
          <button
            key={i}
            onClick={() => onPageChange?.(item)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium",
              item === page ? "bg-primary text-white" : "text-body hover:bg-black/5"
            )}
          >
            {item}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-body hover:border-primary hover:text-primary disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
