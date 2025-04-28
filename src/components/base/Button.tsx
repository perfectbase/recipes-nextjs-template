import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "rounded-full font-medium transition-colors cursor-pointer inline-flex items-center justify-center";

    const variants = {
      default:
        "bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]",
      outline:
        "border border-solid border-black/[.08] hover:border-transparent hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]",
      ghost: "hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]",
    };

    const sizes = {
      default: "h-10 px-4 text-sm",
      sm: "h-8 px-3 text-xs",
      lg: "h-12 px-6 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          (disabled || isLoading) && "cursor-not-allowed opacity-50",
          className,
        )}
        {...props}
      >
        {isLoading ? "Please wait..." : children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
