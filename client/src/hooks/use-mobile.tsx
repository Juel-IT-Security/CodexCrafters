// Custom hook for responsive design - detects mobile screen sizes
// Demonstrates media query handling and responsive state management patterns

import * as React from "react"

// Define breakpoint for mobile devices (768px is common tablet/mobile boundary)
const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // State to track whether we're on a mobile device
  // Starts as undefined to handle server-side rendering
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Create media query list to watch for screen size changes
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Function to update state when screen size changes
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Listen for changes in screen size
    mql.addEventListener("change", onChange)
    
    // Set initial state
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Cleanup: remove event listener when component unmounts
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Convert undefined to false for consistent boolean return
  return !!isMobile
}
