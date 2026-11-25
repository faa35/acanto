"use client";

import Link from "next/link";
import cn from "classnames";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import SunIcon from "./lottie-ui/sun-icon";
import MoonIcon from "./lottie-ui/moon-icon";
import { Footer, AiChatButton } from "@/components/cards";

const LINKS = [{ href: "/projects", label: "Projects" }];

/** Sun / moon switch (the same animated icons as before), used at the bottom of the sidebar. */
function ThemeSwitch({ id }: { id: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isLight = mounted && resolvedTheme === "light";

  return (
    <div className="relative flex w-fit items-center rounded-full border-2 border-[var(--border)] p-1">
      <span
        aria-hidden
        className={cn(
          "absolute bottom-1 top-1 w-11 rounded-full bg-[var(--panel)] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          isLight ? "translate-x-0" : "translate-x-11"
        )}
      />
      <button
        type="button"
        aria-label="Light theme"
        aria-pressed={isLight}
        onClick={() => setTheme("light")}
        className="relative z-10 flex h-10 w-11 items-center justify-center"
      >
        {/* icons depend on the theme, so only draw them after mount (avoids a hydration mismatch) */}
        <span className="scale-[0.8]">{mounted && <SunIcon name={`SunIcon-${id}`} />}</span>
      </button>
      <button
        type="button"
        aria-label="Dark theme"
        aria-pressed={!isLight}
        onClick={() => setTheme("dark")}
        className="relative z-10 flex h-10 w-11 items-center justify-center"
      >
        <span className="scale-[0.8]">{mounted && <MoonIcon name={`MoonIcon-${id}`} />}</span>
      </button>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Siuuu, home">
      <img
        src="/discord/avatar.png"
        alt=""
        className="media-muted h-7 w-7 rounded-full border-2 border-[var(--border)] object-cover"
      />
      <span className="text-[24px] leading-none text-[var(--text)]">Siuuu</span>
    </Link>
  );
}

function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav className={className}>
      {LINKS.map((l) => {
        const active = pathname?.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "text-[19px] leading-none transition-colors duration-300",
              active ? "text-[var(--text)]" : "text-[var(--muted)] hover:text-[var(--text)]"
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * Page frame like the old site: a quiet sidebar on the left (name, links,
 * theme switch at the bottom) and the content grid on the right.
 * On narrow screens the sidebar turns into a top bar.
 */
export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-8 min-[1024px]:grid min-[1024px]:grid-cols-[180px_minmax(0,1fr)] min-[1024px]:gap-10 min-[1280px]:grid-cols-[220px_minmax(0,1fr)]">
      {/* sidebar (desktop) */}
      <aside className="hidden min-[1024px]:block">
        <div className="sticky top-0 flex h-screen flex-col justify-between py-12">
          <div className="flex flex-col gap-5">
            <Brand />
            <NavLinks className="flex flex-col gap-3.5 pl-[38px]" />
          </div>
          <ThemeSwitch id="side" />
        </div>
      </aside>

      {/* top bar (phones / small tablets) */}
      <header className="sticky top-0 z-50 -mx-4 mb-4 flex items-center justify-between border-b-2 border-[var(--border)] bg-[var(--bg)] px-4 py-3 sm:-mx-8 sm:px-8 min-[1024px]:hidden">
        <Brand />
        <div className="flex items-center gap-5">
          <NavLinks className="flex items-center gap-4" />
          <ThemeSwitch id="top" />
        </div>
      </header>

      <div className="min-w-0 min-[1024px]:pt-12">
        {children}
        <Footer />
      </div>

      <AiChatButton />
    </div>
  );
}
