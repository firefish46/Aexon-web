"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, CaretLeft, CaretRight, Pause, Play } from "@phosphor-icons/react";
import type { Product } from "@/content/site";
import ConsoleScreen from "./ConsoleScreen";
import styles from "./HeroSlider.module.css";

export type Slide = {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  visual: "duo" | "prime" | "pro" | "chip" | "console";
};

const INTERVAL = 6000;

/**
 * Full width slider at the top of the home page. Autoplays, and pauses while
 * the pointer or keyboard focus is on it, when the tab is hidden, and for
 * reduced motion. Swipe, arrow keys, dots or the buttons change slide.
 */
export default function HeroSlider({
  slides,
  prime,
  pro,
  chipImage,
}: {
  slides: Slide[];
  prime: Product;
  pro: Product;
  chipImage: string;
}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hold, setHold] = useState(false); // hover or focus inside
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLElement>(null);
  const swipe = useRef<{ x: number; y: number; id: number } | null>(null);
  const count = slides.length;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (mq.matches) setPlaying(false);
    const onVis = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const running = playing && !hold && visible && !reduced;

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => go(index + 1), INTERVAL);
    return () => window.clearTimeout(t);
  }, [running, index, go]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(index + 1);
    else if (e.key === "ArrowLeft") go(index - 1);
    else return;
    e.preventDefault();
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    swipe.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(index + (dx < 0 ? 1 : -1));
  };

  const visual = (s: Slide, active: boolean) => {
    switch (s.visual) {
      case "duo":
        return (
          <div className={styles.duo}>
            <Image
              src={prime.image}
              alt={prime.alt}
              width={prime.imageWidth}
              height={prime.imageHeight}
              priority
              sizes="(max-width: 860px) 40vw, 300px"
              className={styles.duoPrime}
            />
            <Image
              src={pro.image}
              alt={pro.alt}
              width={pro.imageWidth}
              height={pro.imageHeight}
              priority
              sizes="(max-width: 860px) 40vw, 300px"
              className={styles.duoPro}
            />
          </div>
        );
      case "prime":
      case "pro": {
        const p = s.visual === "prime" ? prime : pro;
        return (
          <Image
            src={p.image}
            alt={p.alt}
            width={p.imageWidth}
            height={p.imageHeight}
            sizes="(max-width: 860px) 70vw, 520px"
            className={styles.single}
            loading={active ? "eager" : "lazy"}
          />
        );
      }
      case "chip":
        // the chip slide uses a full bleed photo background instead
        return null;
      case "console":
        return (
          <div className={styles.bezel}>
            <div className={styles.bezelScreen}>
              <ConsoleScreen className={styles.bezelSvg} label="Laser Pro touchscreen showing printer, tray and queue status" />
            </div>
          </div>
        );
    }
  };

  return (
    <section
      ref={rootRef}
      className={styles.slider}
      aria-roledescription="carousel"
      aria-label="Aexon imagers"
      onKeyDown={onKeyDown}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHold(true)}
      onPointerLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setHold(false);
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <div className={styles.track} aria-live={running ? "off" : "polite"}>
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <div
              key={s.title}
              className={styles.slide}
              data-active={active ? "true" : "false"}
              data-visual={s.visual}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${s.title}`}
              aria-hidden={!active}
              inert={!active}
            >
              {s.visual === "chip" && (
                <div className={styles.photoBg}>
                  <Image src={chipImage} alt="" fill sizes="100vw" className={styles.photoImg} loading="lazy" />
                </div>
              )}
              <div className={`container ${styles.inner}`}>
                <div className={styles.copy}>
                  <p className="caption-1 eyebrow">{s.eyebrow}</p>
                  <p className={`heading-2 ${styles.title}`}>{s.title}</p>
                  <p className={`body-3 muted ${styles.body}`}>{s.body}</p>
                  <Link href={s.href} className="link-arrow button-md">
                    {s.cta} <ArrowRight size={16} weight="bold" aria-hidden />
                  </Link>
                </div>
                <div className={styles.visual}>{visual(s, active)}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`container ${styles.controls}`}>
        <div className={styles.dots} role="group" aria-label="Choose slide">
          {slides.map((s, i) => (
            <button
              key={s.title}
              type="button"
              className={styles.dot}
              data-active={i === index ? "true" : "false"}
              aria-label={`Slide ${i + 1}: ${s.title}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => go(i)}
            >
              <span
                className={styles.dotFill}
                data-running={i === index && running ? "true" : "false"}
                style={{ animationDuration: `${INTERVAL}ms` }}
              />
            </button>
          ))}
        </div>
        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.btn}
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause slides" : "Play slides"}
          >
            {playing ? <Pause size={16} weight="fill" aria-hidden /> : <Play size={16} weight="fill" aria-hidden />}
          </button>
          <button type="button" className={styles.btn} data-arrow onClick={() => go(index - 1)} aria-label="Previous slide">
            <CaretLeft size={16} weight="bold" aria-hidden />
          </button>
          <button type="button" className={styles.btn} data-arrow onClick={() => go(index + 1)} aria-label="Next slide">
            <CaretRight size={16} weight="bold" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
