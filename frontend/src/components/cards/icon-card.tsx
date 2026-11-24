"use client";

import cn from "classnames";
import { IconType } from "react-icons";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import CardWrapper from "./card-wrapper";
import { PeekFigure, PeekProp } from "@/components/figures";
import { useActive } from "@/lib/use-active";

/**
 * Social boxes (same sizes as the original layout): big logo in the middle.
 * GitHub also gets the line-art figure and the code sheet on hover.
 */

const SOCIALS = {
  // GitHub: smaller, tilted, popping up from the bottom-left corner (like the drawing)
  Github: {
    label: "GitHub",
    Icon: FaGithub,
    prop: "laptop",
    logo: "top-[49%] h-[38%] max-h-[116px]",
    figure: "left-[1.5%] h-[31%] max-h-[86px] origin-bottom-left rotate-[8deg]",
    pop: true,
  },
  Linkedin: { label: "LinkedIn", Icon: FaLinkedin, prop: null, logo: "top-1/2 h-[44%] max-h-[120px]", figure: "", pop: false },
  Instagram: { label: "Instagram", Icon: FaInstagram, prop: null, logo: "top-1/2 h-[44%] max-h-[120px]", figure: "", pop: false },
} satisfies Record<string, { label: string; Icon: IconType; prop: PeekProp | null; logo: string; figure: string; pop: boolean }>;

export type SocialName = keyof typeof SOCIALS;

// GitHub's faint, tilted snippet of code that fades in under the logo (as in the drawing)
const CODE_LINES = [
  "useEffect(() => {",
  "  if (",
  "",
  "JSON.parse(lanyard.data.kv.spotify_last_played)",
  "d) !== lanyard.data.spotify &&",
  "    lanyard.listening_to_spotify",
  ") {",
  "    const fetchData = async () => {",
  "    try {",
];

function CodeSheet({ active }: { active: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute left-[4%] top-[60%] w-[120%] origin-top-left font-code text-[8px] leading-[10.5px] text-[var(--code-faint)]",
        "transition-all duration-700 ease-out",
        active ? "rotate-[8deg] opacity-100" : "translate-y-3 rotate-[8deg] opacity-0"
      )}
    >
      {CODE_LINES.map((l, i) => (
        <div key={i} className="whitespace-pre">
          {l || " "}
        </div>
      ))}
    </div>
  );
}

const IconCard = ({ title, link }: { title: SocialName; link: string }) => {
  const { ref, active, handlers } = useActive<HTMLAnchorElement>();
  const s = SOCIALS[title];

  return (
    <CardWrapper>
      <a
        ref={ref}
        {...handlers}
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={s.label}
        className="relative block h-full w-full"
      >
        {title === "Github" && <CodeSheet active={active} />}

        {/* big logo, always centred */}
        <span className={cn("absolute left-1/2 flex aspect-square -translate-x-1/2 -translate-y-1/2 items-center justify-center text-[var(--logo)]", s.logo)}>
          <s.Icon className="h-full w-full" />
        </span>

        {s.prop && <PeekFigure prop={s.prop} active={active} pop={s.pop} className={cn("-bottom-2 aspect-[6/5]", s.figure)} />}
      </a>
    </CardWrapper>
  );
};

export default IconCard;

/** GitHub box: same tile, with the code sheet. Kept as its own export for the grid. */
export const GithubCard = ({ link }: { link: string; handle?: string }) => <IconCard title="Github" link={link} />;
