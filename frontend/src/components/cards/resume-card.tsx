"use client";

import cn from "classnames";
import { FiArrowUpRight } from "react-icons/fi";
import CardWrapper from "./card-wrapper";
import { useActive } from "@/lib/use-active";

const RESUME = "/Fardin_Abdulla_Coop_Resume.pdf";

/** A little line-art sheet of paper (same thin-stroke style as the figures). */
function Sheet({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 120 150"
      aria-hidden
      className={cn(
        "absolute -bottom-8 -right-1 h-[58%] max-h-[150px] origin-bottom-right transition-transform duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)]",
        active ? "-translate-y-3 rotate-0" : "rotate-[8deg]"
      )}
      fill="none"
      strokeLinecap="round"
    >
      {/* a second sheet peeking out behind */}
      <rect
        x="14" y="12" width="98" height="132" rx="3"
        fill="var(--fig-body)" stroke="var(--fig-stroke)" strokeWidth={1.2}
        vectorEffect="non-scaling-stroke"
        className={cn("transition-transform duration-500", active ? "translate-x-[6px] rotate-[4deg]" : "")}
        style={{ transformBox: "fill-box", transformOrigin: "bottom left" }}
      />
      {/* front sheet with a folded corner */}
      <path
        d="M6 6 H86 L106 26 V142 a3 3 0 0 1 -3 3 H9 a3 3 0 0 1 -3 -3 Z"
        fill="var(--fig-fill)" stroke="var(--fig-stroke)" strokeWidth={1.3}
        vectorEffect="non-scaling-stroke"
      />
      <path d="M86 6 V23 a3 3 0 0 0 3 3 H106" stroke="var(--fig-stroke)" strokeWidth={1.3} vectorEffect="non-scaling-stroke" />
      {/* name + contact line */}
      <rect x="18" y="20" width="46" height="7" rx="2" fill="var(--fig-prop)" />
      <rect x="18" y="32" width="30" height="3.5" rx="1.75" fill="var(--fig-prop-2)" />
      {/* sections of "text" */}
      {[50, 86, 118].map((y, s) => (
        <g key={y}>
          <rect x="18" y={y} width="22" height="4" rx="2" fill="var(--fig-prop)" />
          {[0, 1, 2].slice(0, s === 2 ? 2 : 3).map((i) => (
            <rect
              key={i}
              x="18"
              y={y + 9 + i * 7}
              width={[78, 66, 72][i]}
              height="3"
              rx="1.5"
              fill="var(--fig-prop-2)"
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

/**
 * Resume card: the whole card opens the PDF (no separate buttons).
 * A sheet of paper sits in the corner and lifts up when hovered.
 */
const ResumeCard = () => {
  const { ref, active, handlers } = useActive<HTMLAnchorElement>();

  return (
    <CardWrapper>
      <a
        ref={ref}
        {...handlers}
        href={RESUME}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open my resume (PDF)"
        className="relative flex h-full w-full flex-col justify-between overflow-hidden p-5 sm:p-6"
      >
        <div className="relative z-[1]">
          <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--muted)]">2025 · CV</p>
          <p className="mt-1 font-serif text-[34px] leading-none text-[var(--text)] sm:text-[40px]">Resume</p>
        </div>

        <span
          className={cn(
            "relative z-[1] inline-flex w-fit items-center gap-1 text-[13px] transition-colors duration-300",
            active ? "text-[var(--text)]" : "text-[var(--muted)]"
          )}
        >
          Open PDF
          <FiArrowUpRight className={cn("h-4 w-4 transition-transform duration-300", active && "-translate-y-0.5 translate-x-0.5")} />
        </span>

        <Sheet active={active} />
      </a>
    </CardWrapper>
  );
};

export default ResumeCard;
