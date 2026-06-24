import { FlagIcon } from "./icons";

// The Kush wordmark: South Sudanese flag + word. The flag is the one intentional
// spot of color in the otherwise monochrome editorial UI.
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
