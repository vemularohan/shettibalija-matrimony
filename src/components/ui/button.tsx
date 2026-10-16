import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#087A32] text-white shadow-sm hover:bg-[#045522] active:bg-[#03441b] font-medium",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-[#32105F]/35 text-[#32105F] bg-white hover:bg-[#32105F]/5 dark:border-purple-300/40 dark:text-purple-300 dark:bg-transparent",
        secondary:
          "border border-[#32105F] text-[#32105F] bg-transparent hover:bg-[#32105F]/10 dark:border-purple-300 dark:text-purple-300 font-medium",
        premium:
          "bg-[#32105F] text-[#F3D36A] border border-[#D9A514]/60 hover:bg-[#21083F] shadow-sm font-semibold",
        purple: "bg-[#32105F] text-white shadow-sm hover:bg-[#21083F] font-medium",
        ghost:
          "hover:bg-[#32105F]/10 hover:text-[#32105F] dark:hover:bg-purple-950/40 dark:hover:text-purple-300",
        link: "text-[#087A32] underline-offset-4 hover:underline font-medium",
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
