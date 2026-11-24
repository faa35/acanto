"use client";

import cn from "classnames";
import { CSSProperties } from "react";
import s from "./figures.module.scss";

/**
 * Line-art figures redrawn as SVG from the card drawings (laptop coder,
 * phone scroller, headphone listener) so they stay crisp and follow the
 * light/dark theme. Faceless until the card is hovered.
 */

/* ================================================================== */
/* Peek figure: round head on a wide rounded body, peeking up from    */
/* the bottom edge of the card.                                       */
/* ================================================================== */

export type PeekProp = "laptop" | "tie" | "envelope" | "phone";

// head position + body outline for each pose (viewBox 0 0 120 100)
const POSE = {
  // head on the right of the body, prop held on the right (laptop drawing)
  right: {
    head: { cx: 70, cy: 40 },
    body: "M27 120 V63 Q27 47 43 47 H98 Q110 47 110 59 V120",
  },
  // head on the left of the body, prop held on the left (phone drawing)
  left: {
    head: { cx: 50, cy: 40 },
    body: "M25 120 V60 Q25 49 36 49 H68 Q83 49 83 64 V120",
  },
} as const;

const POSE_FOR: Record<PeekProp, keyof typeof POSE> = {
  laptop: "right",
  tie: "right",
  envelope: "right",
  phone: "left",
};

const R = 26; // head radius

// a spiral eye centred on (x, y)
const spiral = (x: number, y: number) =>
  `M${x} ${y} a0.9 0.9 0 0 1 1.8 0 a1.8 1.8 0 0 1 -3.6 0 a2.7 2.7 0 0 1 5.4 0 a3.6 3.6 0 0 1 -7.2 0`;

const FACES: Record<PeekProp, JSX.Element> = {
  // dizzy coder (laptop drawing): spiral eyes + wobbly mouth, looking at the screen
  laptop: (
    <>
      <path className={s.ink} d={spiral(62, 30)} />
      <path className={s.ink} d={spiral(81.5, 31.5)} />
      <path className={s.ink} d="M64.5 37 q1.9 -1.8 3.8 0 t3.8 0 t3.8 0 t3.8 0" />
    </>
  ),
  // happy ^ ^ + smile
  tie: (
    <>
      <path className={s.ink} d="M60 33 q2.8 -3.4 5.6 0" />
      <path className={s.ink} d="M76 33 q2.8 -3.4 5.6 0" />
      <path className={s.ink} d="M66 41 q5 4.5 10 0" />
    </>
  ),
  // curious dots + little "o"
  envelope: (
    <>
      <circle className={s.inkFill} cx="63" cy="32" r="1.7" />
      <circle className={s.inkFill} cx="79" cy="32" r="1.7" />
      <circle className={s.ink} cx="71" cy="40.5" r="2" />
    </>
  ),
  // grumpy scroller (phone drawing): slanted brows, dot eyes, "o" mouth, looking at the phone
  phone: (
    <>
      <path className={s.ink} style={{ strokeWidth: 2 }} d="M28.5 31.2 l6.8 0.7" />
      <path className={s.ink} style={{ strokeWidth: 2 }} d="M44.2 30.6 l6.4 -2.3" />
      <circle className={s.inkFill} cx="32.2" cy="34" r="1.7" />
      <circle className={s.inkFill} cx="47.6" cy="32.4" r="1.7" />
      <circle className={s.ink} cx="39.9" cy="35.6" r="2.3" />
    </>
  ),
};

