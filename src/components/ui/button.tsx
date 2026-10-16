import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium uppercase tracking-wide transition-[background-color,border-color,box-shadow,color,filter] duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-white hover:shadow-[0_0_40px_-6px_rgba(111,163,255,0.7)]",
        outline:
          "border border-white/20 bg-transparent text-foreground hover:border-white/40 hover:bg-white/5",
        glow:
          "bg-gradient-to-r from-favx-blue to-favx-orange text-white shadow-[0_0_30px_-8px_rgba(255,60,0,0.8)] hover:shadow-[0_0_50px_-6px_rgba(255,60,0,0.9)] hover:brightness-110",
        ghost: "text-foreground hover:bg-white/5",
        dark: "bg-[#0a0b1a] text-white hover:bg-favx-blue",
        outlineDark:
          "border border-black/15 bg-transparent text-[#0a0b1a] hover:border-black/40 hover:bg-black/[0.03]",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-9 text-[15px]",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
