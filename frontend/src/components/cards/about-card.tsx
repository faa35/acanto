"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiClock, FiMapPin } from "react-icons/fi";
import CardWrapper from "@/components/cards/card-wrapper";
import SendmessageIcon from "@/components/lottie-ui/send-message";

function useLocalTime(timeZone: string) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, [timeZone]);
  return time;
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1 text-[12px] font-medium text-[var(--muted)] backdrop-blur">
      {children}
    </span>
  );
}

/**
 * Lives in the original bio box. The box is short on tablet/phone, so the
 * chips and buttons hide themselves (container queries) when there's no room.
 */
const AboutCard = () => {
  const time = useLocalTime("America/Vancouver");
  const [touchHover, setTouchHover] = useState(false);
  const [projectsHover, setProjectsHover] = useState(false);

  return (
    <CardWrapper>
      <div className="h-full w-full [container-type:size]">
        <div className="relative flex h-full flex-col justify-center gap-4 px-6 py-5 sm:px-8">
          {/* decorative rings */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[var(--border)] opacity-70"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 animate-[spin_40s_linear_infinite] rounded-full border border-dashed border-[var(--border)] opacity-70"
          />

          <div className="relative flex flex-wrap items-center gap-2 [@container(max-height:280px)]:hidden">
            <Chip>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <FiMapPin className="h-3.5 w-3.5" /> Burnaby, BC
            </Chip>
            <Chip>
              <FiClock className="h-3.5 w-3.5" />
              <span className="tabular-nums">{time ?? "--:--"}</span> local
            </Chip>
          </div>

          <div className="relative">
            <h1 className="font-silka text-[34px] font-medium leading-[0.95] tracking-[-0.03em] text-[var(--text)] sm:text-[46px]">
              Fardin{" "}
              <span className="font-serif text-[38px] font-normal italic tracking-normal text-[var(--accent)] sm:text-[52px]">
                Abdulla
              </span>
            </h1>
            <p className="mt-3 max-w-[60ch] text-[13px] leading-relaxed text-[var(--muted)] sm:text-[14px]">
              I&apos;m passionate about <span className="text-[var(--text)]">full-stack development</span>,{" "}
              <span className="text-[var(--text)]">artificial intelligence</span>, and{" "}
              <span className="text-[var(--text)]">data science</span>. Currently pursuing my Bachelor&apos;s degree in
              CS at <span className="text-[var(--text)]">Simon Fraser University</span>.
            </p>
          </div>

          <div className="relative flex flex-wrap gap-2.5 [@container(max-height:230px)]:hidden">
            <Link
              href="/projects"
              onMouseEnter={() => setProjectsHover(true)}
              onMouseLeave={() => setProjectsHover(false)}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--text)] py-2 pl-5 pr-3 text-[13px] font-semibold text-[var(--bg)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              View projects
              <SendmessageIcon lottieName="SendMessageIconProjects" bare invert active={projectsHover} iconClassName="h-6 w-6" />
            </Link>
            <a
              href="mailto:abdullafardin2202@gmail.com"
              onMouseEnter={() => setTouchHover(true)}
              onMouseLeave={() => setTouchHover(false)}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] py-2 pl-5 pr-3 text-[13px] font-semibold text-[var(--text)] transition-colors duration-300 hover:bg-[var(--accent-soft)]"
            >
              Get in touch
              <SendmessageIcon lottieName="SendMessageIconTouch" bare active={touchHover} iconClassName="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};

export default AboutCard;
