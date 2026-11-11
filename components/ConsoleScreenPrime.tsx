import { CheckCircle, Crosshair, GearSix, WarningCircle, Wrench } from "@phosphor-icons/react/dist/ssr";

/*
 * The Laser Prime touchscreen, drawn as SVG at 1600 × 860. The spec sheet
 * describes a large backlit LCD showing status, alarms and faults, so the
 * screen has four parts: status, film trays, alarms and faults, and controls.
 * The tour regions in content/site.ts match the panel positions below.
 */

const FONT = "'Segoe UI', 'Noto Sans', Roboto, Arial, sans-serif";

const trays = [
  { name: "TRAY 1", size: "14x17 in", left: 112, y: 286 },
  { name: "TRAY 2", size: "8x10 in", left: 23, y: 436 },
];

const alerts = [
  { tone: "#f5b544", Icon: WarningCircle, text: "Tray 2 film low (23 sheets)", time: "14:02" },
  { tone: "#43c97b", Icon: CheckCircle, text: "Calibration passed", time: "07:42" },
];

const controls = [
  { label: "CALIBRATE", x: 828, fill: "#174a63", icon: "#3ec3f2", Icon: Crosshair },
  { label: "SETTINGS", x: 1082, fill: "#22385f", icon: "#5d9bf5", Icon: GearSix },
  { label: "MAINTAIN", x: 1336, fill: "#1f5047", icon: "#45c986", Icon: Wrench },
];

export default function ConsoleScreenPrime({ className, label }: { className?: string; label: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1600 860"
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid slice"
      fontFamily={FONT}
    >
      <defs>
        <linearGradient id="cp-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#13202e" />
          <stop offset="1" stopColor="#0d1722" />
        </linearGradient>
        <linearGradient id="cp-ready" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#13804f" />
          <stop offset="1" stopColor="#0d5f3c" />
        </linearGradient>
        <linearGradient id="cp-panel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c2b3c" />
          <stop offset="1" stopColor="#172433" />
        </linearGradient>
        <linearGradient id="cp-sheen" x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0.38" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="0.52" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="1600" height="860" fill="url(#cp-bg)" />

      {/* ---- top bar ---- */}
      <text x="40" y="66" fill="#e8f1fb" fontSize="34" fontWeight="600" letterSpacing="2">
        LASER PRIME
      </text>
      <circle cx="1196" cy="54" r="9" fill="#43c97b" />
      <text x="1216" y="64" fill="#b9cadc" fontSize="28">
        DICOM online
      </text>
      <text x="1560" y="64" textAnchor="end" fill="#b9cadc" fontSize="28">
        14:06
      </text>
      <rect x="30" y="94" width="1540" height="2" fill="#26384c" />

      {/* ---- 1. status ---- */}
      <rect x="30" y="110" width="750" height="450" rx="14" fill="url(#cp-ready)" stroke="#2fd08a" strokeWidth="4" />
      <circle cx="104" cy="186" r="22" fill="#9ff0c6" />
      <circle cx="104" cy="186" r="36" fill="none" stroke="#9ff0c6" strokeOpacity="0.35" strokeWidth="6" />
      <text x="152" y="204" fill="#ffffff" fontSize="56" fontWeight="600" letterSpacing="3">
        READY
      </text>
      <g fill="#d6f5e5" fontSize="28">
        <text x="76" y="318">Last job: CT CHEST, 4 sheets</text>
        <text x="76" y="376">Printed today: 86 sheets</text>
        <text x="76" y="434">Speed: 130 sheets/h at 14x17 in</text>
      </g>
      <rect x="76" y="476" width="658" height="2" fill="#ffffff" fillOpacity="0.18" />
      <text x="76" y="530" fill="#a7e9c7" fontSize="26">
        Density calibrated 07:42
      </text>

      {/* ---- 2. film trays ---- */}
      <rect x="810" y="110" width="760" height="450" rx="14" fill="url(#cp-panel)" stroke="#2b4058" strokeWidth="3" />
      <text x="850" y="176" fill="#e8f1fb" fontSize="32" fontWeight="600" letterSpacing="2">
        FILM TRAYS
      </text>
      {trays.map((t) => {
        const w = 640;
        const fill = Math.round((t.left / 150) * w);
        const low = t.left < 30;
        return (
          <g key={t.name}>
            <text x="850" y={t.y - 24} fill="#b9cadc" fontSize="28">
              {t.name}
            </text>
            <text x="1100" y={t.y - 24} fill="#e8f1fb" fontSize="28">
              {t.size}
            </text>
            <text x="1530" y={t.y - 24} textAnchor="end" fill={low ? "#f5b544" : "#e8f1fb"} fontSize="28">
              {t.left} / 150
            </text>
            <rect x="850" y={t.y} width={w} height="40" rx="8" fill="#0e1824" stroke="#2b4058" strokeWidth="2" />
            <rect x="850" y={t.y} width={fill} height="40" rx="8" fill={low ? "#d9952c" : "#2f9be0"} />
          </g>
        );
      })}

      {/* ---- 3. alarms and faults ---- */}
      <rect x="30" y="580" width="750" height="250" rx="14" fill="url(#cp-panel)" stroke="#2b4058" strokeWidth="3" />
      <text x="70" y="640" fill="#e8f1fb" fontSize="30" fontWeight="600" letterSpacing="2">
        ALARMS AND FAULTS
      </text>
      <text x="740" y="640" textAnchor="end" fill="#43c97b" fontSize="26">
        0 faults
      </text>
      {alerts.map((a, i) => (
        <g key={a.text}>
          <rect x="62" y={668 + i * 76} width="686" height="62" rx="8" fill="#0e1824" />
          <a.Icon x={80} y={681 + i * 76} width={36} height={36} color={a.tone} weight="fill" />
          <text x="132" y={710 + i * 76} fill="#d7e3ef" fontSize="26">
            {a.text}
          </text>
          <text x="728" y={710 + i * 76} textAnchor="end" fill="#8197ad" fontSize="24">
            {a.time}
          </text>
        </g>
      ))}

      {/* ---- 4. controls ---- */}
      {controls.map((c) => (
        <g key={c.label}>
          <rect x={c.x} y="580" width="234" height="250" rx="14" fill={c.fill} stroke="#ffffff" strokeOpacity="0.12" strokeWidth="3" />
          <c.Icon x={c.x + 77} y={620} width={80} height={80} color={c.icon} weight="duotone" />
          <text x={c.x + 117} y="780" textAnchor="middle" fill="#e8f1fb" fontSize="28" fontWeight="600" letterSpacing="1.5">
            {c.label}
          </text>
        </g>
      ))}

      <rect width="1600" height="860" fill="url(#cp-sheen)" pointerEvents="none" />
    </svg>
  );
}
