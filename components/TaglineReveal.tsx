"use client";

import { useEffect, useRef } from "react";
import styles from "./TaglineReveal.module.css";

/**
 * Large type statement. Each word moves from a muted tone to full white,
 * in reading order, as it crosses a trigger line in the viewport.
 */
export default function TaglineReveal({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const words = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-word]"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => w.classList.add(styles.on));
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      // Trigger line sits 65% down the viewport
      const line = window.innerHeight * 0.65;
      for (const w of words) {
        const r = w.getBoundingClientRect();
        w.classList.toggle(styles.on, r.top + r.height / 2 < line);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Only listen while the block is near the viewport
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", onScroll);
          update();
        } else {
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onScroll);
          update();
        }
      },
      { rootMargin: "20% 0px 20% 0px" },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className={`section ${styles.wrap}`} aria-label="Why Aexon">
      <div className="container">
        <p ref={ref} className={`heading-2 ${styles.text}`}>
          {lines.map((line, li) => (
            <span key={li} className={styles.line}>
              {line.split(" ").map((word, wi) => (
                <span key={wi} data-word className={styles.word}>
                  {word}{" "}
                </span>
              ))}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
