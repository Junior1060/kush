import type { SupabaseClient } from "@supabase/supabase-js";

// Resolve the first stored photo path to a public URL, or null for a gradient placeholder.
export function firstPhotoUrl(
  supabase: SupabaseClient,
  photos: string[] | null | undefined
): string | null {
  if (!photos || photos.length === 0) return null;
  const { data } = supabase.storage.from("photos").getPublicUrl(photos[0]);
  return data.publicUrl ?? null;
}
