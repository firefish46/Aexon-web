"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowsOut } from "@phosphor-icons/react";
import type { ConsoleTour as Tour } from "@/content/site";
import ConsoleScreen from "./ConsoleScreen";
import Reveal from "./Reveal";
import styles from "./ConsoleTour.module.css";

const STEP_MS = 3500;

/** How far to zoom so a region fills most of the screen, and where to move it. */
function zoomFor(rect: [number, number, number, number] | undefined) {
  if (!rect) return { s: 1, tx: 0, ty: 0 };
  const [x, y, w, h] = rect;
  // leave a margin around the region; never zoom out, never more than 2×
  const s = Math.min(2, Math.max(1, Math.min(100 / w, 100 / h) * 0.86));
  const cx = x + w / 2;
  const cy = y + h / 2;
  // centre the region, but never pull the screen's edge inside the frame
  const tx = Math.min(0, Math.max(100 - 100 * s, 50 - cx * s));
  const ty = Math.min(0, Math.max(100 - 100 * s, 50 - cy * s));
  return { s, tx, ty };
}

/**
 * The touchscreen in a device frame, with each part of the screen numbered.
 * It steps through the parts on its own while on screen, zooming into each one.
 * Selecting a part takes over; selecting it again shows the whole screen.
 */
export default function ConsoleTour({ tour }: { tour: Tour }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setActive((i) => ((i ?? -1) + 1) % tour.regions.length), STEP_MS);
    return () => window.clearInterval(t);
  }, [auto, inView, tour.regions.length]);

  const pick = (i: number) => {
    setAuto(false);
    setActive((cur) => (cur === i ? null : i));
  };

  const overview = () => {
    setAuto(false);
    setActive(null);
  };

  const { s, tx, ty } = zoomFor(active === null ? undefined : tour.regions[active]?.rect);

  return (
    <section id="console" className={`section ${styles.section}`} aria-labelledby="console-title">
      <div className="container" ref={rootRef}>
        <Reveal className={`section-head ${styles.head}`}>
          <p className="caption-1 eyebrow">Touchscreen console</p>
          <h2 id="console-title" className="heading-3">{tour.title}</h2>
          <p className="body-3 muted">{tour.body}</p>
        </Reveal>

        <div className={styles.device}>
          <div className={styles.screen} style={{ aspectRatio: `${tour.imageWidth} / ${tour.imageHeight}` }}>
            {/* Everything on the screen moves together when it zooms into a part */}
            <div
              className={styles.canvas}
              style={{
                transform: `translate(${tx}%, ${ty}%) scale(${s})`,
                ["--z" as string]: s,
              }}
            >
              <ConsoleScreen className={styles.shot} label={tour.alt} />

              {tour.regions.map((r, i) => (
                <button
                  key={r.title}
                  type="button"
                  className={styles.region}
                  data-active={active === i ? "true" : "false"}
                  style={{ left: `${r.rect[0]}%`, top: `${r.rect[1]}%`, width: `${r.rect[2]}%`, height: `${r.rect[3]}%` }}
                  onClick={() => pick(i)}
                  aria-label={`${i + 1}. ${r.title}`}
                  aria-pressed={active === i}
                  aria-controls="console-detail"
                >
                  <span className={`caption-3 ${styles.badge}`}>{i + 1}</span>
                </button>
              ))}
            </div>

            <span className={styles.glare} aria-hidden />

            <button
              type="button"
              className={`caption-4 ${styles.whole}`}
              data-shown={active !== null && !auto ? "true" : "false"}
              onClick={overview}
              tabIndex={active !== null && !auto ? 0 : -1}
            >
              <ArrowsOut size={14} weight="bold" aria-hidden /> Whole screen
            </button>
          </div>
        </div>

        <ol className={styles.legend} id="console-detail">
          {tour.regions.map((r, i) => (
            <li key={r.title}>
              <button
                type="button"
                className={styles.item}
                data-active={active === i ? "true" : "false"}
                aria-pressed={active === i}
                onClick={() => pick(i)}
              >
                <span className={`caption-3 ${styles.itemNum}`}>{i + 1}</span>
                <span className={styles.itemText}>
                  <span className="title-3">{r.title}</span>
                  <span className="body-6 muted">{r.body}</span>
                </span>
                {/* fills while the tour waits on this item */}
                <span
                  className={styles.progress}
                  data-running={auto && inView && active === i ? "true" : "false"}
                  style={{ animationDuration: `${STEP_MS}ms` }}
                  aria-hidden
                />
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
