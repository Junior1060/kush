/* eslint-disable @next/next/no-img-element */
import { PLACEHOLDER_BG } from "@/lib/style";

// Circular avatar: grayscale photo if available, else an initial on a dark-gray→black
// gradient. Optional black ring (monochrome editorial style).
export function Avatar({
  initial,
  photoUrl,
  size = 56,
  fontSize = 21,
  ring = false,
  children,
}: {
  initial: string;
  tint?: string; // ignored in monochrome; kept for call-site compatibility
  photoUrl?: string | null;
  size?: number;
  fontSize?: number;
  ring?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="relative flex flex-none items-center justify-center overflow-hidden rounded-full"
      style={{
        width: size,
        height: size,
        background: PLACEHOLDER_BG,
        boxShadow: ring ? "0 0 0 1.5px #FFFFFF, 0 0 0 3px #0A0A0A" : undefined,
      }}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={initial}
          className="kush-photo absolute inset-0 h-full w-full rounded-full object-cover"
        />
      ) : (
        <span className="font-display font-bold text-white" style={{ fontSize }}>
          {initial}
        </span>
      )}
      {children}
    </div>
  );
}
