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
    <div className="flex gap-1 rounded-[15px] border-[1.5px] border-ink bg-white p-1">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className="h-[40px] flex-1 rounded-[11px] border-none font-body text-[14px] font-bold transition-colors duration-150"
            style={{
              background: active ? "#0A0A0A" : "transparent",
              color: active ? "#FFFFFF" : "#6B6B6B",
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
    <div className="flex flex-1 items-center justify-between rounded-input border-[1.5px] border-ink bg-white px-[10px] py-2">
      <button
        onClick={onDown}
        className="h-[30px] w-[30px] rounded-[9px] border-[1.5px] border-ink bg-white text-[18px] font-bold leading-none text-ink"
      >
        −
      </button>
      <span className="text-[15px] font-bold text-ink">{value}</span>
      <button
        onClick={onUp}
        className="h-[30px] w-[30px] rounded-[9px] border-[1.5px] border-ink bg-white text-[18px] font-bold leading-none text-ink"
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
  onShowMeChange,
  onClose,
}: {
  filters: Filters;
  setFilters: (updater: (f: Filters) => Filters) => void;
  onShowMeChange: (v: ShowMe) => void;
  onClose: () => void;
}) {
  const { showMe, ageMin, ageMax, distance, locationFocus } = filters;
  const ageLabel = `${ageMin}–${ageMax}`;
  const distanceLabel = distance >= 500 ? "500+ km" : `${distance} km`;

  return (
    <div className="absolute inset-0 z-[70] flex flex-col justify-end">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(0,0,0,0.45)]"
      />
      <div className="relative mx-auto w-full max-w-[496px] rounded-[30px_30px_0_0] border-[1.5px] border-ink bg-white px-[26px] pb-[30px] pt-[10px]">
        <div className="mx-auto mb-[18px] mt-[6px] h-[5px] w-[42px] rounded-[3px] bg-ink" />
        <div className="mb-[22px] flex items-center justify-between">
          <h2 className="m-0 font-display text-[22px] font-bold tracking-[-0.4px] text-ink">
            Discovery
          </h2>
          <button
            onClick={onClose}
            className="border-none bg-transparent text-[15px] font-bold text-ink"
          >
            Done
          </button>
        </div>

        <div className={`${SECTION_LABEL} mb-[10px]`}>Show me</div>
        <div className="mb-[24px]">
          <Segmented<ShowMe>
            options={["Women", "Men", "Everyone"]}
            value={showMe}
            onChange={onShowMeChange}
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
