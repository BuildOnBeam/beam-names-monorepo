'use client';

import { RefObject, useState, useEffect } from 'react';

/**
 * A custom React hook that determines whether a referenced element is in a "sticky" state.
 * The "sticky" state is defined as the element's intersection ratio being less than 1,
 * which typically occurs when the element is partially or fully out of view.
 *
 * @param ref - A React ref object pointing to the DOM element to observe.
 *              The element can be `null` or an `Element`.
 * @returns A boolean value indicating whether the element is in a "sticky" state.
 *
 * @remarks It's important that the sticky element is at least 1px outside of the viewport,
 *         as the IntersectionObserver API does not trigger when the element is at the edge.
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const isSticky = useSticky(ref);
 *
 * return (
 *   <div ref={ref} style={{ position: isSticky ? 'fixed' : 'static' }}>
 *     Sticky Header
 *   </div>
 * );
 * ```
 */
export const useSticky = (ref: RefObject<Element | null>) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(entry.intersectionRatio < 1),
      { threshold: [1] },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return isSticky;
};
