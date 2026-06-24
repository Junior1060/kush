import { createClient } from "@/lib/supabase/server";
import { getCandidates, getOwnProfile, touchLastActive } from "@/lib/queries";
import { DiscoverScreen } from "@/components/discover/DiscoverScreen";

export default async function DiscoverPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) await touchLastActive(supabase, user.id);

  const candidates = user ? await getCandidates(supabase, user.id) : [];
  const profile = user ? await getOwnProfile(supabase, user.id) : null;

  return (
    <DiscoverScreen candidates={candidates} lookingFor={profile?.looking_for ?? null} />
  );
}
