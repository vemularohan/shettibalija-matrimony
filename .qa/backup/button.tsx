import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-[transform,background-color,border-color,color] duration-150 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#24103F] text-white hover:bg-[#311552] active:bg-[#1B0C30] font-semibold",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-[#D8D0C7] text-[#24103F] bg-white hover:border-[#24103F]/50 hover:bg-[#F7F3EA] dark:border-purple-300/40 dark:text-purple-300 dark:bg-transparent",
        secondary:
          "border border-[#24103F]/30 text-[#24103F] bg-transparent hover:bg-[#24103F]/5 dark:border-purple-300 dark:text-purple-300 font-medium",
        premium: "bg-[#24103F] text-white border border-[#24103F] hover:bg-[#311552] font-semibold",
        purple: "bg-[#24103F] text-white hover:bg-[#311552] font-medium",
        ghost:
          "hover:bg-[#32105F]/10 hover:text-[#32105F] dark:hover:bg-purple-950/40 dark:hover:text-purple-300",
        link: "text-[#087333] underline-offset-4 hover:underline font-medium",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
