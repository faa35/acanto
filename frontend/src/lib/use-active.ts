"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "Hover state" that also works on touch screens.
 *
 * - Mouse / trackpad: active while the pointer is over the element.
 * - Touch devices (no hover): active while the element sits in the middle of
 *   the viewport, so the hover animations still play as people scroll.
 */
export function useActive<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(false);
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (canHover || !ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "-25% 0px -25% 0px", threshold: 0 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [canHover]);

  const handlers = canHover
    ? {
        onPointerEnter: () => setActive(true),
        onPointerLeave: () => setActive(false),
      }
    : {};

  return { ref, active, handlers };
}

/** True once the element has come close to the viewport (used to lazy-preload heavy assets). */
export function useNearViewport<T extends HTMLElement = HTMLDivElement>(margin = "300px") {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (!ref.current || near) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: margin }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [near, margin]);

  return { ref, near };
}
