import NextLink from "next/link";
import { forwardRef, type AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  href: string;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      children,
      href,
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
      <NextLink
        href={href}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </NextLink>
    );
  },
);

Link.displayName = "Link";

export { Link };
