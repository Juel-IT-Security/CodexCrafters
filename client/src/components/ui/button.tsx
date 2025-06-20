// Button component - flexible, accessible button with multiple variants and sizes
// Demonstrates class-variance-authority for type-safe styling variants and Radix Slot pattern
// 📖 Learn more: /docs/tutorials/frontend/understanding-ui-components.md

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Define button variants using class-variance-authority (cva)
// This creates type-safe styling variants that can be combined
const buttonVariants = cva(
  // Base styles applied to all buttons - accessibility, transitions, icon handling
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      // Visual style variants - different use cases and contexts
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90", // Primary action button
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90", // Delete/danger actions
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground", // Secondary actions
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80", // Less prominent actions
        ghost: "hover:bg-accent hover:text-accent-foreground", // Minimal styling, used in navigation
        link: "text-primary underline-offset-4 hover:underline", // Link-like appearance
      },
      // Size variants for different contexts
      size: {
        default: "h-10 px-4 py-2", // Standard button size
        sm: "h-9 rounded-md px-3", // Compact buttons for tight spaces
        lg: "h-11 rounded-md px-8", // Prominent call-to-action buttons
        icon: "h-10 w-10", // Square buttons for icons only
      },
    },
    // Default variants when none specified
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
