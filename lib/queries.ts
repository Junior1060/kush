import type { SupabaseClient } from "@supabase/supabase-js";
import type { Conversation, Message, Profile } from "./types";

// Row shape as stored in Postgres (no derived fields).
type ProfileRow = Omit<Profile, "initial"> & { initial?: string };

function toProfile(row: ProfileRow): Profile {
  return {
    ...row,
    tags: row.tags ?? [],
    photos: row.photos ?? [],
    initial: (row.name?.trim()?.[0] ?? "?").toUpperCase(),
  };
}

const PROFILE_COLS =
  "id, name, age, city, country, route, bio, tags, photos, gender, looking_for, tribe, location_focus, tint, created_at";

/** Candidate profiles for the discover deck: not me, and not already swiped by me. */
export async function getCandidates(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile[]> {
  const { data: swiped } = await supabase
    .from("swipes")
    .select("target_id")
    .eq("swiper_id", userId);

  const excluded = [userId, ...(swiped ?? []).map((s) => s.target_id)];

  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLS)
    .not("id", "in", `(${excluded.join(",")})`)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(toProfile);
}

export async function getOwnProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLS)
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data ? toProfile(data) : null;
}

/** All of the current user's matches, joined to the other person's profile + last message. */
export async function getConversations(
  supabase: SupabaseClient,
  userId: string
): Promise<Conversation[]> {
  const { data: matches, error } = await supabase
    .from("matches")
    .select("id, user_a, user_b, created_at")
    .or(`user_a.eq.${userId},user_b.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!matches || matches.length === 0) return [];

  const otherIds = matches.map((m) => (m.user_a === userId ? m.user_b : m.user_a));

  const { data: profiles } = await supabase
    .from("profiles")
    .select(PROFILE_COLS)
    .in("id", otherIds);

  const profileById = new Map(
    (profiles ?? []).map((p) => [p.id, toProfile(p)])
  );

  const conversations = await Promise.all(
    matches.map(async (m): Promise<Conversation | null> => {
      const otherId = m.user_a === userId ? m.user_b : m.user_a;

      const { data: last } = await supabase
        .from("messages")
        .select("id, match_id, sender_id, body, created_at")
        .eq("match_id", m.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      // Unread heuristic (no read-receipt table): messages from the other person
      // newer than my most recent reply in this match.
      const { data: myLast } = await supabase
        .from("messages")
        .select("created_at")
        .eq("match_id", m.id)
        .eq("sender_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      let unreadQuery = supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("match_id", m.id)
        .neq("sender_id", userId);
      if (myLast?.created_at) unreadQuery = unreadQuery.gt("created_at", myLast.created_at);
      const { count } = await unreadQuery;

      const profile = profileById.get(otherId);
      if (!profile) return null;

      return {
        matchId: m.id,
        profile,
        lastMessage: (last as Message | null) ?? null,
        unread: count ?? 0,
      };
    })
  );

  return conversations.filter((c): c is Conversation => c !== null);
}

/** A single conversation by match id (for the chat header), scoped to the current user. */
export async function getConversationByMatch(
  supabase: SupabaseClient,
  userId: string,
  matchId: string
): Promise<Conversation | null> {
  const { data: match } = await supabase
    .from("matches")
    .select("id, user_a, user_b, created_at")
    .eq("id", matchId)
    .or(`user_a.eq.${userId},user_b.eq.${userId}`)
    .maybeSingle();

  if (!match) return null;

  const otherId = match.user_a === userId ? match.user_b : match.user_a;
  const { data: profileRow } = await supabase
    .from("profiles")
    .select(PROFILE_COLS)
    .eq("id", otherId)
    .maybeSingle();

  if (!profileRow) return null;

  return {
    matchId: match.id,
    profile: toProfile(profileRow),
    lastMessage: null,
    unread: 0,
  };
}

export async function getMessages(
  supabase: SupabaseClient,
  matchId: string
): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("id, match_id, sender_id, body, created_at")
    .eq("match_id", matchId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Message[];
}
