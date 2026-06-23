import type { Profile } from "./types";

// A profile is "complete" enough to enter the app once the essentials + a photo exist.
export function isProfileComplete(p: Profile | null): boolean {
  if (!p) return false;
  return (
    !!p.name.trim() &&
    !!p.age &&
    !!p.gender &&
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

export function buildRoute(city: string, homeTown: string): string {
  const c = city.trim();
  const h = homeTown.trim();
  if (h && h.toLowerCase() !== c.toLowerCase()) {
    return `Lives in ${c} · from ${h}`;
  }
  return c ? `Lives in ${c}` : "";
}
