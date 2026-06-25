"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Gender, LocationFocus, ShowMe, SwipeDirection } from "@/lib/types";
import { buildRoute } from "@/lib/profile";
import { touchLastActive } from "@/lib/queries";

export interface ProfileInput {
  name: string;
  age: number;
  gender: Gender;
  lookingFor: ShowMe;
  country: string;
  city: string;
  homeTown: string;
  tribe: string;
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
  if (!input.gender) return { ok: false, error: "Select who you are." };
  if (!input.lookingFor) return { ok: false, error: "Select who you're looking for." };
  if (!input.country.trim()) return { ok: false, error: "Select your country." };
  if (!input.city.trim()) return { ok: false, error: "Select your city." };
  if (!input.bio.trim()) return { ok: false, error: "Add a short bio." };
  if (input.photos.length === 0)
    return { ok: false, error: "Add at least one photo." };

  const { error } = await supabase
    .from("profiles")
    .update({
      name: input.name.trim(),
      age: input.age,
      gender: input.gender,
      looking_for: input.lookingFor,
      country: input.country.trim(),
      city: input.city.trim(),
      tribe: input.tribe,
      route: buildRoute(input.city, input.country, input.homeTown),
      bio: input.bio.trim(),
      tags: input.tags.filter(Boolean).slice(0, 6),
      location_focus: input.location_focus,
      photos: input.photos,
      // access_status is intentionally not set here: it's server-controlled by the
      // enforce_access_status DB trigger (men -> waitlist on onboarding completion),
      // so a client can never elevate itself out of the waitlist.
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

  await touchLastActive(supabase, user.id);

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

// Persist the "Show me" gender preference to the profile (drives server matching).
export async function updateLookingFor(value: ShowMe): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("profiles").update({ looking_for: value }).eq("id", user.id);
  revalidatePath("/discover");
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

  await touchLastActive(supabase, user.id);

  revalidatePath(`/chat/${matchId}`);
  revalidatePath("/messages");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