/** "💢" anger mark drawn as four little corner arcs. */
function Anger({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  const a = 4 * k;
  const b = 1.4 * k;
  return (
    <path
      className={s.thin}
      style={{ strokeWidth: 1.5 }}
      d={`M${x - a} ${y - b} q${a - b} 0 ${a - b} ${-(a - b)} M${x + b} ${y - a} q0 ${a - b} ${a - b} ${a - b} M${x + a} ${y + b} q${-(a - b)} 0 ${-(a - b)} ${a - b} M${x - b} ${y + a} q0 ${-(a - b)} ${-(a - b)} ${-(a - b)}`}
    />
  );
}

function Heart({ x, y, k = 1, d, dx }: { x: number; y: number; k?: number; d: string; dx: number }) {
  return (
    <path
      className={cn(s.darkFill, s.float)}
      style={{ "--d": d, "--x": `${dx}px` } as CSSProperties}
      d={`M${x} ${y + 3 * k} c${-1.7 * k} ${-1.4 * k} ${-4 * k} ${-3 * k} ${-4 * k} ${-5 * k} a${2 * k} ${2 * k} 0 0 1 ${4 * k} ${-0.6 * k} a${2 * k} ${2 * k} 0 0 1 ${4 * k} ${0.6 * k} c0 ${2 * k} ${-2.3 * k} ${3.6 * k} ${-4 * k} ${5 * k}z`}
    />
  );
}

export function PeekFigure({
  prop,
  active,
  pop = false,
  className,
  style,
}: {
  prop: PeekProp;
  active: boolean;
  /** sit lower when idle so it visibly pops up on hover */
  pop?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const pose = POSE[POSE_FOR[prop]];
  const { cx, cy } = pose.head;
  const tilt = prop === "phone" ? 4 : -5;

  return (
    <div aria-hidden className={cn(s.fig, s.peek, pop && s.pop, active && s.on, className)} style={style}>
      <svg viewBox="0 0 120 100">
        {/* things that live around the figure */}
        {prop === "tie" && (
          <g className={s.bubble} style={{ transformOrigin: "100% 100%" }}>
            <path className={s.outline} d="M-6 2 h50 a9 9 0 0 1 0 18 h-4 l3 7 l-11 -7 h-38 a9 9 0 0 1 0 -18z" />
            <text x="19" y="14.2" textAnchor="middle" className={s.inkFill} style={{ fontSize: 7.5, fontWeight: 600 }}>
              let&apos;s connect!
            </text>
          </g>
        )}
        {prop === "envelope" && (
          <g className={s.plane}>
            <path className={cn(s.thin, s.trail)} d="M96 62 q8 -8 12 -18" />
            <path className={s.outline} d="M106 46 l17 -9 -6 17 -3.5 -6.5z" />
            <path className={s.thin} d="M113.5 47.5 l9.5 -10.5" />
          </g>
        )}
        {prop === "phone" && (
          <>
            <Heart x={6} y={38} k={1.3} d="0s" dx={-8} />
            <Heart x={13} y={28} k={0.9} d="0.7s" dx={-4} />
            <Heart x={19} y={34} k={1.05} d="1.3s" dx={-10} />
          </>
        )}

        <g className={s.char}>
          <path className={cn(s.outline, s.body)} d={pose.body} />

          {prop === "tie" && (
            <path className={cn(s.prop, s.extra)} d="M66 47.5 h8 l-2 4.5 l4 22 l-6 6.5 l-6 -6.5 l4 -22z" />
          )}

          <g className={s.head} style={{ transformOrigin: `${cx}px ${cy + R}px`, ["--tilt" as string]: `${tilt}deg` }}>
            <circle className={s.outline} cx={cx} cy={cy} r={R} />
            <g className={s.face}>
              {FACES[prop]}
              {prop === "phone" && (
                <>
                  <Anger x={59} y={21} />
                  <Anger x={69.5} y={33} k={0.8} />
                </>
              )}
            </g>
          </g>

          {prop === "laptop" && (
            <g className={s.item} style={{ transformOrigin: "92px 80px" }}>
              <g className={s.typing} style={{ transformOrigin: "92px 80px" }}>
                {/* keyboard base peeking out under the lid */}
                <path className={s.prop2} d="M58 72.5 L77 79 L75 83.5 L56 77z" />
                {/* back of the lid */}
                <path className={s.prop} d="M83 54 Q84 52 86 52.6 L116 61 Q118 61.7 117.5 63.6 L110 91 Q109.4 93 107.4 92.3 L75.5 81 Q73.5 80.2 74.2 78.3z" />
                <circle className={s.prop2} cx="95.5" cy="71" r="3.4" />
              </g>
            </g>
          )}
          {prop === "envelope" && (
            <g className={s.item} style={{ transformOrigin: "92px 80px" }}>
              <path className={s.prop2} d="M73 60 L112 55 L116 86 L77 91z" />
              <path d="M73 60 L96 75 L112 55" fill="none" stroke="var(--fig-prop)" strokeWidth={1.6} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
              <Heart x={93.5} y={74} k={0.85} d="0s" dx={0} />
            </g>
          )}
          {prop === "phone" && (
            <g className={s.item} style={{ transformOrigin: "26px 62px" }}>
              <g transform="rotate(-32 26 62)">
                <rect className={s.prop} x="18.5" y="45" width="15" height="34" rx="3.2" />
                {/* camera bump */}
                <rect className={s.prop2} x="25" y="47.5" width="6.4" height="6.4" rx="1.8" />
                <circle className={s.prop} cx="26.9" cy="49.4" r="1" />
                <circle className={s.prop} cx="29.5" cy="49.4" r="1" />
                <circle className={s.prop} cx="28.2" cy="52" r="1" />
              </g>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}

/* ================================================================== */
/* Side figure (Spotify): leans in from the right edge. On hover the  */
/* head tilts, headphones drop on and ribbons of music flow out.      */
/* ================================================================== */

function Note({ x, y, d, kind = "quarter" }: { x: number; y: number; d: string; kind?: "quarter" | "eighth" | "half" | "beamed" }) {
  const stem = { stroke: "var(--fig-stroke)", strokeWidth: 1.2 } as CSSProperties;
  return (
    <g className={s.note} style={{ "--d": d } as CSSProperties}>
      {kind === "beamed" ? (
        <>
          <ellipse className={s.noteFill} cx={x} cy={y} rx="2.4" ry="1.8" transform={`rotate(-22 ${x} ${y})`} />
          <ellipse className={s.noteFill} cx={x + 6} cy={y - 1.5} rx="2.4" ry="1.8" transform={`rotate(-22 ${x + 6} ${y - 1.5})`} />
          <path className={s.thin} style={stem} d={`M${x + 2.2} ${y - 0.5} v-8 l6 -1.5 v8 M${x + 2.2} ${y - 6} l6 -1.5`} />
        </>
      ) : (
        <>
          <ellipse
            className={kind === "half" ? s.thin : s.noteFill}
            style={kind === "half" ? stem : undefined}
            cx={x}
            cy={y}
            rx="2.8"
            ry="2"
            transform={`rotate(-22 ${x} ${y})`}
          />
          <path className={s.thin} style={stem} d={`M${x + 2.6} ${y - 0.6} v-10${kind === "eighth" ? " q3.5 1.6 3.2 5.6" : ""}`} />
        </>
      )}
    </g>
  );
}

function Sharp({ x, y, d }: { x: number; y: number; d: string }) {
  return (
    <g className={s.note} style={{ "--d": d } as CSSProperties}>
      <path className={s.thin} d={`M${x} ${y - 4.5} v9 M${x + 2.6} ${y - 5.2} v9 M${x - 1.8} ${y - 0.8} l6.2 -1.8 M${x - 1.8} ${y + 2.6} l6.2 -1.8`} />
    </g>
  );
}

function Clef({ x, y, d, k = 1 }: { x: number; y: number; d: string; k?: number }) {
  return (
    <g className={s.note} style={{ "--d": d } as CSSProperties} transform={`translate(${x} ${y}) scale(${k})`}>
      <path
        className={s.thin}
        style={{ strokeWidth: 1.3 }}
        d="M1.6 17 c1.6 1.4 3.6 0.2 3 -1.8 L1.4 -4 c-0.5 -3 2.2 -4.6 2.8 -2 c0.6 2.6 -4.2 5.4 -5 8.6 c-0.9 3.6 1.4 6.4 4.2 6 c2.6 -0.4 3.4 -3.6 1.4 -5 c-1.8 -1.2 -4 0.4 -3.2 2.4"
      />
    </g>
  );
}

// the five lines of a music staff, offset along (dx, dy)
const staff = (base: (i: number) => string) => [0, 1, 2, 3, 4].map((i) => base(i));

export function SideFigure({ active, className, style }: { active: boolean; className?: string; style?: CSSProperties }) {
  const upper = staff((i) => `M${70 + i * 2.2} ${27 + i * 2.2} C${78 + i * 2.2} ${16 + i * 2.2} ${86 + i * 2} ${6 + i * 2.4} 104 ${-6 + i * 2.6}`);
  const lower = staff((i) => `M${64 + i * 1.4} ${84 + i * 2.6} C${34 + i * 2.4} ${88 + i * 2.6} ${-2 + i * 2.8} ${106 + i * 2.2} ${2 + i * 3.4} ${156 + i * 0.6}`);

  return (
    <div aria-hidden className={cn(s.fig, s.side, active && s.on, className)} style={style}>
      <svg viewBox="0 0 100 160">
        {/* music ribbons (behind the figure) */}
        <g className={s.staff}>
          {upper.map((d, i) => (
            <path key={`u${i}`} className={s.thin} d={d} />
          ))}
          {lower.map((d, i) => (
            <path key={`l${i}`} className={s.thin} d={d} />
          ))}
        </g>
        <Clef x={92} y={-6} d="0.5s" k={0.75} />
        <Note x={84} y={14} d="0.45s" kind="eighth" />
        <Sharp x={30} y={95} d="0.55s" />
        <Note x={47} y={104} d="0.6s" />
        <Note x={55} y={99} d="0.65s" />
        <Clef x={8} y={98} d="0.7s" k={0.9} />
        <Note x={24} y={122} d="0.75s" kind="eighth" />
        <Note x={44} y={124} d="0.85s" kind="beamed" />
        <Note x={22} y={146} d="0.95s" kind="half" />

        <g className={s.bob}>
          {/* body: fill shape (no stroke) + its two outline strokes */}
          <path className={cn(s.sideBody, s.body)} d="M74 44 C84 38 92 37 100 39 L100 130 L52 87 C47 83 46 80 50 76 Z" />
          <path className={s.thin} style={{ strokeWidth: 1.3 }} d="M74 44 C84 38 92 37 101 39" />
          <path className={s.thin} style={{ strokeWidth: 1.3 }} d="M49 78 C47 82 48 85 52 88 L101 131" />

          <g className={s.head}>
            <circle className={s.outline} cx="49" cy="52" r="30" />
            <g className={s.face}>
              <path className={s.ink} style={{ strokeWidth: 2.6 }} d="M35 50 h7" />
              <path className={s.ink} style={{ strokeWidth: 2.6 }} d="M56 50 h7" />
              <path className={s.ink} style={{ strokeWidth: 2 }} d="M44 59 q2.5 3.4 5 0 q2.5 3.4 5 0" />
            </g>
            <g className={s.phones}>
              <path className={s.darkLine} style={{ strokeWidth: 3.6 }} d="M15 60 C13 13 85 13 83 60" />
              <rect className={s.darkFill} x="7" y="49" width="13" height="23" rx="4.5" />
              <rect className={s.darkFill} x="78" y="49" width="13" height="23" rx="4.5" />
              <path className={s.thin} style={{ stroke: "var(--fig-fill)", strokeWidth: 1 }} d="M10.5 52 v17 M87.5 52 v17" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
