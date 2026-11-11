"use client";

import Image from "next/image";
import type { ChipShowcase as Chip } from "@/content/site";
import Reveal from "./Reveal";
import { useTilt } from "./useTilt";
import styles from "./ChipShowcase.module.css";

/*
 * Trace geometry, in percent of the square board photo. The chip's pins end at
 * about 21.5% (top), 80% (bottom), 19% (left) and 81% (right) of the crop.
 * Data flows in from the left and top edges, and out to the right and bottom.
 */
type Trace = { d: string; dur: number; delay: number; tone: "a" | "b" };

const TOP = [31, 38, 45, 52, 59, 66];
const SIDE = [33, 40, 47, 54, 61, 67];

const jog = (from: number, to: number) => (from < 50 ? to - 9 : to + 9);

const traces: Trace[] = [
  // left edge -> left pins (in)
  ...SIDE.map((y, i) => ({
    d: `M0 ${jog(y, y)} L7 ${jog(y, y)} L14 ${y} L19.2 ${y}`,
    dur: 2.2 + (i % 3) * 0.35,
    delay: i * 0.37,
    tone: "a" as const,
  })),
  // top edge -> top pins (in)
  ...TOP.map((x, i) => ({
    d: `M${jog(x, x)} 0 L${jog(x, x)} 6 L${x} 14 L${x} 21.6`,
    dur: 2.4 + (i % 2) * 0.4,
    delay: 0.2 + i * 0.41,
    tone: "a" as const,
  })),
  // right pins -> right edge (out)
  ...SIDE.map((y, i) => ({
    d: `M80.8 ${y} L86 ${y} L93 ${jog(y, y)} L100 ${jog(y, y)}`,
    dur: 2 + (i % 3) * 0.3,
    delay: 1.1 + i * 0.33,
    tone: "b" as const,
  })),
  // bottom pins -> bottom edge (out)
  ...TOP.map((x, i) => ({
    d: `M${x} 80.2 L${x} 86 L${jog(x, x)} 94 L${jog(x, x)} 100`,
    dur: 2.3 + (i % 2) * 0.35,
    delay: 0.8 + i * 0.39,
    tone: "b" as const,
  })),
];

/*
 * Drawn board for products without a photo of their main board: a navy PCB
 * with a QFP package, fine fan-out traces, and lit pins.
 * The body matches .pkg (23.6–75.7% across, 25.4–74.3% down) and the pins end
 * where the animated traces start (19.2%, 80.8%, 21.6%, 80.2%).
 */
const PINS = 28;
const range = (from: number, to: number) =>
  Array.from({ length: PINS }, (_, i) => from + ((to - from) * i) / (PINS - 1));
const pinsX = range(26, 73.3);
const pinsY = range(27.6, 72.1);

/** Fan-out traces from each pin toward the board edge, spreading outward */
const fan = [
  ...pinsX.map((x) => {
    const x2 = 50 + (x - 50) * 1.7;
    return [
      `M${x} 21.6 L${x} 17 L${x2} ${17 - Math.abs(x2 - x)} L${x2} -2`,
      `M${x} 80.2 L${x} 85 L${x2} ${85 + Math.abs(x2 - x)} L${x2} 102`,
    ];
  }),
  ...pinsY.map((y) => {
    const y2 = 50 + (y - 50) * 1.7;
    return [
      `M19.2 ${y} L15 ${y} L${15 - Math.abs(y2 - y)} ${y2} L-2 ${y2}`,
      `M80.8 ${y} L85 ${y} L${85 + Math.abs(y2 - y)} ${y2} L102 ${y2}`,
    ];
  }),
].flat();

/** Electrolytic capacitors: [cx, cy, r] */
const cans: [number, number, number][] = [
  [8, 13, 2.8], [14.5, 9, 2.8], [21, 5.5, 2.8], [92, 21, 2.6], [92, 30, 2.6], [92, 39, 2.6],
];

/** Small surface mount parts: [x, y, w, h] */
const smd: [number, number, number, number][] = [
  [3, 30, 4, 2], [3, 35, 4, 2], [3, 60, 4, 2], [3, 65, 4, 2], [30, 3, 2, 4], [70, 4, 2, 4],
  [93, 47, 4, 2], [93, 52, 4, 2], [93, 70, 4, 2], [35, 94, 2, 4], [62, 94, 2, 4], [80, 2, 5, 3],
];

/** Resistor arrays: top-left corner of a 3 × 3 grid of pads */
const arrays: [number, number][] = [[84, 8], [86, 86], [3, 44]];

