import { GearSix, LockSimpleOpen, Wrench } from "@phosphor-icons/react/dist/ssr";

/*
 * The Laser Pro touchscreen, redrawn as SVG from a photo of the real screen.
 * 1600 × 860, the same proportions as the cropped photo, so the tour regions
 * in content/site.ts line up with it. Positions were measured on the photo.
 */

const FONT = "'Segoe UI', 'Noto Sans', Roboto, Arial, sans-serif";

const queue = [
  ["1", "8x10", "0"],
  ["2", "10x12", "0"],
  ["3", "11x14", "0"],
  ["4", "14x17", "2"],
];

const buttons = [
  { label: "SETTINGS", x: 836, tint: "#2b5fae", icon: "#2f8de8", Icon: GearSix },
  { label: "MAINTAIN", x: 1090, tint: "#1f6f63", icon: "#3cbf5c", Icon: Wrench },
  { label: "OPEN", x: 1344, tint: "#8a3f3a", icon: "#f2713c", Icon: LockSimpleOpen },
];

export default function ConsoleScreen({ className, label }: { className?: string; label: string }) {
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
        <linearGradient id="cs-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22325a" />
          <stop offset="0.55" stopColor="#1b2846" />
          <stop offset="1" stopColor="#25345a" />
        </linearGradient>
        <linearGradient id="cs-status" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1fa6f2" />
          <stop offset="0.6" stopColor="#1c7fec" />
          <stop offset="1" stopColor="#1a5fe2" />
        </linearGradient>
        <linearGradient id="cs-pause" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4bb0f7" />
          <stop offset="1" stopColor="#2f8eef" />
        </linearGradient>
        <linearGradient id="cs-tray" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#47a443" />
          <stop offset="1" stopColor="#3a8c37" />
        </linearGradient>
        {/* faint diagonal streaks, like light on the glass in the photo */}
        <linearGradient id="cs-sheen" x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0.35" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.42" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.68" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.74" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="0.8" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id="cs-text" x="-10%" y="-30%" width="120%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.45" />
        </filter>
      </defs>

      <rect width="1600" height="860" fill="url(#cs-bg)" />

      {/* ---- printer status ---- */}
      <rect x="29" y="4" width="758" height="828" rx="6" fill="url(#cs-status)" stroke="#47c6ff" strokeWidth="9" />
      <text x="407" y="88" textAnchor="middle" fill="#dcebff" fontSize="40" letterSpacing="3">
        INITIALIZING
      </text>
      <g fill="#cfe0ff" fontSize="25" letterSpacing="0.5">
        <text x="135" y="490">Time：2026-07-27 14:02:37</text>
        <text x="135" y="544">Peer AE：RADMAX</text>
        <text x="135" y="598">Total Pages：1</text>
      </g>
      <rect x="119" y="666" width="577" height="116" rx="5" fill="url(#cs-pause)" stroke="#7fd0ff" strokeWidth="3" />
      <text x="407" y="744" textAnchor="middle" fill="#e6f3ff" fontSize="50" letterSpacing="1">
        Pause Print
      </text>

      {/* ---- tray status ---- */}
      {[
        { x: 818, title: "Upper Tray" },
        { x: 1199, title: "Lower Tray" },
      ].map((t) => (
        <g key={t.title}>
          <rect x={t.x} y="9" width="361" height="228" rx="18" fill="url(#cs-tray)" stroke="#62e85c" strokeWidth="5" />
          <g fill="#ffffff" textAnchor="middle" filter="url(#cs-text)">
            <text x={t.x + 180} y="66" fontSize="37" fontWeight="600">{t.title}</text>
            <text x={t.x + 180} y="133" fontSize="24" fill="#e5ffe2">Reading RF-tag</text>
            <text x={t.x + 180} y="207" fontSize="31" fontWeight="600" fill="#eaffea">-- INCH</text>
          </g>
        </g>
      ))}

      {/* ---- print queue ---- */}
      <rect x="808" y="257" width="763" height="330" rx="26" fill="#ffffff" fillOpacity="0.04" stroke="#6f82ab" strokeWidth="3" />
      <rect x="827" y="268" width="723" height="298" fill="#1c2a4b" stroke="#a9b8d8" strokeWidth="2" />
      {queue.map((_, i) => (
        <rect key={i} x="828" y={320 + i * 61.5} width="721" height="61.5" fill={i % 2 ? "#1e2d50" : "#22325a"} />
      ))}
      <g stroke="#a9b8d8" strokeWidth="2">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1="827" x2="1550" y1={320 + i * 61.5} y2={320 + i * 61.5} />
        ))}
      </g>
      <g fill="#dfe8ff" fontSize="28" filter="url(#cs-text)">
        <text x="881" y="304" textAnchor="middle">Index</text>
        <text x="1043" y="304" textAnchor="middle">Size (INCH)</text>
        <text x="1351" y="304" textAnchor="middle">Waiting to be printed</text>
      </g>
      <g fill="#ffffff" fontSize="36" textAnchor="middle" filter="url(#cs-text)">
        {queue.map(([n, size, waiting], i) => (
          <g key={n}>
            <text x="881" y={364 + i * 61.5}>{n}</text>
            <text x="1043" y={364 + i * 61.5}>{size}</text>
            <text x="1351" y={364 + i * 61.5}>{waiting}</text>
          </g>
        ))}
      </g>

      {/* ---- one touch controls ---- */}
      {buttons.map(({ label, x, tint, icon, Icon }) => (
        <g key={label}>
          <rect x={x - 10} y="606" width="230" height="226" rx="16" fill={tint} fillOpacity="0.45" />
          <rect x={x} y="618" width="208" height="196" rx="14" fill="#ffffff" fillOpacity="0.05" stroke="#92a6d0" strokeWidth="3" />
          <rect x={x + 73} y="640" width="62" height="62" rx="12" fill={icon} />
          <Icon x={x + 82} y="649" size={44} weight="fill" color="#ffffff" />
          <text
            x={x + 104}
            y="768"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="33"
            fontWeight="700"
            filter="url(#cs-text)"
          >
            {label}
          </text>
        </g>
      ))}

      <rect width="1600" height="860" fill="url(#cs-sheen)" pointerEvents="none" />
    </svg>
  );
}
