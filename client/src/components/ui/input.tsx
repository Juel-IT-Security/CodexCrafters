// Input component - styled form input with comprehensive accessibility
// Demonstrates forwardRef for form libraries and responsive design patterns

import * as React from "react"

import { cn } from "@/lib/utils"

// Input component with forwardRef for compatibility with form libraries like react-hook-form
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Comprehensive input styling including:
          // - Layout: flex, sizing, padding
          // - Visual: border, background, text sizing (responsive)
          // - File inputs: custom file button styling
          // - States: placeholder, focus, disabled
          // - Accessibility: focus rings, proper contrast
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref} // Forward ref for form library integration
        {...props} // Spread all native input props
      />
    )
  }
)
Input.displayName = "Input" // For better debugging in React DevTools

export { Input }
