// Toaster component - renders the toast notification system
// Demonstrates integration between custom hooks and UI components

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  // Get current toasts from our custom hook
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {/* Render each toast with its content and actions */}
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {/* Conditionally render title and description */}
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {/* Optional action button (like "Undo") */}
            {action}
            {/* Close button for manual dismissal */}
            <ToastClose />
          </Toast>
        )
      })}
      {/* Viewport defines where toasts appear on screen */}
      <ToastViewport />
    </ToastProvider>
  )
}
