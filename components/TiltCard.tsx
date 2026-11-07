"use client";

import { useRef } from "react";
import styles from "./TiltCard.module.css";

/** A card that tilts toward the pointer in 3D. Static for touch and reduced motion. */
export default function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.transform = `rotateX(${-py * 10}deg) rotateY(${px * 12}deg) translateZ(0)`;
    });
  };

  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div className={styles.scene}>
      <div ref={ref} className={`card ${styles.card}`} onPointerMove={onMove} onPointerLeave={onLeave}>
        <div className={styles.inner}>{children}</div>
      </div>
    </div>
  );
}
