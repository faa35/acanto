"use client";

import { PointerEvent as ReactPointerEvent, useEffect, useRef } from "react";
import cn from "classnames";

type Kind = "eighth" | "beamed" | "quarter" | "sixteenth" | "sharp" | "flat" | "clef";

const LINE = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** Music signs drawn as SVG so they look the same in every font. */
function Glyph({ kind }: { kind: Kind }) {
  const svg = (children: React.ReactNode) => (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="currentColor" aria-hidden>
      {children}
    </svg>
  );
  switch (kind) {
    case "quarter": // ♩
      return svg(
        <>
          <ellipse cx="9" cy="18" rx="3.7" ry="2.7" transform="rotate(-20 9 18)" />
          <path d="M12.3 17.6V3.5" {...LINE} strokeWidth={1.7} />
        </>
      );
    case "eighth": // ♪
      return svg(
        <>
          <ellipse cx="8" cy="18" rx="3.7" ry="2.7" transform="rotate(-20 8 18)" />
          <path d="M11.3 17.6V4c0 2.6 2 3.7 4 5.1s3.1 3.5 2 6.3" {...LINE} strokeWidth={1.7} />
        </>
      );
    case "beamed": // ♫
      return svg(
        <>
          <ellipse cx="6" cy="19" rx="3.4" ry="2.5" transform="rotate(-20 6 19)" />
          <ellipse cx="16.5" cy="17" rx="3.4" ry="2.5" transform="rotate(-20 16.5 17)" />
          <path d="M9.2 18.5V6.6M19.7 16.5V4.6" {...LINE} strokeWidth={1.6} />
          <path d="M9.2 6.2 19.7 4.2v2.9L9.2 9.1Z" />
        </>
      );
    case "sixteenth": // ♬
      return svg(
        <>
          <ellipse cx="6" cy="19" rx="3.4" ry="2.5" transform="rotate(-20 6 19)" />
          <ellipse cx="16.5" cy="17" rx="3.4" ry="2.5" transform="rotate(-20 16.5 17)" />
          <path d="M9.2 18.5V5.4M19.7 16.5V3.4" {...LINE} strokeWidth={1.6} />
          <path d="M9.2 5 19.7 3v2.6L9.2 7.6Z" />
          <path d="M9.2 9.6 19.7 7.6v2.6L9.2 12.2Z" />
        </>
      );
    case "sharp": // ♯
      return svg(
        <>
          <path d="M9.6 3.5v17M14.6 3v17" {...LINE} strokeWidth={1.5} />
          <path d="M6 10.4 18.2 7.4M6 16.6 18.2 13.6" {...LINE} strokeWidth={2.5} />
        </>
      );
    case "flat": // ♭
      return svg(<path d="M8.5 2.5v19c2.8-1.7 7.8-4.5 7.5-8.2-.2-2.8-3.9-3.4-7.5-.5" {...LINE} strokeWidth={1.8} />);
    case "clef": // 𝄞
      return svg(
        <>
          <path
            d="M11.4 21.3C12.1 16.6 12.5 9.4 12.7 4.6c.1-2.2 1.9-3 2.3-1.2.5 2.4-2.4 5.2-4.6 7.2-2.8 2.5-3.8 4.8-2.6 7 1.2 2 5.8 2.2 7.6 0 1.4-1.8.4-4.8-2-5-2.2-.2-3.4 1.8-2.4 3.4"
            {...LINE}
            strokeWidth={1.5}
          />
          <path d="M11.4 21.3c-.2 1.5-2 1.9-2.8 1" {...LINE} strokeWidth={1.5} />
          <circle cx="8.9" cy="21.6" r="1.5" />
        </>
      );
  }
}

// one entry per note: which sign, and how big it is (px)
const NOTES: { kind: Kind; size: number }[] = [
  { kind: "eighth", size: 24 },
  { kind: "beamed", size: 30 },
  { kind: "clef", size: 34 },
  { kind: "quarter", size: 22 },
  { kind: "sixteenth", size: 28 },
  { kind: "sharp", size: 20 },
  { kind: "eighth", size: 19 },
  { kind: "flat", size: 22 },
  { kind: "beamed", size: 24 },
  { kind: "quarter", size: 18 },
  { kind: "sixteenth", size: 22 },
  { kind: "clef", size: 26 },
];

const HIT = 6; // extra grab area around each sign (px)

interface Particle {
  x: number; // left edge, px inside the card
  y: number; // top edge
  y0: number; // where this rise started
  travel: number; // how far it rises before it's gone
  speed: number; // px per second
  phase: number;
  sway: number;
  tilt: number;
  peak: number; // brightest opacity
  t: number;
  fresh: boolean; // fades in (false after being dropped: it's already visible)
  held: boolean;
  rx: number; // last drawn x / rotation (so grabbing doesn't jump)
  rr: number;
}

/**
 * Music signs drifting up out of the bottom-right corner of the Spotify card.
 * Each one can be grabbed and dragged around (kept inside the card); let go and it floats on from there.
 * Faint until the card is hovered, then Spotify green.
 */
