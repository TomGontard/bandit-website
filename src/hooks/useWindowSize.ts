// src/hooks/useWindowSize.ts
import { useState, useEffect } from 'react';

interface Size {
  width: number;
  height: number;
}

/**
 * Custom hook to get the current window dimensions.
 * Falls back to { width: 0, height: 0 } during SSR.
 */
export default function useWindowSize(): Size {
  // Initialize state with SSR-friendly defaults
  const [windowSize, setWindowSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Remove listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures effect runs once on mount

  return windowSize;
}
