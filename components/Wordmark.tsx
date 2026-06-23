import { FlagIcon } from "./icons";

// The Kush wordmark: South Sudanese flag + word. `size` controls the word's font size.
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
      <FlagIcon size={star} />
      <span
        className="font-display font-extrabold text-ink"
        style={{ fontSize: size, letterSpacing: "-0.5px" }}
      >
        Kush
      </span>
    </div>
  );
}
