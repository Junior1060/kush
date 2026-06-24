import { StarIcon } from "./icons";

// The Kush wordmark: solid black star + word (monochrome brand mark).
export function Wordmark({
  size = 27,
  star = 22,
  gap = 9,
}: {
  size?: number;
  star?: number;
  gap?: number;
}) {
  return (
    <div className="flex items-center" style={{ gap }}>
      <StarIcon size={star} fill="#0A0A0A" />
      <span
        className="font-display font-extrabold text-ink"
        style={{ fontSize: size, letterSpacing: "-0.5px" }}
      >
        Kush
      </span>
    </div>
  );
}
