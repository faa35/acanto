"use client";

import { FiFileText } from "react-icons/fi";
import Download from "../lottie-ui/download-icon";
import SendIcon from "../lottie-ui/send-icon";
import CardWrapper from "./card-wrapper";

/** Original resume box with the animated (Lottie) download + view buttons. */
const ResumeCard = () => {
  return (
    <CardWrapper>
      <div className="relative flex h-full items-center justify-between gap-2 px-4 py-4 sm:px-8">
        <FiFileText
          aria-hidden
          className="pointer-events-none absolute -bottom-4 left-1/2 h-24 w-24 rotate-12 text-[var(--text)] opacity-[0.04] transition-transform duration-700 group-hover:rotate-0 group-hover:scale-110"
        />
        <div className="relative flex min-w-0 flex-col items-start gap-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">2025 CV</p>
          <p className="text-[18px] font-semibold uppercase leading-none tracking-wide text-[var(--text)] sm:text-[24px]">
            Resume
          </p>
        </div>

        <div className="relative flex shrink-0 items-center gap-1 sm:gap-3">
          <span
            title="Download resume"
            className="flex items-center justify-center rounded-full transition-all duration-300 sm:h-12 sm:w-12 sm:border sm:border-[var(--border)] sm:bg-[var(--bg-elevated)] sm:hover:scale-110 sm:hover:border-[var(--border-strong)]"
          >
            <Download />
          </span>
          <span
            title="View resume"
            className="flex items-center justify-center rounded-full transition-all duration-300 sm:h-12 sm:w-12 sm:border sm:border-[var(--border)] sm:bg-[var(--bg-elevated)] sm:hover:scale-110 sm:hover:border-[var(--border-strong)]"
          >
            <SendIcon />
          </span>
        </div>
      </div>
    </CardWrapper>
  );
};

export default ResumeCard;
