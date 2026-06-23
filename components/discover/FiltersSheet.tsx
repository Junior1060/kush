"use client";

import type { Filters, LocationFocus, ShowMe } from "@/lib/types";

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-2 rounded-[15px] bg-[#EBE3D6] p-1">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className="h-[40px] flex-1 rounded-[12px] border-none font-body text-[14px] font-bold transition-all duration-150"
            style={{
              background: active ? "#1B1714" : "transparent",
              color: active ? "#F7F2EA" : "#6F665C",
              boxShadow: active ? "0 4px 10px -4px rgba(27,23,20,0.4)" : "none",
              cursor: "pointer",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function Stepper({
  value,
  onDown,
  onUp,
}: {
  value: number;
  onDown: () => void;
  onUp: () => void;
}) {
  return (
    <div className="flex flex-1 items-center justify-between rounded-input border border-[rgba(27,23,20,0.1)] bg-surface px-[10px] py-2">
      <button
        onClick={onDown}
        className="h-[30px] w-[30px] rounded-[9px] border-none bg-[#F1EADD] text-[18px] font-bold leading-none text-ink"
      >
        −
      </button>
      <span className="text-[15px] font-bold text-ink">{value}</span>
      <button
        onClick={onUp}
        className="h-[30px] w-[30px] rounded-[9px] border-none bg-[#F1EADD] text-[18px] font-bold leading-none text-ink"
      >
        +
      </button>
    </div>
  );
}

const SECTION_LABEL =
  "text-[12.5px] font-bold uppercase tracking-[0.4px] text-muted";

export function FiltersSheet({
  filters,
  setFilters,
  onClose,
}: {
  filters: Filters;
  setFilters: (updater: (f: Filters) => Filters) => void;
  onClose: () => void;
}) {
  const { showMe, ageMin, ageMax, distance, locationFocus } = filters;
  const ageLabel = `${ageMin}–${ageMax}`;
  const distanceLabel = distance >= 500 ? "500+ km" : `${distance} km`;

  return (
    <div className="absolute inset-0 z-[70] flex flex-col justify-end">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(20,12,8,0.4)]"
      />
      <div className="relative rounded-[30px_30px_42px_42px] bg-cream px-[26px] pb-[30px] pt-[10px] shadow-sheet">
        <div className="mx-auto mb-[18px] mt-[6px] h-[5px] w-[42px] rounded-[3px] bg-[#D8CFC1]" />
        <div className="mb-[22px] flex items-center justify-between">
          <h2 className="m-0 font-display text-[22px] font-bold tracking-[-0.4px] text-ink">
            Discovery
          </h2>
          <button
            onClick={onClose}
            className="border-none bg-transparent text-[15px] font-bold text-red"
          >
            Done
          </button>
        </div>

        <div className={`${SECTION_LABEL} mb-[10px]`}>Show me</div>
        <div className="mb-[24px]">
          <Segmented<ShowMe>
            options={["Women", "Men", "Everyone"]}
            value={showMe}
            onChange={(v) => setFilters((f) => ({ ...f, showMe: v }))}
          />
        </div>

        <div className="mb-3 flex items-center justify-between">
          <span className={SECTION_LABEL}>Age range</span>
          <span className="font-display text-[16px] font-bold text-ink">
            {ageLabel}
          </span>
        </div>
        <div className="mb-[24px] flex gap-3">
          <Stepper
            value={ageMin}
            onDown={() =>
              setFilters((f) => ({ ...f, ageMin: Math.max(18, f.ageMin - 1) }))
            }
            onUp={() =>
              setFilters((f) => ({
                ...f,
                ageMin: Math.min(f.ageMax - 1, f.ageMin + 1),
              }))
            }
          />
          <Stepper
            value={ageMax}
            onDown={() =>
              setFilters((f) => ({
                ...f,
                ageMax: Math.max(f.ageMin + 1, f.ageMax - 1),
              }))
            }
            onUp={() =>
              setFilters((f) => ({ ...f, ageMax: Math.min(70, f.ageMax + 1) }))
            }
          />
        </div>

        <div className="mb-3 flex items-center justify-between">
          <span className={SECTION_LABEL}>Maximum distance</span>
          <span className="font-display text-[16px] font-bold text-ink">
            {distanceLabel}
          </span>
        </div>
        <input
          type="range"
          min={5}
          max={500}
          step={5}
          value={distance}
          onChange={(e) =>
            setFilters((f) => ({ ...f, distance: Number(e.target.value) }))
          }
          className="accent-gold mb-[24px] w-full"
        />

        <div className={`${SECTION_LABEL} mb-[10px]`}>Location focus</div>
        <Segmented<LocationFocus>
          options={["Home", "Diaspora", "Both"]}
          value={locationFocus}
          onChange={(v) => setFilters((f) => ({ ...f, locationFocus: v }))}
        />
      </div>
    </div>
  );
}
