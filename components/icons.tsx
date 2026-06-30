// Inline SVG icons ported verbatim from the Kush prototype for pixel fidelity.

type IconProps = { size?: number; className?: string; style?: React.CSSProperties };

const STAR_POINTS =
  "12 2.5 14.7 9 21.6 9.5 16.3 14 18 20.8 12 17 6 20.8 7.7 14 2.4 9.5 9.3 9";

export function StarIcon({ size = 22, fill = "#0A0A0A", className, style }: IconProps & { fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}>
      <polygon points={STAR_POINTS} fill={fill} />
    </svg>
  );
}

// South Sudanese flag — used as the Kush logo mark. `size` is the height; width is 1.5x.
export function FlagIcon({ size = 22 }: { size?: number }) {
  const h = size;
  const w = Math.round(size * 1.5);
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 30 20"
      style={{ borderRadius: 3, overflow: "hidden", flex: "none" }}
    >
      {/* green base (bottom band) */}
      <rect width="30" height="20" fill="#2E7D54" />
      {/* black top band */}
      <rect width="30" height="6.2" fill="#0E0E0E" />
      {/* white fimbriation + red middle band + white fimbriation */}
      <rect y="6.2" width="30" height="0.8" fill="#FFFFFF" />
      <rect y="7" width="30" height="6" fill="#CE3B33" />
      <rect y="13" width="30" height="0.8" fill="#FFFFFF" />
      {/* blue hoist triangle */}
      <polygon points="0,0 0,20 13,10" fill="#1E3A6B" />
      {/* gold star */}
      <g transform="translate(1,6.5) scale(0.3)">
        <polygon points={STAR_POINTS} fill="#FADA17" />
      </g>
    </svg>
  );
}

export function FilterIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth={1.8} strokeLinecap="round">
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
      <circle cx="9" cy="7" r="2.4" fill="#FFFFFF" />
      <circle cx="15" cy="12" r="2.4" fill="#FFFFFF" />
      <circle cx="8" cy="17" r="2.4" fill="#FFFFFF" />
    </svg>
  );
}

export function PinIcon({ size = 13, stroke = "#0A0A0A" }: IconProps & { stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={2}>
      <path d="M12 21c4-4 7-7.4 7-11a7 7 0 1 0-14 0c0 3.6 3 7 7 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

export function CloseIcon({ size = 24, stroke = "#0A0A0A" }: IconProps & { stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={2.4} strokeLinecap="round">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

export function HeartIcon({ size = 26 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        d="M12 21C12 21 4 14.6 4 8.9 4 5.7 6.3 4 8.4 4 10.1 4 11.3 5 12 6.2 12.7 5 13.9 4 15.6 4 17.7 4 20 5.7 20 8.9 20 14.6 12 21 12 21Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function BackIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 5 8 12 15 19" />
    </svg>
  );
}

export function SendIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="6" />
      <polyline points="6 12 12 5 18 12" />
    </svg>
  );
}

export function GearIcon({ size = 19 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 6.6 19l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H2a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 3.7 7.7L3.6 7.6a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H8.4a1.6 1.6 0 0 0 1-1.5V2a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V8.4a1.6 1.6 0 0 0 1.5 1H22a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1.6z" />
    </svg>
  );
}

export function ChevronIcon({ size = 18, stroke = "#9B9B9B" }: IconProps & { stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

// ---- Bottom nav icons (use currentColor for active/idle tinting) ----

export function DiscoverNavIcon({ size = 25 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9}>
      <circle cx="12" cy="12" r="9" />
      <polygon points="12 7 14 12 12 17 10 12" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MatchesNavIcon({ size = 25, fill = "none" }: IconProps & { fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
      <polygon points={STAR_POINTS} fill={fill} />
    </svg>
  );
}

export function MessagesNavIcon({ size = 25 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round">
      <path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4V6a1 1 0 0 1 1-1z" />
    </svg>
  );
}

export function NotificationsNavIcon({ size = 25 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9a6 6 0 0 1 12 0c0 5 1.5 6.5 2 7H4c.5-.5 2-2 2-7z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function ProfileNavIcon({ size = 25 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 19.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
    </svg>
  );
}
