import type { Profile } from "./types";

// A profile is "complete" enough to enter the app once the essentials + a photo exist.
export function isProfileComplete(p: Profile | null): boolean {
  if (!p) return false;
  return (
    !!p.name.trim() &&
    !!p.age &&
    !!p.gender &&
    !!p.looking_for &&
    !!p.country.trim() &&
    !!p.city.trim() &&
    !!p.bio.trim() &&
    p.photos.length > 0
  );
}

// Best-effort extraction of the "from" town out of a stored route string
// (e.g. "Lives in Melbourne · from Juba" -> "Juba"), for prefilling the editor.
export function homeTownFromRoute(route: string): string {
  const m = route.match(/from\s+(.+)$/i);
  return m ? m[1].trim() : "";
}

// How filled-out a profile is (0–12). Drives discover ranking — more complete = higher.
export function completenessScore(p: Profile): number {
  let s = 0;
  s += Math.min(p.photos.length, 3) * 2; // up to 6 for photos
  s += p.bio.trim().length >= 40 ? 2 : p.bio.trim().length > 0 ? 1 : 0;
  s += Math.min(p.tags.length, 3); // up to 3 for interests
  if (p.tribe && p.tribe !== "Prefer not to say") s += 1;
  return s;
}

export function buildRoute(city: string, country: string, homeTown: string): string {
  const c = city.trim();
  const co = country.trim();
  const h = homeTown.trim();
  const lives = co ? `Lives in ${c}, ${co}` : c ? `Lives in ${c}` : "";
  if (h && h.toLowerCase() !== c.toLowerCase()) {
    return lives ? `${lives} · from ${h}` : `From ${h}`;
  }
  return lives;
}
