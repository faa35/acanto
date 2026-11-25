"use client";

import { CSSProperties, useState } from "react";
import { IconType } from "react-icons";
import {
  SiBootstrap,
  SiCplusplus,
  SiDocker,
  SiGit,
  SiJavascript,
  SiJunit5,
  SiNextdotjs,
  SiNumpy,
  SiOpenjdk,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSpringboot,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import CardWrapper from "./card-wrapper";

type Tool = { name: string; Icon: IconType; color: string };

// Tools from the projects on the resume
const TOOLS: Tool[] = [
  { name: "Python", Icon: SiPython, color: "#3776ab" },
  { name: "Java", Icon: SiOpenjdk, color: "#e76f00" },
  { name: "C++", Icon: SiCplusplus, color: "#00599c" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178c6" },
  { name: "JavaScript", Icon: SiJavascript, color: "#e8c91a" },
  { name: "React", Icon: SiReact, color: "#38bdf8" },
  { name: "Next.js", Icon: SiNextdotjs, color: "var(--text)" },
  { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06b6d4" },
  { name: "Spring Boot", Icon: SiSpringboot, color: "#6db33f" },
  { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169e1" },
  { name: "Docker", Icon: SiDocker, color: "#2496ed" },
  { name: "NumPy", Icon: SiNumpy, color: "#4dabcf" },
  { name: "Bootstrap", Icon: SiBootstrap, color: "#7952b3" },
  { name: "JUnit", Icon: SiJunit5, color: "#25a162" },
  { name: "Git", Icon: SiGit, color: "#f05032" },
];

/**
 * Small, calm "tools I use" box (sits where the Email box used to be).
 * Icons are grey like the other logos and pick up their brand colour on hover;
 * the label swaps to the hovered tool's name. Icon size scales with the box.
 */
const ToolsCard = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <CardWrapper>
      <div className="h-full w-full [container-type:size]">
        <div
          // short box: 8 x 2 icons; taller box: 5 x 3; narrow (phone) box: 4 x 4
          className="flex h-full flex-col justify-center gap-[clamp(6px,6cqh,14px)] px-5 py-3 [--cols:8] [--rows:2] [@container(min-height:200px)]:[--cols:5] [@container(min-height:200px)]:[--rows:3] [@container(max-width:220px)]:[--cols:4] [@container(max-width:220px)]:[--rows:4]"
          style={
            {
              // icon size: fit whichever of width / height is tighter (gap = 0.6 x icon)
              "--s": "min(calc((100cqw - 40px) / (var(--cols) * 1.6 - 0.6)), calc((100cqh - 52px) / (var(--rows) * 1.6 - 0.6)), 30px)",
            } as CSSProperties
          }
        >
          <p className="h-4 truncate text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--muted)] transition-colors">
            {hovered ?? "Tools I use"}
          </p>

          <ul
            className="grid w-fit"
            style={{ gridTemplateColumns: "repeat(var(--cols), var(--s))", gap: "calc(var(--s) * 0.6)" }}
            onPointerLeave={() => setHovered(null)}
          >
            {TOOLS.map((t) => (
              <li key={t.name}>
                <span
                  title={t.name}
                  aria-label={t.name}
                  onPointerEnter={() => setHovered(t.name)}
                  className="group/tool block transition-transform duration-300 hover:-translate-y-0.5"
                  style={{ width: "var(--s)", height: "var(--s)" }}
                >
                  <t.Icon
                    className="h-full w-full text-[var(--logo)] transition-colors duration-300 group-hover/tool:text-[var(--tool)]"
                    style={{ "--tool": t.color } as CSSProperties}
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </CardWrapper>
  );
};

export default ToolsCard;
