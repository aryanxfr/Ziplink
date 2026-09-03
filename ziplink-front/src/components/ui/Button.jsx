import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

const VARIANTS = {
  primary:
    "bg-primary text-white hover:bg-primary-hover shadow-soft",
  accent:
    "bg-accent text-white hover:bg-[#455a26] shadow-soft",
  outline:
    "border border-border bg-transparent text-heading hover:border-primary hover:text-primary",
  ghost:
    "bg-transparent text-body hover:bg-black/5 hover:text-heading",
  danger:
    "bg-danger text-white hover:bg-danger-hover shadow-soft",
};

const SIZES = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2",
};

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      className,
      icon: Icon,
      iconPosition = "left",
      isLoading = false,
      disabled = false,
      as = "button",
      href,
      target,
      rel,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      "inline-flex items-center justify-center rounded-2xl font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap",
      VARIANTS[variant],
      SIZES[size],
      className
    );

    const content = (
      <>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isLoading && Icon && iconPosition === "left" && <Icon className="h-4 w-4" />}
        {children}
        {!isLoading && Icon && iconPosition === "right" && <Icon className="h-4 w-4" />}
      </>
    );

    // Render as anchor tag when as="a" or href is provided
    if (as === "a" || href) {
      return (
        <motion.a
          ref={ref}
          href={href}
          target={target}
          rel={rel}
          whileHover={disabled || isLoading ? {} : { y: -1 }}
          whileTap={disabled || isLoading ? {} : { scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className={classes}
          {...props}
        >
          {content}
        </motion.a>
      );
    }

    return (
      <motion.button
        ref={ref}
        whileHover={disabled || isLoading ? {} : { y: -1 }}
        whileTap={disabled || isLoading ? {} : { scale: 0.97 }}
        transition={{ duration: 0.15 }}
        disabled={disabled || isLoading}
        className={classes}
        {...props}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
