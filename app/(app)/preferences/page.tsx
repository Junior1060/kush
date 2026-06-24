"use client";

import { useEffect, useState } from "react";
import type { Filters, LocationFocus, ShowMe } from "@/lib/types";
import { DEFAULT_FILTERS } from "@/lib/types";
import { loadFilters, saveFilters } from "@/lib/preferences";
import { updateLookingFor } from "@/app/(app)/actions";
import { SubPageHeader } from "@/components/SubPageHeader";

const SECTION = "mb-[10px] text-[12.5px] font-bold uppercase tracking-[0.4px] text-muted";

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
            className="h-[40px] flex-1 rounded-[12px] border-none text-[14px] font-bold transition-all duration-150"
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

export default function PreferencesPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFilters(loadFilters());
  }, []);

  function update(patch: Partial<Filters>) {
    setFilters((f) => ({ ...f, ...patch }));
    setSaved(false);
  }

  function save() {
    saveFilters(filters);
    void updateLookingFor(filters.showMe); // persist gender preference to profile
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  const distanceLabel = filters.distance >= 500 ? "500+ km" : `${filters.distance} km`;

  return (
    <div className="flex h-full w-full flex-col">
      <SubPageHeader title="Preferences" />
      <div className="kush-scroll flex-1 overflow-y-auto px-[22px] pb-[24px]">
        <p className="m-0 mb-5 text-[14px] text-muted">
          Who you see in Discover.
        </p>

        <div className={SECTION}>Show me</div>
        <div className="mb-6">
          <Segmented<ShowMe>
            options={["Women", "Men", "Everyone"]}
            value={filters.showMe}
            onChange={(v) => update({ showMe: v })}
          />
        </div>

        <div className="mb-3 flex items-center justify-between">
          <span className={SECTION.replace("mb-[10px]", "")}>Age range</span>
          <span className="font-display text-[16px] font-bold text-ink">
            {filters.ageMin}–{filters.ageMax}
          </span>
        </div>
        <div className="mb-6 flex gap-3">
          <div className="flex flex-1 items-center justify-between rounded-input border border-[rgba(27,23,20,0.1)] bg-surface px-[10px] py-2">
            <button
              onClick={() => update({ ageMin: Math.max(18, filters.ageMin - 1) })}
              className="h-[30px] w-[30px] rounded-[9px] border-none bg-[#F1EADD] text-[18px] font-bold text-ink"
            >
              −
            </button>
            <span className="text-[15px] font-bold text-ink">{filters.ageMin}</span>
            <button
              onClick={() =>
                update({ ageMin: Math.min(filters.ageMax - 1, filters.ageMin + 1) })
              }
              className="h-[30px] w-[30px] rounded-[9px] border-none bg-[#F1EADD] text-[18px] font-bold text-ink"
            >
              +
            </button>
          </div>
          <div className="flex flex-1 items-center justify-between rounded-input border border-[rgba(27,23,20,0.1)] bg-surface px-[10px] py-2">
            <button
              onClick={() =>
                update({ ageMax: Math.max(filters.ageMin + 1, filters.ageMax - 1) })
              }
              className="h-[30px] w-[30px] rounded-[9px] border-none bg-[#F1EADD] text-[18px] font-bold text-ink"
            >
              −
            </button>
            <span className="text-[15px] font-bold text-ink">{filters.ageMax}</span>
            <button
              onClick={() => update({ ageMax: Math.min(70, filters.ageMax + 1) })}
              className="h-[30px] w-[30px] rounded-[9px] border-none bg-[#F1EADD] text-[18px] font-bold text-ink"
            >
              +
            </button>
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <span className={SECTION.replace("mb-[10px]", "")}>Maximum distance</span>
          <span className="font-display text-[16px] font-bold text-ink">
            {distanceLabel}
          </span>
        </div>
        <input
          type="range"
          min={5}
          max={500}
          step={5}
          value={filters.distance}
          onChange={(e) => update({ distance: Number(e.target.value) })}
          className="accent-gold mb-6 w-full"
        />

        <div className={SECTION}>Location focus</div>
        <div className="mb-8">
          <Segmented<LocationFocus>
            options={["Home", "Diaspora", "Both"]}
            value={filters.locationFocus}
            onChange={(v) => update({ locationFocus: v })}
          />
        </div>

        <button
          onClick={save}
          className="h-[52px] w-full rounded-button border-none bg-ink text-[16px] font-bold text-cream"
        >
          {saved ? "Saved ✓" : "Save preferences"}
        </button>
      </div>
    </div>
  );
}
