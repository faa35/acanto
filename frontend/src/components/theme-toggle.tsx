"use client"

import { useEffect, useState } from "react";
import cn from "classnames";
import SunIcon from "./lottie-ui/sun-icon";
import MoonIcon from "./lottie-ui/moon-icon";
import { useTheme } from "next-themes";
import CardWrapper from "./cards/card-wrapper";

const ThemeToggle = ({ compact = false }: { compact?: boolean }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isLightMode = mounted && resolvedTheme === "light";

  return (
    <CardWrapper>
      <div className={cn("flex h-full flex-col justify-between gap-3", compact ? "p-1" : "p-3")}>
        {!compact && (
          <p className="px-2 pt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
            Appearance
          </p>
        )}
        <div className="relative flex flex-1 items-stretch rounded-[20px] bg-[var(--border)] p-1">
          {/* sliding thumb */}
          <span
            aria-hidden
            className={cn(
              "absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-[16px] bg-[var(--bg-elevated)] shadow-[0_4px_14px_-4px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
              isLightMode ? "translate-x-0" : "translate-x-full"
            )}
          />
          <button
            type="button"
            aria-label="Light theme"
            aria-pressed={isLightMode}
            className="relative z-10 flex flex-1 items-center justify-center"
            onClick={() => setTheme("light")}
          >
            <SunIcon />
          </button>
          <button
            type="button"
            aria-label="Dark theme"
            aria-pressed={!isLightMode}
            className="relative z-10 flex flex-1 items-center justify-center"
            onClick={() => setTheme("dark")}
          >
            <MoonIcon />
          </button>
        </div>
      </div>
    </CardWrapper>
  )
}

export default ThemeToggle
