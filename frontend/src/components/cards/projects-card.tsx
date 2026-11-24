"use client";

import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import CardWrapper from "./card-wrapper";

const PROJECTS = [
  { title: "Journey Genie v2", img: "/projects/JGv2.png" },
  { title: "Machine Learning Neural Network", img: "/projects/ML_NN.png" },
  { title: "FriendsBook - Social Network", img: "/projects/FB.png" },
  { title: "Personal Portfolio", img: "/projects/portfolio.png" },
  { title: "Collision-Resistant Hashmap", img: "/projects/hashtable.png" },
  { title: "Vacuum Search Agent", img: "/projects/search.png" },
];

/** Tall box: a slow vertical reel of project previews, linking to /projects. */
const ProjectsCard = () => {
  return (
    <CardWrapper>
      <div className="flex h-full w-full flex-col [container-type:inline-size]">
        <div className="flex items-start justify-between gap-2 px-5 pb-3 pt-5">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Selected work</p>
            <p className="mt-1 font-serif text-[26px] leading-[1.05] text-[var(--text)] [@container(max-width:180px)]:text-[20px]">
              Projects
            </p>
          </div>
          <Link
            href="/projects"
            aria-label="See all projects"
            className="group/arrow flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text)] transition-all duration-300 hover:scale-110 hover:bg-[var(--accent)] hover:text-white"
          >
            <FiArrowUpRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover/arrow:rotate-45" />
          </Link>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden px-3 pb-3 [mask-image:linear-gradient(transparent,#000_10%,#000_88%,transparent)]">
          <div
            className="flex flex-col gap-2 group-hover:[animation-play-state:paused]"
            style={{
              animationName: "scroll-y",
              animationDuration: `${PROJECTS.length * 5}s`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
            }}
          >
            {[...PROJECTS, ...PROJECTS].map((p, i) => (
              <Link
                key={`${p.title}-${i}`}
                href="/projects"
                className="group/proj block rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-1.5 transition-colors duration-300 hover:border-[var(--border-strong)]"
                tabIndex={i >= PROJECTS.length ? -1 : undefined}
                aria-hidden={i >= PROJECTS.length ? true : undefined}
              >
                <div className="aspect-[16/10] overflow-hidden rounded-xl bg-[var(--border)]">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover/proj:scale-105"
                  />
                </div>
                <p className="line-clamp-2 px-1.5 pb-1 pt-2 text-[12px] font-medium leading-snug text-[var(--text)]">
                  {p.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};

export default ProjectsCard;
