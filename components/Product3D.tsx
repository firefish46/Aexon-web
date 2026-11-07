"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowsClockwise, HandGrabbing, Plus, X } from "@phosphor-icons/react";
import type { Product } from "@/content/site";
import styles from "./Product3D.module.css";

const MAX_Y = 28; // degrees left and right
const MAX_X = 10; // degrees up and down

const VIEWS = [
  { label: "Left", y: -24, x: 4 },
  { label: "Front", y: 0, x: 0 },
  { label: "Right", y: 24, x: 4 },
] as const;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * A 3D stage for a product photo. Drag, swipe or use arrow keys to turn it.
 * Hotspots float in front of the product on their own depth layer, so they
 * shift with parallax as the product turns.
 */
export default function Product3D({ product }: { product: Product }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const objRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const drag = useRef<{ id: number; sx: number; sy: number; tx: number; ty: number } | null>(null);
  const raf = useRef(0);
  const reduced = useRef(false);

  const [active, setActive] = useState<number | null>(null);
  const [view, setView] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [hinted, setHinted] = useState(false);

  const apply = useCallback(() => {
    const { x, y } = current.current;
    if (objRef.current) {
      objRef.current.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
    }
    if (shadowRef.current) {
      shadowRef.current.style.transform = `translateX(${-y * 1.2}px) scaleX(${1 - Math.abs(y) / 160})`;
    }
  }, []);

  const tick = useCallback(() => {
    const c = current.current;
    const t = target.current;
    const k = reduced.current ? 1 : 0.12;
    c.x += (t.x - c.x) * k;
    c.y += (t.y - c.y) * k;
    apply();
    if (Math.abs(t.x - c.x) > 0.01 || Math.abs(t.y - c.y) > 0.01) {
      raf.current = requestAnimationFrame(tick);
    } else {
      c.x = t.x;
      c.y = t.y;
      apply();
      raf.current = 0;
    }
  }, [apply]);

  const setTarget = useCallback(
    (x: number, y: number) => {
      target.current = { x: clamp(x, -MAX_X, MAX_X), y: clamp(y, -MAX_Y, MAX_Y) };
      if (!raf.current) raf.current = requestAnimationFrame(tick);
    },
    [tick],
  );

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Small turn on load so the depth reads straight away
    const t = window.setTimeout(() => setTarget(3, -14), 300);
    return () => {
      window.clearTimeout(t);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [setTarget]);

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    stageRef.current?.setPointerCapture(e.pointerId);
    drag.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, tx: target.current.x, ty: target.current.y };
    setDragging(true);
    setHinted(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    setTarget(d.tx - dy * 0.08, d.ty + dx * 0.22);
    if (Math.abs(dx) > 4) setView(-1);
  };

  const endDrag = (e: React.PointerEvent) => {
    if (drag.current?.id !== e.pointerId) return;
    drag.current = null;
    setDragging(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const t = target.current;
    if (e.key === "ArrowLeft") setTarget(t.x, t.y - 6);
    else if (e.key === "ArrowRight") setTarget(t.x, t.y + 6);
    else if (e.key === "ArrowUp") setTarget(t.x + 3, t.y);
    else if (e.key === "ArrowDown") setTarget(t.x - 3, t.y);
    else return;
    e.preventDefault();
    setView(-1);
    setHinted(true);
  };

  const goView = (i: number) => {
    setView(i);
    setTarget(VIEWS[i].x, VIEWS[i].y);
  };

  const aspect = product.imageWidth / product.imageHeight;

  return (
    <div className={styles.root}>
      <div
        ref={stageRef}
        className={styles.stage}
        data-dragging={dragging}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="group"
        aria-roledescription="3D product viewer"
        aria-label={`${product.name}. Drag or use the arrow keys to turn it.`}
      >
        <div className={styles.floor} aria-hidden />
        <div ref={shadowRef} className={styles.shadow} aria-hidden />

        <div className={styles.float}>
          <div ref={objRef} className={styles.object} style={{ aspectRatio: aspect }}>
            <Image
              src={product.image}
              alt={product.alt}
              fill
              priority
              sizes="(max-width: 960px) 80vw, 520px"
              className={styles.img}
              draggable={false}
            />

            {product.hotspots.map((h, i) => (
              <button
                key={h.title}
                type="button"
                className={styles.hotspot}
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                data-active={active === i}
                aria-expanded={active === i}
                aria-controls="hotspot-detail"
                aria-label={h.title}
                onClick={() => setActive(active === i ? null : i)}
              >
                <span className={styles.ring} aria-hidden />
                <Plus size={14} weight="bold" aria-hidden />
              </button>
            ))}
          </div>
        </div>

        <p className={`caption-4 ${styles.hint}`} data-hidden={hinted} aria-hidden>
          <HandGrabbing size={16} aria-hidden /> Drag to turn
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.views} role="radiogroup" aria-label="Viewing angle">
          {VIEWS.map((v, i) => (
            <button
              key={v.label}
              type="button"
              role="radio"
              aria-checked={view === i}
              className={`button-sm ${styles.viewBtn}`}
              onClick={() => goView(i)}
            >
              {v.label}
            </button>
          ))}
        </div>
        <button type="button" className={`button-sm ${styles.reset}`} onClick={() => goView(1)}>
          <ArrowsClockwise size={16} aria-hidden /> Reset
        </button>
      </div>

      <div id="hotspot-detail" className={styles.detail} aria-live="polite">
        {active === null ? (
          <p className="body-6 muted">
            Select a <span className={styles.dot} aria-hidden /> marker to see what each part does.
          </p>
        ) : (
          <div className={styles.detailCard}>
            <div>
              <h3 className="title-3">{product.hotspots[active].title}</h3>
              <p className="body-6 muted">{product.hotspots[active].body}</p>
            </div>
            <button type="button" className={styles.close} onClick={() => setActive(null)} aria-label="Close detail">
              <X size={16} aria-hidden />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
