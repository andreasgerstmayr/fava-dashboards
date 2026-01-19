import { RefObject, useEffect, useState } from "react";

interface Rect {
  width: number;
  height: number;
}

export function useResizeObserver(ref: RefObject<HTMLElement | null>) {
  const [rect, setRect] = useState<Rect | undefined>(undefined);

  useEffect(() => {
    if (ref.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setRect({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      });
      resizeObserver.observe(ref.current);
      return () => resizeObserver.disconnect();
    }
  }, [ref]);

  return rect;
}
