import { RefObject, useEffect, useState } from "react";

/// A hook to get the component width of a Ref to a `HTMLElement`.
export function useComponentWidthOf(ref: RefObject<HTMLElement | null>) {
  // The state.
  const [parentWidth, setParentWidth] = useState(0);
  useEffect(() => {
    // If the ref is null, we do nothing
    if (ref.current) {
      // Create the observer
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setParentWidth(entry.contentRect.width);
        }
      });

      // Initialize
      resizeObserver.observe(ref.current);

      // Disconnect the observer on disconnect
      return () => resizeObserver.disconnect();
    }
  }, [ref]);
  return parentWidth;
}
