// Inline SVG icons ported verbatim from the Kush prototype for pixel fidelity.

type IconProps = { size?: number; className?: string; style?: React.CSSProperties };

const STAR_POINTS =
  "12 2.5 14.7 9 21.6 9.5 16.3 14 18 20.8 12 17 6 20.8 7.7 14 2.4 9.5 9.3 9";

export function StarIcon({ size = 22, fill = "#D8A33B", className, style }: IconProps & { fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}>
      <polygon points={STAR_POINTS} fill={fill} />
    </svg>
  );
}

export function FilterIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#1B1714" strokeWidth={1.8} strokeLinecap="round">
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
      <circle cx="9" cy="7" r="2.4" fill="#F7F2EA" />
      <circle cx="15" cy="12" r="2.4" fill="#F7F2EA" />
      <circle cx="8" cy="17" r="2.4" fill="#F7F2EA" />
    </svg>
  );
}

export function PinIcon({ size = 13, stroke = "#FBF5EC" }: IconProps & { stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={2}>
      <path d="M12 21c4-4 7-7.4 7-11a7 7 0 1 0-14 0c0 3.6 3 7 7 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

export function CloseIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#CE3B33" strokeWidth={2.4} strokeLinecap="round">
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
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#1B1714" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 5 8 12 15 19" />
    </svg>
  );
}

export function SendIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#F7F2EA" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="6" />
      <polyline points="6 12 12 5 18 12" />
    </svg>
  );
}

export function GearIcon({ size = 19 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#1B1714" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 6.6 19l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H2a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 3.7 7.7L3.6 7.6a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H8.4a1.6 1.6 0 0 0 1-1.5V2a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V8.4a1.6 1.6 0 0 0 1.5 1H22a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1.6z" />
    </svg>
  );
}

export function ChevronIcon({ size = 18, stroke = "#C4BBB0" }: IconProps & { stroke?: string }) {
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

export function ProfileNavIcon({ size = 25 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 19.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
    </svg>
  );
}
