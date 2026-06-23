"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Gender, LocationFocus, SwipeDirection } from "@/lib/types";
import { buildRoute } from "@/lib/profile";

export interface ProfileInput {
  name: string;
  age: number;
  gender: Gender;
  city: string;
  homeTown: string;
  bio: string;
  tags: string[];
  location_focus: LocationFocus;
  photos: string[];
}

// Create/update the signed-in user's profile (used by onboarding + edit).
export async function updateProfile(
  input: ProfileInput
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  if (!input.name.trim()) return { ok: false, error: "Name is required." };
  if (!input.age || input.age < 18 || input.age > 100)
    return { ok: false, error: "Enter a valid age (18+)." };
  if (!input.city.trim()) return { ok: false, error: "City is required." };
  if (!input.bio.trim()) return { ok: false, error: "Add a short bio." };
  if (input.photos.length === 0)
    return { ok: false, error: "Add at least one photo." };

  const { error } = await supabase
    .from("profiles")
    .update({
      name: input.name.trim(),
      age: input.age,
      gender: input.gender,
      city: input.city.trim(),
      route: buildRoute(input.city, input.homeTown),
      bio: input.bio.trim(),
      tags: input.tags.filter(Boolean).slice(0, 6),
      location_focus: input.location_focus,
      photos: input.photos,
    })
    .eq("id", user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/profile");
  revalidatePath("/discover");
  return { ok: true };
}

/**
 * Record a swipe. A mutual like/star creates a `matches` row via DB trigger.
 * Returns whether a match now exists with the target.
 */
export async function recordSwipe(
  targetId: string,
  direction: SwipeDirection
): Promise<{ matched: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { matched: false };

  await supabase
    .from("swipes")
    .upsert(
      { swiper_id: user.id, target_id: targetId, direction },
      { onConflict: "swiper_id,target_id" }
    );

  // The match trigger fires on insert; check if a match row now exists for this pair.
  const [a, b] = [user.id, targetId].sort();
  const { data: match } = await supabase
    .from("matches")
    .select("id")
    .eq("user_a", a)
    .eq("user_b", b)
    .maybeSingle();

  revalidatePath("/matches");
  revalidatePath("/messages");
  return { matched: Boolean(match) };
}

export async function sendMessage(matchId: string, body: string): Promise<void> {
  const trimmed = body.trim();
  if (!trimmed) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("messages")
    .insert({ match_id: matchId, sender_id: user.id, body: trimmed });

  revalidatePath(`/chat/${matchId}`);
  revalidatePath("/messages");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
