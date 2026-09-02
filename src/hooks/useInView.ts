import { useEffect, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';

export interface UseInViewOptions {
  /** Fraction of the element that must be visible before firing. */
  threshold?: number;
  /** Margin applied to the root box before computing intersections. */
  rootMargin?: string;
  /** Stop observing after the first intersection. Defaults to true. */
  once?: boolean;
}

export interface UseInViewResult<T extends HTMLElement> {
  ref: MutableRefObject<T | null>;
  inView: boolean;
}

/**
 * Observes an element and reports whether it has entered the viewport.
 * Used to trigger the flow-line draw animation.
 */
export function useInView<T extends HTMLElement>({
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px',
  once = true,
}: UseInViewOptions = {}): UseInViewResult<T> {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState<boolean>(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) {
          return;
        }
        if (entry.isIntersecting) {
          setInView(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}

export default useInView;
