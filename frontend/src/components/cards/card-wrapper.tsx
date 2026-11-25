"use client";

import { ReactNode, HTMLAttributes } from "react";
import cn from "classnames";

interface CardWrapperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  /** kept for compatibility with older callers; cards are flat now */
  spotlight?: boolean;
}

/**
 * Base surface for every tile: flat paper colour, square corners and a
 * 2px border (like the old site). The border darkens slightly on hover.
 */
export default function CardWrapper({ children, className, spotlight: _spotlight, ...rest }: CardWrapperProps) {
  return (
    <div
      className={cn(
        "group relative h-full w-full overflow-hidden",
        "border-2 border-[var(--border)] bg-[var(--surface)]",
        "transition-colors duration-300 hover:border-[var(--border-strong)]",
        className
      )}
      {...rest}
    >
      <div className="relative h-full">{children}</div>
    </div>
  );
}