export default function MusicNotes({ active }: { active: boolean }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLSpanElement | null)[]>([]);
  const parts = useRef<Particle[]>([]);
  const drag = useRef<{ i: number; dx: number; dy: number } | null>(null);
  const size = useRef({ w: 0, h: 0 });
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    size.current = { w: box.clientWidth, h: box.clientHeight };

    const lane = () => Math.min(180, size.current.w * 0.45); // the corner they rise out of
    const launch = (p: Particle, s: number, prefill: boolean) => {
      const { w, h } = size.current;
      p.x = w - lane() + Math.random() * Math.max(1, lane() - s);
      p.y0 = h + 2;
      p.travel = h * (0.55 + Math.random() * 0.3) + s;
      p.speed = p.travel / (6.5 + Math.random() * 4);
      p.y = prefill ? p.y0 - Math.random() * p.travel : p.y0;
      p.phase = Math.random() * Math.PI * 2;
      p.sway = 5 + Math.random() * 9;
      p.tilt = (Math.random() * 2 - 1) * 20;
      p.peak = 0.65 + Math.random() * 0.35;
      p.t = 0;
      p.fresh = true;
    };

    parts.current = NOTES.map((n) => {
      const s = n.size + HIT * 2;
      const p: Particle = { x: 0, y: 0, y0: 0, travel: 1, speed: 0, phase: 0, sway: 0, tilt: 0, peak: 0.8, t: 0, fresh: true, held: false, rx: 0, rr: 0 };
      launch(p, s, true);
      if (reduce) {
        // no drifting: just scatter them in the corner (still draggable)
        p.y = size.current.h * (0.25 + Math.random() * 0.6) - s / 2;
        p.peak = 0.75;
      }
      return p;
    });

    const ro = new ResizeObserver(() => {
      const { w, h } = { w: box.clientWidth, h: box.clientHeight };
      if (w === size.current.w && h === size.current.h) return;
      size.current = { w, h };
      parts.current.forEach((p, i) => {
        const s = NOTES[i].size + HIT * 2;
        p.x = Math.min(p.x, w - s);
        if (!reduce && !p.held) launch(p, s, true);
      });
    });
    ro.observe(box);

    let raf = 0;
    let last = performance.now();
    let glow = activeRef.current ? 1 : 0.6; // fainter until the card is hovered
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      glow += ((activeRef.current ? 1 : 0.6) - glow) * Math.min(1, dt * 5);
      parts.current.forEach((p, i) => {
        const el = els.current[i];
        if (!el) return;
        const s = NOTES[i].size + HIT * 2;
        let opacity = p.peak;
        let dx = 0;
        let rot = p.rr;
        if (p.held) {
          opacity = 1;
          rot = p.rr * 0.85; // straighten up while held
        } else if (!reduce) {
          p.t += dt;
          p.y -= p.speed * dt;
          let k = (p.y0 - p.y) / p.travel;
          if (k >= 1) {
            launch(p, s, false);
            k = 0;
          }
          const fadeIn = p.fresh ? Math.min(1, k / 0.15) : 1;
          const fadeOut = k > 0.7 ? Math.max(0, 1 - (k - 0.7) / 0.3) : 1;
          opacity = p.peak * fadeIn * fadeOut;
          const wave = Math.sin(p.phase + p.t * 1.9);
          dx = wave * p.sway;
          rot = wave * p.tilt;
        }
        p.rx = p.x + dx;
        p.rr = rot;
        el.style.transform = `translate3d(${p.rx}px, ${p.y}px, 0) rotate(${rot}deg) scale(${p.held ? 1.3 : 1})`;
        el.style.opacity = String(p.held ? 1 : opacity * glow);
      });
      raf = requestAnimationFrame(frame);
    };

    // only animate while the card is on screen
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(box);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  const pointerIn = (e: ReactPointerEvent) => {
    const r = boxRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const grab = (i: number) => (e: ReactPointerEvent<HTMLSpanElement>) => {
    const p = parts.current[i];
    if (!p) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.dataset.held = "";
    p.x = p.rx; // keep it exactly where it was drawn
    p.held = true;
    const at = pointerIn(e);
    drag.current = { i, dx: at.x - p.x, dy: at.y - p.y };
  };

  const move = (i: number) => (e: ReactPointerEvent<HTMLSpanElement>) => {
    if (drag.current?.i !== i) return;
    const p = parts.current[i];
    const s = NOTES[i].size + HIT * 2;
    const { w, h } = size.current;
    const at = pointerIn(e);
    // stay inside the Spotify card
    p.x = Math.max(0, Math.min(w - s, at.x - drag.current.dx));
    p.y = Math.max(0, Math.min(h - s, at.y - drag.current.dy));
  };

  const release = (i: number) => (e: ReactPointerEvent<HTMLSpanElement>) => {
    if (drag.current?.i !== i) return;
    drag.current = null;
    delete e.currentTarget.dataset.held;
    const p = parts.current[i];
    const s = NOTES[i].size + HIT * 2;
    p.held = false;
    // float on from where it was dropped, at the usual pace, and fade out near the top
    p.y0 = p.y;
    p.travel = Math.max(40, p.y + s);
    p.speed = Math.max(p.speed, 14);
    p.phase = -p.t * 1.9; // sway restarts from the middle, so nothing jumps
    p.fresh = false;
  };

  return (
    <div
      ref={boxRef}
      aria-hidden
      className={cn(
        "music-notes pointer-events-none absolute inset-0 z-[2] overflow-hidden transition-colors duration-500",
        active ? "text-[#1db954]" : "text-[var(--muted)]"
      )}
    >
      {NOTES.map((n, i) => (
        <span
          key={i}
          ref={(el) => {
            els.current[i] = el;
          }}
          className="music-note"
          style={{ width: n.size + HIT * 2, height: n.size + HIT * 2, padding: HIT }}
          onPointerDown={grab(i)}
          onPointerMove={move(i)}
          onPointerUp={release(i)}
          onPointerCancel={release(i)}
        >
          <Glyph kind={n.kind} />
        </span>
      ))}
    </div>
  );
}
