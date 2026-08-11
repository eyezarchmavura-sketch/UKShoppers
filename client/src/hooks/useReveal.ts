/**
 * Scroll-reveal hook — IntersectionObserver wrapper.
 * Adds `.revealed` to each `.reveal-up` child when it enters the viewport,
 * with optional per-child stagger via `data-reveal-delay` attributes.
 * Respects prefers-reduced-motion: if motion is reduced, elements are
 * revealed immediately with no transition delay.
 */
import { useEffect, useRef } from "react";

export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) {
      // No motion: reveal everything immediately
      root.classList.add("revealed");
      root
        .querySelectorAll<HTMLElement>(".reveal-up")
        .forEach((el) => el.classList.add("revealed"));
      return;
    }

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>(".reveal-up")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return ref;
}
