"use client";

import { ReactNode, useRef, PointerEvent, HTMLAttributes } from "react";
import cn from "classnames";

interface CardWrapperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  /** Show the cursor-following glow on hover */
  spotlight?: boolean;
}

/**
 * Base surface for every tile in the bento grid.
 * Glassy surface, hairline border, and a soft spotlight that follows the cursor.
 */
export default function CardWrapper({
  children,
  className,
  spotlight = true,
  ...rest
}: CardWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={spotlight ? onPointerMove : undefined}
      className={cn(
        "group relative h-full w-full overflow-hidden rounded-[28px]",
        "border border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl",
        "shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_10px_30px_-12px_rgba(0,0,0,0.25)]",
        "transition-[border-color,background-color,transform,box-shadow] duration-500 ease-out",
        "hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)]",
        className
      )}
      {...rest}
    >
      {spotlight && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), var(--spotlight), transparent 45%)",
          }}
        />
      )}
      <div className="relative z-[1] h-full">{children}</div>
    </div>
  );
}
