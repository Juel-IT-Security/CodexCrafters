// Label component - accessible form labels with Radix UI primitives
// Demonstrates Radix UI integration and peer-based state styling

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Label variant styles - includes peer state handling for associated form elements
const labelVariants = cva(
  // Base label styles with peer-disabled handling for accessibility
  // "peer-disabled" targets sibling elements with disabled state
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

// Label component built on Radix UI Label primitive for proper accessibility
// Radix provides semantic HTML and ARIA attributes automatically
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props} // Includes proper htmlFor and aria attributes from Radix
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
