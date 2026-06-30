import type { SupabaseClient } from "@supabase/supabase-js";
import type { Conversation, Message, Profile } from "./types";
import { completenessScore } from "./profile";

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
  "id, name, age, city, country, route, bio, tags, photos, gender, looking_for, tribe, location_focus, tint, access_status, created_at, last_active_at";

const MESSAGE_COLS =
  "id, match_id, sender_id, body, created_at, edited_at, delivered_at, read_at";

// Bumps the user's recent-activity timestamp (used for discover ranking).
export async function touchLastActive(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  await supabase
    .from("profiles")
    .update({ last_active_at: new Date().toISOString() })
    .eq("id", userId);
}

// Recency boost: very recently active profiles rank higher.
function activityBoost(iso: string, nowMs: number): number {
  const days = (nowMs - new Date(iso).getTime()) / 86_400_000;
  if (days <= 1) return 8;
  if (days <= 7) return 4;
  if (days <= 30) return 1;
  return 0;
}

/**
 * Candidate profiles for the discover deck. Filtering (not me, not already swiped,
 * bidirectional gender match) happens in the `discover_candidates` SQL function via
 * an anti-join, so it scales regardless of how much the user has swiped. The cheap
 * completeness + activity ranking is applied here on the already-filtered set.
 */
export async function getCandidates(supabase: SupabaseClient): Promise<Profile[]> {
  const { data, error } = await supabase.rpc("discover_candidates");
  if (error) throw error;

  const now = Date.now();
  return ((data ?? []) as ProfileRow[])
    .map(toProfile)
    .map((p) => ({
      p,
      score: completenessScore(p) + activityBoost(p.last_active_at, now),
    }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.p.last_active_at).getTime() -
          new Date(a.p.last_active_at).getTime()
    )
    .map((x) => x.p);
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

  const matchIds = matches.map((m) => m.id);
  const otherIds = matches.map((m) => (m.user_a === userId ? m.user_b : m.user_a));

  // Two parallel queries instead of 2 per match (the old N+1): all the other
  // profiles, and every message across these matches in one shot.
  const [{ data: profiles }, { data: msgs }] = await Promise.all([
    supabase.from("profiles").select(PROFILE_COLS).in("id", otherIds),
    supabase
      .from("messages")
      .select(MESSAGE_COLS)
      .in("match_id", matchIds)
      .order("created_at", { ascending: true }),
  ]);

  const profileById = new Map(
    (profiles ?? []).map((p) => [p.id, toProfile(p)])
  );

  // Bucket messages by match (already in chronological order).
  const byMatch = new Map<string, Message[]>();
  for (const msg of (msgs ?? []) as Message[]) {
    const arr = byMatch.get(msg.match_id);
    if (arr) arr.push(msg);
    else byMatch.set(msg.match_id, [msg]);
  }

  const conversations = matches.map((m): Conversation | null => {
    const otherId = m.user_a === userId ? m.user_b : m.user_a;
    const profile = profileById.get(otherId);
    if (!profile) return null;

    const arr = byMatch.get(m.id) ?? [];
    const lastMessage = arr.length ? arr[arr.length - 1] : null;
    // Unread = incoming messages I haven't read yet (read_at still null).
    const unread = arr.filter(
      (x) => x.sender_id !== userId && !x.read_at
    ).length;

    return { matchId: m.id, profile, lastMessage, unread };
  });

  return conversations.filter((c): c is Conversation => c !== null);
}

/** Total unread incoming messages across all of my matches (for the nav badge). */
export async function getUnreadTotal(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  // RLS scopes this to messages in matches I belong to.
  const { count } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .neq("sender_id", userId)
    .is("read_at", null);
  return count ?? 0;
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
    .select(MESSAGE_COLS)
    .eq("match_id", matchId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Message[];
}
