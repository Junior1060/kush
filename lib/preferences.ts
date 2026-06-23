import { DEFAULT_FILTERS, type Filters } from "./types";

const KEY = "kush.discovery.filters";

// Discovery preferences are stored client-side (localStorage) so the Preferences
// screen and the Discover deck stay in sync without extra schema. `fallback` seeds
// defaults (e.g. the user's saved looking_for) when nothing is stored yet.
export function loadFilters(fallback?: Partial<Filters>): Filters {
  const base = { ...DEFAULT_FILTERS, ...fallback };
  if (typeof window === "undefined") return base;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return base;
    return { ...base, ...(JSON.parse(raw) as Partial<Filters>) };
  } catch {
    return base;
  }
}

export function saveFilters(filters: Filters) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(filters));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}
