"use client";

import { useEffect, useMemo, useState } from "react";
import type { Profile } from "@/lib/types";
import { DEFAULT_FILTERS, type Filters } from "@/lib/types";
import { loadFilters, saveFilters } from "@/lib/preferences";
import { Wordmark } from "@/components/Wordmark";
import { FilterIcon } from "@/components/icons";
import { SwipeDeck } from "./SwipeDeck";
import { FiltersSheet } from "./FiltersSheet";

const GENDER_FOR: Record<Filters["showMe"], string | null> = {
  Women: "Woman",
  Men: "Man",
  Everyone: null,
};

export function DiscoverScreen({ candidates }: { candidates: Profile[] }) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Hydrate from saved discovery preferences (set here or on the Preferences screen).
  useEffect(() => {
    setFilters(loadFilters());
  }, []);

  // Persist whenever filters change so the two screens stay in sync.
  useEffect(() => {
    saveFilters(filters);
  }, [filters]);

  // Distance is UI-only (no geo data); gender/age/location_focus constrain the deck.
  const filtered = useMemo(() => {
    const wantGender = GENDER_FOR[filters.showMe];
    return candidates.filter((p) => {
      if (wantGender && p.gender !== wantGender) return false;
      if (p.age < filters.ageMin || p.age > filters.ageMax) return false;
      if (filters.locationFocus !== "Both" && p.location_focus !== filters.locationFocus)
        return false;
      return true;
    });
  }, [candidates, filters]);

  // Reset the deck position whenever the filtered set changes.
  const deckKey = useMemo(
    () =>
      `${filters.showMe}-${filters.ageMin}-${filters.ageMax}-${filters.locationFocus}`,
    [filters]
  );

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-none items-center justify-between px-[24px] pb-3 pt-1">
        <Wordmark size={23} star={18} gap={7} />
        <button
          onClick={() => setFiltersOpen(true)}
          aria-label="Filters"
          className="flex h-[42px] w-[42px] items-center justify-center rounded-[13px] border border-[rgba(27,23,20,0.12)] bg-surface"
        >
          <FilterIcon size={20} />
        </button>
      </div>

      <SwipeDeck key={deckKey} profiles={filtered} />

      {filtersOpen && (
        <FiltersSheet
          filters={filters}
          setFilters={(updater) => setFilters(updater)}
          onClose={() => setFiltersOpen(false)}
        />
      )}
    </div>
  );
}
