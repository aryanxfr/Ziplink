import { cn } from "../../utils/cn";

export function Table({ children, className }) {
  return (
    <div className={cn("overflow-x-auto rounded-3xl border border-border bg-surface", className)}>
      <table className="w-full min-w-[640px] border-collapse text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }) {
  return <thead className="border-b border-border bg-background/50">{children}</thead>;
}

export function TBody({ children }) {
  return <tbody className="divide-y divide-border">{children}</tbody>;
}

export function TR({ children, className }) {
  return <tr className={cn("transition-colors hover:bg-background/40", className)}>{children}</tr>;
}

export function TH({ children, className }) {
  return (
    <th className={cn("px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-body/70", className)}>
      {children}
    </th>
  );
}

export function TD({ children, className }) {
  return <td className={cn("px-5 py-4 text-heading", className)}>{children}</td>;
}