/** Small ICs with pins on two sides: [x, y, w, h] */
const ics: [number, number, number, number][] = [[88, 58, 7, 9], [40, 4, 9, 6], [3, 76, 8, 6]];

function BoardArt({ label }: { label: string }) {
  return (
    <svg className={styles.art} viewBox="0 0 100 100" role="img" aria-label={label}>
      <defs>
        <radialGradient id="pcb" cx="55%" cy="55%" r="75%">
          <stop offset="0" stopColor="#0d2148" />
          <stop offset="0.6" stopColor="#081631" />
          <stop offset="1" stopColor="#040b1c" />
        </radialGradient>
        <linearGradient id="can" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e3e8ef" />
          <stop offset="1" stopColor="#7d8796" />
        </linearGradient>
        <filter id="pin-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>

      <rect x="-2" y="-2" width="104" height="104" fill="url(#pcb)" />

      {/* fine copper traces, dimly lit */}
      <g fill="none" stroke="#3b6fb8" strokeOpacity="0.45" strokeWidth="0.22" strokeLinejoin="round">
        {fan.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* parts around the chip */}
      {cans.map(([cx, cy, r], i) => (
        <g key={`c${i}`}>
          <circle cx={cx} cy={cy + 0.6} r={r} fill="#02060f" opacity="0.6" />
          <circle cx={cx} cy={cy} r={r} fill="url(#can)" />
          <circle cx={cx} cy={cy} r={r * 0.62} fill="#4b5563" />
          <path d={`M${cx - r * 0.45} ${cy} h${r * 0.9} M${cx} ${cy - r * 0.45} v${r * 0.9}`} stroke="#2a313c" strokeWidth="0.3" />
        </g>
      ))}
      {smd.map(([x, y, w, h], i) => {
        const wide = w > h;
        return (
          <g key={`s${i}`}>
            <rect x={x} y={y} width={w} height={h} rx="0.2" fill="#1a1d24" />
            {wide ? (
              <>
                <rect x={x} y={y} width={w * 0.22} height={h} fill="#aeb7c4" />
                <rect x={x + w * 0.78} y={y} width={w * 0.22} height={h} fill="#aeb7c4" />
              </>
            ) : (
              <>
                <rect x={x} y={y} width={w} height={h * 0.22} fill="#aeb7c4" />
                <rect x={x} y={y + h * 0.78} width={w} height={h * 0.22} fill="#aeb7c4" />
              </>
            )}
          </g>
        );
      })}
      {arrays.map(([x, y], i) => (
        <g key={`a${i}`} fill="#c3ccd8">
          {[0, 1, 2].flatMap((r) =>
            [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={x + c * 2.6} y={y + r * 2.6} width="1.8" height="1.8" rx="0.2" />),
          )}
        </g>
      ))}
      {ics.map(([x, y, w, h], i) => (
        <g key={`i${i}`}>
          {Array.from({ length: 4 }, (_, k) => (
            <g key={k} fill="#aeb7c4">
              <rect x={x - 0.8} y={y + 1 + k * ((h - 2) / 3) - 0.3} width="0.8" height="0.6" />
              <rect x={x + w} y={y + 1 + k * ((h - 2) / 3) - 0.3} width="0.8" height="0.6" />
            </g>
          ))}
          <rect x={x} y={y} width={w} height={h} rx="0.4" fill="#16191f" />
        </g>
      ))}

      {/* light spilling from under the package */}
      <rect x="19.2" y="21.6" width="61.6" height="58.6" rx="1.5" fill="none" stroke="#3d8bff" strokeWidth="3" filter="url(#pin-glow)" opacity="0.75" />
      <path d="M80.8 30 V76 M28 80.2 H76" stroke="#7cc0ff" strokeWidth="4" filter="url(#pin-glow)" opacity="0.6" />

      {/* gull wing pins on all four sides */}
      <g fill="#d6e6ff">
        {pinsX.map((x) => (
          <g key={`x${x}`}>
            <rect x={x - 0.28} y="21.6" width="0.56" height="3.8" />
            <rect x={x - 0.28} y="74.3" width="0.56" height="5.9" />
          </g>
        ))}
        {pinsY.map((y) => (
          <g key={`y${y}`}>
            <rect x="19.2" y={y - 0.28} width="4.4" height="0.56" />
            <rect x="75.7" y={y - 0.28} width="5.1" height="0.56" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** The chip's matte body, with a faint laser etched marking near the bottom edge */
function LidArt({ marking }: { marking: string[] }) {
  return (
    <svg className={styles.lid} viewBox="0 0 100 100" aria-hidden>
      <defs>
        <linearGradient id="lid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a3e46" />
          <stop offset="0.55" stopColor="#272a31" />
          <stop offset="1" stopColor="#30343b" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#lid)" />
      <circle cx="8" cy="8" r="2.6" fill="#1b1d22" stroke="#4a4f58" strokeWidth="0.4" />
      {marking.map((line, i) => (
        <text
          key={line}
          x="92"
          y={84 + i * 7}
          textAnchor="end"
          fill="#c6ccd5"
          fillOpacity={i === 0 ? 0.42 : 0.3}
          fontSize={i === 0 ? 8 : 4.2}
          fontWeight={500}
          letterSpacing={i === 0 ? 1.6 : 0.8}
          fontFamily="var(--font-geist-sans), sans-serif"
        >
          {line}
        </text>
      ))}
    </svg>
  );
}

export default function ChipShowcase({ chip, productName }: { chip: Chip; productName: string }) {
  const scene = useTilt<HTMLDivElement>(8);

  return (
    <section id="inside" className={`section ${styles.section}`} aria-labelledby="chip-title">
      <div className="container">
        <Reveal className={`section-head ${styles.head}`}>
          <p className="caption-1 eyebrow">Inside the {productName.replace(/^Aexon /, "")}</p>
          <h2 id="chip-title" className="heading-3">{chip.title}</h2>
          <p className="body-3 muted">{chip.body}</p>
        </Reveal>
      </div>

      <div ref={scene} className={styles.scene} data-art={chip.image ? undefined : "true"}>
        <span className={`caption-3 ${styles.tag} ${styles.tagIn}`} aria-hidden>
          <span className={styles.tagDot} /> Image data in
        </span>
        <span className={`caption-3 ${styles.tag} ${styles.tagOut}`} aria-hidden>
          To print engine <span className={styles.tagDot} />
        </span>

        <div className={styles.board}>
          {chip.image ? (
            <Image src={chip.image} alt={chip.alt} fill sizes="(max-width: 640px) 90vw, 560px" className={styles.photo} />
          ) : (
            <BoardArt label={chip.alt} />
          )}

          {/* Copper traces and the electrons travelling along them */}
          <svg className={styles.traces} viewBox="0 0 100 100" aria-hidden>
            <defs>
              <filter id="chip-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1" result="b" />
                <feMerge result="glow">
                  <feMergeNode in="b" />
                  <feMergeNode in="b" />
                </feMerge>
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {traces.map((t, i) => (
              <path key={`l${i}`} d={t.d} className={styles.line} data-tone={t.tone} />
            ))}
            <g filter="url(#chip-glow)">
              {traces.map((t, i) => (
                <path
                  key={`e${i}`}
                  d={t.d}
                  pathLength={100}
                  className={styles.electron}
                  data-tone={t.tone}
                  style={{ animationDuration: `${t.dur}s`, animationDelay: `${t.delay}s` }}
                />
              ))}
            </g>
          </svg>

          {/* The chip package, raised off the board with a little thickness */}
          <div className={styles.pkg}>
            <span className={styles.edge} style={{ ["--z" as string]: "4px" }} />
            <span className={styles.edge} style={{ ["--z" as string]: "8px" }} />
            <span className={styles.edge} style={{ ["--z" as string]: "12px" }} />
            <div className={styles.top} style={chip.image ? { backgroundImage: `url(${chip.image})` } : undefined}>
              {!chip.image && <LidArt marking={chip.marking ?? []} />}
              <span className={styles.core} />
              <svg className={styles.ring} viewBox="0 0 100 100" aria-hidden>
                <rect x="4" y="4" width="92" height="92" rx="3" pathLength={100} className={styles.ringTrack} />
                <rect x="4" y="4" width="92" height="92" rx="3" pathLength={100} className={styles.ringPulse} />
                <rect
                  x="4"
                  y="4"
                  width="92"
                  height="92"
                  rx="3"
                  pathLength={100}
                  className={styles.ringPulse}
                  style={{ animationDelay: "-2s" }}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <ol className={styles.steps}>
          {chip.steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 100} className={styles.step}>
              <span className={`caption-3 ${styles.stepNum}`}>0{i + 1}</span>
              <h3 className="title-2">{s.title}</h3>
              <p className="body-6 muted">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
