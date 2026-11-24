"use client";

import Link from "next/link";
import cn from "classnames";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
];

const NavBarCard = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[60] flex justify-center px-4 pt-4">
      <nav
        className={cn(
          "flex w-full max-w-[1240px] items-center justify-between rounded-full border px-2 py-2 transition-all duration-500",
          scrolled
            ? "border-[var(--border)] bg-[var(--surface)] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.4)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        )}
      >
        <Link href="/" className="flex items-center gap-2.5 pl-1.5 pr-3" aria-label="Home">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--text)] font-serif text-[18px] italic text-[var(--bg)]">
            fa
          </span>
          <span className="hidden text-[14px] font-semibold text-[var(--text)] sm:block">Fardin Abdulla</span>
        </Link>

        <div className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 backdrop-blur-xl">
          {LINKS.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname?.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors duration-300",
                  active
                    ? "bg-[var(--text)] text-[var(--bg)]"
                    : "text-[var(--muted)] hover:text-[var(--text)]"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

export default NavBarCard;
