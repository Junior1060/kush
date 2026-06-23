import { DEFAULT_FILTERS, type Filters } from "./types";

const KEY = "kush.discovery.filters";

// Discovery preferences are stored client-side (localStorage) so the Preferences
// screen and the Discover deck stay in sync without extra schema.
export function loadFilters(): Filters {
  if (typeof window === "undefined") return DEFAULT_FILTERS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_FILTERS;
    return { ...DEFAULT_FILTERS, ...(JSON.parse(raw) as Partial<Filters>) };
  } catch {
    return DEFAULT_FILTERS;
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
