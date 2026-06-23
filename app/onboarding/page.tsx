import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOwnProfile } from "@/lib/queries";
import { isProfileComplete, homeTownFromRoute } from "@/lib/profile";
import { PhoneFrame } from "@/components/PhoneFrame";
import {
  OnboardingForm,
  type OnboardingInitial,
} from "@/components/onboarding/OnboardingForm";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const isEdit = edit === "1";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const profile = await getOwnProfile(supabase, user.id);

  // Already set up and not explicitly editing → go straight to the app.
  if (!isEdit && isProfileComplete(profile)) redirect("/discover");

  const initial: OnboardingInitial = {
    name: profile?.name ?? "",
    age: profile?.age ? String(profile.age) : "",
    gender: profile?.gender ?? "",
    city: profile?.city ?? "",
    homeTown: profile ? homeTownFromRoute(profile.route) : "",
    bio: profile?.bio ?? "",
    tags: profile?.tags?.join(", ") ?? "",
    location_focus: profile?.location_focus ?? "Both",
    photos: profile?.photos ?? [],
  };

  return (
    <PhoneFrame>
      <OnboardingForm userId={user.id} edit={isEdit} initial={initial} />
    </PhoneFrame>
  );
}
