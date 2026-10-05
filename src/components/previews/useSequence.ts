"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const reducedQuery = "(prefers-reduced-motion: reduce)";

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = matchMedia(reducedQuery);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => matchMedia(reducedQuery).matches,
    () => false,
  );
}

/** True while the element is at least partly on screen (works inside CSS transforms too). */
export function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView] as const;
}

/**
 * Steps through a scripted animation: step i is shown for durations[i] ms, then the
 * sequence loops. Pauses while offscreen; with reduced motion it rests on `restStep`.
 */
export function useSequence(durations: number[], active: boolean, restStep = durations.length - 1): number {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const running = active && !reduced;

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setStep((s) => (s + 1) % durations.length), durations[step]);
    return () => clearTimeout(t);
  }, [running, step, durations]);

  return reduced ? restStep : step;
}
