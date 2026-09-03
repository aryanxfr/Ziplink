import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export default function Card({ children, className, hover = false, as: Component = "div", ...props }) {
  const Comp = hover ? motion.div : Component;
  const hoverProps = hover
    ? { whileHover: { y: -4 }, transition: { duration: 0.2 } }
    : {};
  return (
    <Comp
      className={cn(
        "rounded-3xl border border-border bg-surface p-6 shadow-soft",
        hover && "transition-shadow duration-200 hover:shadow-soft-lg cursor-pointer",
        className
      )}
      {...hoverProps}
      {...props}
    >
      {children}
    </Comp>
  );
}
