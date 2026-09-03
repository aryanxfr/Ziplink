import { cn } from "../../utils/cn";

export default function Section({ children, className, id }) {
  return (
    <section id={id} className={cn("mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:py-28", className)}>
      {children}
    </section>
  );
}

export function SectionHeading({ eyebrow, title, description, align = "center" }) {
  return (
    <div className={cn("mb-14 max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      {eyebrow && (
        <span className="mb-3 inline-block rounded-full bg-primary/10 px-3.5 py-1 text-xs font-medium text-accent">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-semibold text-balance text-heading sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-balance text-base leading-relaxed text-body">{description}</p>}
    </div>
  );
}
