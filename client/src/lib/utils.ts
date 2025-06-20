// Utility functions for the application
// This file demonstrates common utility patterns and class name management

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function to combine and merge CSS classes intelligently
// This prevents class conflicts and ensures proper Tailwind class precedence
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
