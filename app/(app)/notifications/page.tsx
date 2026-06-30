import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getNotifications } from "@/lib/queries";
import { firstPhotoUrl } from "@/lib/photos";
import { Avatar } from "@/components/Avatar";
import { MarkNotificationsSeen } from "@/components/notifications/MarkNotificationsSeen";
import type { NotificationItem } from "@/lib/types";

// Human-friendly "2h ago" style stamp.
function timeAgo(iso: string): string {
  const secs = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

function label(n: NotificationItem): string {
  if (n.kind === "match") return "You matched 🎉";
  if (n.kind === "star") return "super-likes you ⭐";
  return "likes your profile 💚";
}

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const items = user ? await getNotifications(supabase, user.id) : [];

  return (
    <div className="kush-scroll mx-auto h-full w-full max-w-[860px] overflow-y-auto px-[22px] pb-[24px] pt-1">
      {/* Stamp these as seen + clear the badge. */}
      <MarkNotificationsSeen />

      <h1 className="m-0 mb-1 mt-[6px] font-display text-[26px] font-bold tracking-[-0.5px] text-ink">
        Notifications
      </h1>
      <p className="m-0 mb-[18px] text-[14px] text-muted">
        People who liked you and your new matches.
      </p>

      {items.length === 0 && (
        <p className="mt-10 text-center text-[14px] text-muted">
          No notifications yet — when someone likes you, it&apos;ll show up here.
        </p>
      )}

      <div className="flex flex-col gap-[10px]">
        {items.map((n) => {
          const photo = firstPhotoUrl(supabase, n.profile.photos);
          const row = (
            <div
              className="flex items-center gap-3 rounded-[18px] border-[1.5px] border-ink bg-white px-[14px] py-[11px]"
              style={{ background: n.unseen ? "#FFFDF6" : "#FFFFFF" }}
            >
              <Avatar
                initial={n.profile.initial}
                tint={n.profile.tint}
                photoUrl={photo}
                size={50}
                fontSize={18}
                ring={n.unseen}
              />
              <div className="min-w-0 flex-1">
                <div className="text-[15px] leading-tight text-ink">
                  <span className="font-bold">{n.profile.name}</span>{" "}
                  <span className="text-muted">{label(n)}</span>
                </div>
                <div className="mt-[2px] text-[12px] text-faint">
                  {timeAgo(n.createdAt)}
                </div>
              </div>
              {n.unseen && (
                <span className="h-[9px] w-[9px] flex-none rounded-full bg-[#2E7D54]" />
              )}
            </div>
          );

          // Matches deep-link to the conversation; likes are informational.
          return n.matchId ? (
            <Link key={`m-${n.matchId}`} href={`/chat/${n.matchId}`}>
              {row}
            </Link>
          ) : (
            <div key={`l-${n.profile.id}-${n.createdAt}`}>{row}</div>
          );
        })}
      </div>
    </div>
  );
}
