/* eslint-disable @next/next/no-img-element */

// Circular avatar: shows the user's photo if available, else an initial on the
// profile's gradient tint (faithful to the prototype placeholders).
export function Avatar({
  initial,
  tint,
  photoUrl,
  size = 56,
  fontSize = 21,
  ring = false,
  children,
}: {
  initial: string;
  tint: string;
  photoUrl?: string | null;
  size?: number;
  fontSize?: number;
  ring?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="relative flex flex-none items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: tint,
        boxShadow: ring ? "0 0 0 2px #F7F2EA, 0 0 0 4px #D8A33B" : undefined,
      }}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={initial}
          className="absolute inset-0 h-full w-full rounded-full object-cover"
        />
      ) : (
        <span
          className="font-display font-bold text-[#FBF5EC]"
          style={{ fontSize }}
        >
          {initial}
        </span>
      )}
      {children}
    </div>
  );
}
