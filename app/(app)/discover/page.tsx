import { createClient } from "@/lib/supabase/server";
import { getCandidates } from "@/lib/queries";
import { DiscoverScreen } from "@/components/discover/DiscoverScreen";

export default async function DiscoverPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const candidates = user ? await getCandidates(supabase, user.id) : [];

  return <DiscoverScreen candidates={candidates} />;
}
