import { redirect } from "next/navigation";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Wordmark } from "@/components/Wordmark";
import { createClient } from "@/lib/supabase/server";
import { getOwnProfile } from "@/lib/queries";
import { signOut } from "@/app/(app)/actions";

// Waitlist screen for users whose access hasn't opened yet (men, post-onboarding).
// Lives outside the (app) route group so the app layout's waitlist guard can redirect
// here without looping.
export default async function WaitlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  // If access has been opened (or this is a woman who landed here by mistake), let them in.
  const profile = await getOwnProfile(supabase, user.id);
  if (profile && profile.access_status === "active") redirect("/discover");

  return (
    <PhoneFrame>
      <div className="kush-scroll mx-auto flex h-full w-full max-w-[460px] flex-col overflow-y-auto px-[26px] pb-[30px] pt-2">
        <div className="flex items-center justify-center pb-[18px] pt-[6px]">
          <Wordmark />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full border-[1.5px] border-ink bg-cream text-[28px]">
            ⏳
          </div>

          <h1 className="m-0 mt-[22px] text-balance font-display text-[28px] font-bold leading-[1.1] tracking-[-0.6px] text-ink">
            Your profile is ready. You&rsquo;re on the waitlist.
          </h1>

          <p className="m-0 mt-[14px] max-w-[340px] text-[15px] leading-[1.5] text-muted">
            We&rsquo;re opening access gradually to keep Kush balanced and meaningful.
          </p>
          <p className="m-0 mt-[10px] max-w-[340px] text-[15px] leading-[1.5] text-muted">
            We&rsquo;ll notify you when your spot opens.
          </p>
        </div>

        <form action={signOut}>
          <button
            type="submit"
            className="mt-4 h-[50px] w-full rounded-button border-[1.5px] border-ink bg-white text-[15px] font-bold text-ink"
          >
            Log out
          </button>
        </form>
      </div>
    </PhoneFrame>
  );
}
