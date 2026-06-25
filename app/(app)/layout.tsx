import { redirect } from "next/navigation";
import { PhoneFrame } from "@/components/PhoneFrame";
import { AppShell } from "@/components/AppShell";
import { createClient } from "@/lib/supabase/server";
import { getOwnProfile } from "@/lib/queries";
import { isProfileComplete } from "@/lib/profile";

// Protected shell for the four tabbed screens + chat.
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  // Force new / incomplete users through onboarding before they can use the app.
  const profile = await getOwnProfile(supabase, user.id);
  if (!isProfileComplete(profile)) redirect("/onboarding");

  // Waitlisted users (men, until access opens) only ever see the waitlist screen.
  // This is the single gate for all four app surfaces: discovery, matches, likes, messaging.
  if (profile && profile.access_status !== "active") redirect("/waitlist");

  return (
    <PhoneFrame>
      <AppShell>{children}</AppShell>
    </PhoneFrame>
  );
}
