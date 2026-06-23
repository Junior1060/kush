import { ChevronIcon } from "./icons";

// Styled native <select> — best UX on mobile (uses the OS picker).
export function Select({
  value,
  onChange,
  options,
  placeholder = "Select…",
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-[48px] w-full appearance-none rounded-input border border-[rgba(27,23,20,0.12)] bg-surface px-[16px] pr-10 text-[15px] text-ink outline-none focus:border-[rgba(27,23,20,0.3)] disabled:opacity-50"
        style={{ color: value ? "#1B1714" : "#A89F94" }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} style={{ color: "#1B1714" }}>
            {opt}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90">
        <ChevronIcon size={16} stroke="#8A8178" />
      </div>
    </div>
  );
}
