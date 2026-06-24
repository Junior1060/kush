"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Profile, ShowMe } from "@/lib/types";
import { DEFAULT_FILTERS, type Filters } from "@/lib/types";
import { loadFilters, saveFilters } from "@/lib/preferences";
import { updateLookingFor } from "@/app/(app)/actions";
import { Wordmark } from "@/components/Wordmark";
import { FilterIcon } from "@/components/icons";
import { SwipeDeck } from "./SwipeDeck";
import { FiltersSheet } from "./FiltersSheet";

export function DiscoverScreen({
  candidates,
  lookingFor,
}: {
  candidates: Profile[];
  lookingFor: ShowMe | null;
}) {
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>({
    ...DEFAULT_FILTERS,
    showMe: lookingFor ?? DEFAULT_FILTERS.showMe,
  });
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Hydrate age/distance/location from saved prefs; gender ("showMe") comes from
  // the profile (server-authoritative) so the deck and DB never disagree.
  useEffect(() => {
    const saved = loadFilters();
    setFilters({ ...saved, showMe: lookingFor ?? saved.showMe });
  }, [lookingFor]);

  useEffect(() => {
    saveFilters(filters);
  }, [filters]);

  // Gender is filtered on the server; here we only narrow by age + location.
  const filtered = useMemo(() => {
    return candidates.filter((p) => {
      if (p.age < filters.ageMin || p.age > filters.ageMax) return false;
      if (filters.locationFocus !== "Both" && p.location_focus !== filters.locationFocus)
        return false;
      return true;
    });
  }, [candidates, filters.ageMin, filters.ageMax, filters.locationFocus]);

  const deckKey = `${filters.ageMin}-${filters.ageMax}-${filters.locationFocus}`;

  // Changing "Show me" persists to the profile and refetches matching candidates.
  function handleShowMe(next: ShowMe) {
    setFilters((f) => ({ ...f, showMe: next }));
    void updateLookingFor(next).then(() => router.refresh());
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mx-auto flex w-full max-w-[496px] flex-none items-center justify-between px-[24px] pb-3 pt-1">
        <Wordmark size={23} star={18} gap={7} />
        <button
          onClick={() => setFiltersOpen(true)}
          aria-label="Filters"
          className="flex h-[42px] w-[42px] items-center justify-center rounded-[13px] border-[1.5px] border-ink bg-white"
        >
          <FilterIcon size={20} />
        </button>
      </div>

      <SwipeDeck key={deckKey} profiles={filtered} />

      {filtersOpen && (
        <FiltersSheet
          filters={filters}
          setFilters={(updater) => setFilters(updater)}
          onShowMeChange={handleShowMe}
          onClose={() => setFiltersOpen(false)}
        />
      )}
    </div>
  );
}
