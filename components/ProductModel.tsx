"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowsClockwise, HandGrabbing, MagnifyingGlassMinus, MagnifyingGlassPlus, X } from "@phosphor-icons/react";
import type { Product } from "@/content/site";
import styles from "./Product3D.module.css";
import m from "./ProductModel.module.css";

type ModelViewerEl = HTMLElement & {
  cameraOrbit: string;
  cameraTarget: string;
  fieldOfView: string;
  jumpCameraToGoal: () => void;
  getCameraOrbit: () => { theta: number; phi: number; radius: number };
  autoRotate: boolean;
  resetTurntableRotation: (theta?: number) => void;
};

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        loading?: "auto" | "lazy" | "eager";
        reveal?: "auto" | "manual";
        "camera-controls"?: boolean;
        "camera-orbit"?: string;
        "min-camera-orbit"?: string;
        "max-camera-orbit"?: string;
        "field-of-view"?: string;
        "interaction-prompt"?: string;
        "auto-rotate"?: boolean;
        "auto-rotate-delay"?: number;
        "rotation-per-second"?: string;
        "shadow-intensity"?: string;
        "shadow-softness"?: string;
        exposure?: string;
        "environment-image"?: string;
        "tone-mapping"?: string;
        "disable-zoom"?: boolean;
        "disable-pan"?: boolean;
        "interpolation-decay"?: string;
      };
    }
  }
}

/** Camera presets: "theta phi radius" */
const VIEWS = [
  { label: "Left", orbit: "-40deg 60deg 102%" },
  { label: "Front", orbit: "0deg 55deg 102%" },
  { label: "Right", orbit: "40deg 60deg 102%" },
] as const;

const START = "-28deg 60deg 102%";

/**
 * Real 3D viewer for products that ship a GLB model. Orbit with drag or touch,
 * zoom with wheel or pinch, and hotspots pinned to the model surface.
 */
