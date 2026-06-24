import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getConversations } from "@/lib/queries";
import { firstPhotoUrl } from "@/lib/photos";
import { formatListTime } from "@/lib/time";
import { Avatar } from "@/components/Avatar";

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const conversations = user ? await getConversations(supabase, user.id) : [];

  // Most recent activity first.
  const sorted = [...conversations].sort((a, b) => {
    const at = a.lastMessage?.created_at ?? "";
    const bt = b.lastMessage?.created_at ?? "";
    return bt.localeCompare(at);
  });

  return (
    <div className="kush-scroll mx-auto h-full w-full max-w-[680px] overflow-y-auto pb-[24px] pt-1">
      <h1 className="mx-[22px] mb-4 mt-[6px] font-display text-[26px] font-bold tracking-[-0.5px] text-ink">
        Messages
      </h1>

      {sorted.length === 0 && (
        <p className="mt-10 px-[22px] text-center text-[14px] text-muted">
          No conversations yet. Matches show up here once you connect.
        </p>
      )}

      {sorted.map((c) => {
        const me = user?.id;
        const last = c.lastMessage;
        const preview = last
          ? `${last.sender_id === me ? "You: " : ""}${last.body}`
          : "You matched — say hello 👋";
        const unread = c.unread > 0;

        return (
          <Link
            key={c.matchId}
            href={`/chat/${c.matchId}`}
            className="flex w-full items-center gap-[14px] px-[22px] py-[13px] text-left"
          >
            <Avatar
              initial={c.profile.initial}
              tint={c.profile.tint}
              photoUrl={firstPhotoUrl(supabase, c.profile.photos)}
              size={56}
              fontSize={21}
            />
            <div className="min-w-0 flex-1 border-b border-[rgba(27,23,20,0.07)] pb-[13px]">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-body text-[16px] font-bold text-ink">
                  {c.profile.name}
                </span>
                <span className="flex-none text-[12px] text-faint">
                  {formatListTime(last?.created_at ?? null)}
                </span>
              </div>
              <div className="mt-[3px] flex items-center justify-between gap-[10px]">
                <span
                  className="truncate text-[13.5px]"
                  style={{
                    color: unread ? "#0A0A0A" : "#6B6B6B",
                    fontWeight: unread ? 600 : 400,
                  }}
                >
                  {preview}
                </span>
                {unread && (
                  <span className="flex h-[20px] min-w-[20px] flex-none items-center justify-center rounded-[10px] bg-red px-[6px] text-[11px] font-bold text-white">
                    {c.unread}
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
