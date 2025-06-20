// Badge component - small status indicators and labels
// Demonstrates semantic color variants and compact design patterns
// 📖 Learn more: /docs/tutorials/frontend/understanding-ui-components.md

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Badge variant styles using class-variance-authority
// Badges are small, rounded indicators for status, categories, or counts
const badgeVariants = cva(
  // Base badge styles - compact, rounded, with focus states for accessibility
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Primary badge - most common, for important status or main categories
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        // Secondary badge - less prominent, for additional information
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // Destructive badge - for warnings, errors, or critical status
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        // Outline badge - minimal style, good for subtle labeling
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Badge component props interface extending HTML div attributes
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

// Badge component implementation - simple div with variant-based styling
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
