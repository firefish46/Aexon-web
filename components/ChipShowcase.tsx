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

export default function ChipShowcase({ chip }: { chip: Chip }) {
  const scene = useTilt<HTMLDivElement>(8);

  return (
    <section id="inside" className={`section ${styles.section}`} aria-labelledby="chip-title">
      <div className="container">
        <Reveal className={`section-head ${styles.head}`}>
          <p className="caption-1 eyebrow">Inside the Laser Pro</p>
          <h2 id="chip-title" className="heading-3">{chip.title}</h2>
          <p className="body-3 muted">{chip.body}</p>
        </Reveal>
      </div>

      <div ref={scene} className={styles.scene}>
        <span className={`caption-3 ${styles.tag} ${styles.tagIn}`} aria-hidden>
          <span className={styles.tagDot} /> Image data in
        </span>
        <span className={`caption-3 ${styles.tag} ${styles.tagOut}`} aria-hidden>
          To print engine <span className={styles.tagDot} />
        </span>

        <div className={styles.board}>
          <Image src={chip.image} alt={chip.alt} fill sizes="(max-width: 640px) 90vw, 560px" className={styles.photo} />

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
            <div className={styles.top} style={{ backgroundImage: `url(${chip.image})` }}>
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
