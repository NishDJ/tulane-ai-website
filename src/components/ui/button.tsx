import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tulane-green focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 min-h-[44px] touch-manipulation",
  {
    variants: {
      variant: {
        default:
          "bg-tulane-green text-white shadow hover:bg-tulane-green/90 hover:scale-[1.02] active:scale-[0.98] active:bg-tulane-green/80",
        secondary:
          "border border-tulane-green bg-transparent text-tulane-green hover:bg-tulane-green hover:text-white hover:scale-[1.02] active:scale-[0.98] active:bg-tulane-green/90",
        outline:
          "border-2 border-current bg-transparent hover:bg-current hover:text-white hover:scale-[1.02] active:scale-[0.98] active:bg-current/90",
        ghost:
          "text-tulane-green hover:bg-tulane-green/10 hover:text-tulane-green active:bg-tulane-green/20",
        link: "text-tulane-green underline-offset-4 hover:underline active:text-tulane-green/80",
      },
      size: {
        default: "h-11 px-4 py-2 sm:h-10",
        sm: "h-9 rounded-md px-3 text-xs sm:h-8",
        lg: "h-14 rounded-lg px-6 text-base sm:h-12 sm:px-8",
        icon: "h-11 w-11 sm:h-10 sm:w-10",
        touch: "h-12 px-6 text-base sm:h-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };