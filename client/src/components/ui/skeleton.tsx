// Skeleton component - loading placeholder with pulse animation
// Demonstrates loading state patterns and CSS animations
// 📖 Learn more: /docs/tutorials/frontend/understanding-loading-states.md

import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