export default function ProductModel({ product, onFail }: { product: Product; onFail: () => void }) {
  const ref = useRef<ModelViewerEl>(null);
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [view, setView] = useState(-1);
  const [hinted, setHinted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const endRef = useRef<SVGCircleElement>(null);
  const dotRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  // model-viewer touches window at import time, so load it on the client only
  useEffect(() => {
    let cancelled = false;
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    // Self hosted Draco decoder, so the page makes no third party requests.
    // model-viewer reads this global when the module first loads.
    const w = window as unknown as { ModelViewerElement?: Record<string, unknown> };
    w.ModelViewerElement = { ...w.ModelViewerElement, dracoDecoderLocation: "/draco/" };
    import("@google/model-viewer")
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch(onFail);
    return () => {
      cancelled = true;
    };
  }, [onFail]);

  useEffect(() => {
    const el = ref.current;
    if (!ready || !el) return;
    const onProgress = (e: Event) => setProgress((e as CustomEvent<{ totalProgress: number }>).detail.totalProgress);
    const onLoad = () => setLoaded(true);
    const onError = () => onFail();
    const onInteract = (e: Event) => {
      if ((e as CustomEvent<{ source: string }>).detail.source === "user-interaction") {
        setHinted(true);
        setView(-1);
      }
    };
    el.addEventListener("progress", onProgress);
    el.addEventListener("load", onLoad);
    el.addEventListener("error", onError);
    el.addEventListener("camera-change", onInteract);
    return () => {
      el.removeEventListener("progress", onProgress);
      el.removeEventListener("load", onLoad);
      el.removeEventListener("error", onError);
      el.removeEventListener("camera-change", onInteract);
    };
  }, [ready, onFail]);

  // While a detail is open: hold the model still, and keep the card and its
  // leader line attached to the dot every frame (the dot moves if the model turns).
  useEffect(() => {
    const el = ref.current;
    if (active === null) {
      if (el && !reduced) el.autoRotate = true;
      return;
    }
    if (el) el.autoRotate = false;

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);

    let raf = 0;
    const place = () => {
      const stage = stageRef.current;
      const card = cardRef.current;
      const dot = dotRefs.current[active];
      const line = lineRef.current;
      const end = endRef.current;
      if (stage && card && dot && line && end) {
        const S = stage.getBoundingClientRect();
        const D = dot.getBoundingClientRect();
        const hx = D.left + D.width / 2 - S.left;
        const hy = D.top + D.height / 2 - S.top;
        const cw = card.offsetWidth;
        const ch = card.offsetHeight;
        const pad = 16;
        let cx: number, cy: number, ax: number, ay: number, d: string;

        if (S.width < 640) {
          // Phones: card along the bottom of the stage, line drops onto its top edge
          cx = (S.width - cw) / 2;
          cy = S.height - ch - 12;
          ax = Math.min(Math.max(hx, cx + 24), cx + cw - 24);
          ay = cy;
          d = `M${hx} ${hy} L${ax} ${ay - 20} L${ax} ${ay}`;
        } else {
          // Wider: card out to the side the dot is on, line runs to its near edge
          const right = hx >= S.width / 2;
          cx = right
            ? Math.min(S.width - cw - pad * 2, Math.max(hx + 160, S.width * 0.7))
            : Math.max(pad * 2, Math.min(hx - 160 - cw, S.width * 0.3 - cw));
          cy = Math.min(Math.max(hy - ch / 2 - 48, pad), S.height - ch - 72);
          ax = right ? cx : cx + cw;
          ay = cy + Math.min(ch / 2, 36);
          const ex = right ? ax - 48 : ax + 48;
          d = `M${hx} ${hy} L${ex} ${ay} L${ax} ${ay}`;
        }

        card.style.transform = `translate(${Math.round(cx)}px, ${Math.round(cy)}px)`;
        line.setAttribute("d", d);
        end.setAttribute("cx", String(ax));
        end.setAttribute("cy", String(ay));
        // the line only makes sense while the dot faces the camera
        const shown = dot.hasAttribute("data-visible");
        line.style.opacity = shown ? "1" : "0";
        end.style.opacity = shown ? "1" : "0";
      }
      raf = requestAnimationFrame(place);
    };
    raf = requestAnimationFrame(place);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
  }, [active, reduced]);

  const goView = (i: number) => {
    const el = ref.current;
    if (!el) return;
    // auto-rotate turns the model itself, so square it up before aiming the camera
    el.autoRotate = false;
    el.resetTurntableRotation(0);
    el.cameraOrbit = VIEWS[i].orbit;
    el.cameraTarget = "auto auto auto";
    el.fieldOfView = "auto";
    if (reduced) el.jumpCameraToGoal();
    // set after the camera-change event from this programmatic move
    requestAnimationFrame(() => setView(i));
  };

  // Wheel and pinch zoom are off so the page scrolls, which also disables
  // model-viewer's zoom(); the buttons move the camera in and out directly.
  // model-viewer keeps the distance within min and max camera orbit.
  const zoomBy = (factor: number) => {
    const el = ref.current;
    if (!el) return;
    const { theta, phi, radius } = el.getCameraOrbit();
    el.cameraOrbit = `${theta}rad ${phi}rad ${radius * factor}m`;
    if (reduced) el.jumpCameraToGoal();
  };

  const hotspots = product.hotspots.filter((h) => h.position);

  return (
    <div className={`${styles.root} ${m.root}`}>
      <div ref={stageRef} className={`${styles.stage} ${m.stage}`}>

        {ready && (
          <model-viewer
            ref={ref}
            className={m.viewer}
            src={product.model}
            alt={product.alt}
            loading="eager"
            camera-controls
            camera-orbit={START}
            min-camera-orbit="auto 20deg 40%"
            max-camera-orbit="auto 95deg 160%"
            interaction-prompt="none"
            auto-rotate={!reduced || undefined}
            auto-rotate-delay={4000}
            rotation-per-second="12deg"
            shadow-intensity="1"
            shadow-softness="0.9"
            exposure="0.85"
            tone-mapping="neutral"
            disable-pan
            // the viewer spans the screen, so the wheel scrolls the page; zoom uses the buttons
            disable-zoom
            data-loaded={loaded ? "true" : "false"}
          >
            {hotspots.map((h, i) => {
              const idx = product.hotspots.indexOf(h);
              return (
                <button
                  key={h.title}
                  ref={(b) => {
                    dotRefs.current[idx] = b;
                  }}
                  type="button"
                  slot={`hotspot-${i}`}
                  className={m.dot}
                  data-position={h.position}
                  data-normal={h.normal}
                  // model-viewer toggles data-visible when the point faces the camera
                  data-visibility-attribute="visible"
                  data-active={active === idx ? "true" : "false"}
                  aria-expanded={active === idx}
                  aria-controls="hotspot-detail"
                  aria-label={h.title}
                  onClick={() => setActive(active === idx ? null : idx)}
                >
                  <span className={m.dotPulse} aria-hidden />
                </button>
              );
            })}
            <span slot="progress-bar" />
          </model-viewer>
        )}

        {!loaded && (
          <div className={m.loading} role="status">
            <div className={m.bar}>
              <span style={{ transform: `scaleX(${progress})` }} />
            </div>
            <p className="caption-4 muted">Loading 3D model</p>
          </div>
        )}

        <p className={`caption-4 ${styles.hint} ${m.hint}`} data-hidden={hinted || !loaded || active !== null} aria-hidden>
          <HandGrabbing size={16} aria-hidden /> Drag to turn
          {hotspots.length > 0 && (
            <>
              , tap <span className={styles.dot} aria-hidden /> for details
            </>
          )}
        </p>

        {/* Callout: a card beside the model with a line drawn to the selected dot */}
        {hotspots.length > 0 && (
          <div id="hotspot-detail" aria-live="polite">
            {active !== null && (
              <>
                <svg className={m.leader} aria-hidden>
                  <path ref={lineRef} key={`l${active}`} className={m.leaderLine} pathLength={1} />
                  <circle ref={endRef} key={`c${active}`} r="3.5" className={m.leaderEnd} />
                </svg>
                <div ref={cardRef} key={`k${active}`} className={m.callout} role="group" aria-label={product.hotspots[active].title}>
                  <div className={m.calloutInner}>
                    <div className={m.calloutText}>
                      <h3 className="title-3">{product.hotspots[active].title}</h3>
                      <p className="body-6 muted">{product.hotspots[active].body}</p>
                    </div>
                    <button type="button" className={styles.close} onClick={() => setActive(null)} aria-label="Close detail">
                      <X size={16} aria-hidden />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

      {/* Controls also float over the stage, along its bottom edge */}
      <div className={`${styles.controls} ${m.controls}`}>
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
        <div className={m.tools}>
          <button type="button" className={`button-sm ${styles.reset} ${m.zoomBtn}`} onClick={() => zoomBy(0.8)} aria-label="Zoom in">
            <MagnifyingGlassPlus size={16} aria-hidden />
          </button>
          <button type="button" className={`button-sm ${styles.reset} ${m.zoomBtn}`} onClick={() => zoomBy(1.25)} aria-label="Zoom out">
            <MagnifyingGlassMinus size={16} aria-hidden />
          </button>
          <button type="button" className={`button-sm ${styles.reset}`} onClick={() => goView(1)}>
            <ArrowsClockwise size={16} aria-hidden /> <span className={m.resetLabel}>Reset</span>
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
