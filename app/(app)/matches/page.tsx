/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getConversations } from "@/lib/queries";
import { firstPhotoUrl } from "@/lib/photos";
import { PLACEHOLDER_BG } from "@/lib/style";
import { Avatar } from "@/components/Avatar";

export default async function MatchesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const conversations = user ? await getConversations(supabase, user.id) : [];
  const newMatches = conversations.filter((c) => !c.lastMessage).slice(0, 8);

  return (
    <div className="kush-scroll mx-auto h-full w-full max-w-[860px] overflow-y-auto px-[22px] pb-[24px] pt-1">
      <h1 className="m-0 mb-1 mt-[6px] font-display text-[26px] font-bold tracking-[-0.5px] text-ink">
        Matches
      </h1>
      <p className="m-0 mb-[18px] text-[14px] text-muted">
        You both said yes. Make the first move.
      </p>

      {conversations.length === 0 && (
        <p className="mt-10 text-center text-[14px] text-muted">
          No matches yet — head to Discover and start swiping.
        </p>
      )}

      {newMatches.length > 0 && (
        <>
          <div className="mb-[11px] text-[12px] font-bold uppercase tracking-[0.6px] text-faint">
            New matches
          </div>
          <div className="kush-scroll -mx-[22px] mb-[22px] flex gap-[14px] overflow-x-auto px-[22px] pb-[6px]">
            {newMatches.map((c) => (
              <Link
                key={c.matchId}
                href={`/chat/${c.matchId}`}
                className="flex w-[66px] flex-none flex-col items-center gap-[7px]"
              >
                <Avatar
                  initial={c.profile.initial}
                  tint={c.profile.tint}
                  photoUrl={firstPhotoUrl(supabase, c.profile.photos)}
                  size={66}
                  fontSize={24}
                  ring
                />
                <span className="max-w-[66px] truncate text-[12.5px] font-semibold text-ink">
                  {c.profile.name}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}

      {conversations.length > 0 && (
        <>
          <div className="mb-3 text-[12px] font-bold uppercase tracking-[0.6px] text-faint">
            All matches
          </div>
          <div className="grid grid-cols-2 gap-[14px] sm:grid-cols-3 lg:grid-cols-4">
            {conversations.map((c) => {
              const photo = firstPhotoUrl(supabase, c.profile.photos);
              return (
                <Link
                  key={c.matchId}
                  href={`/chat/${c.matchId}`}
                  className="relative aspect-[3/4] overflow-hidden rounded-[20px] border-[1.5px] border-ink"
                  style={{ background: photo ? "#000" : PLACEHOLDER_BG }}
                >
                  {photo ? (
                    <img
                      src={photo}
                      alt={c.profile.name}
                      loading="lazy"
                      decoding="async"
                      className="kush-photo absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-[repeating-linear-gradient(120deg,rgba(255,255,255,0.05)_0_2px,transparent_2px_13px)]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display text-[40px] font-bold text-[rgba(255,255,255,0.5)]">
                          {c.profile.initial}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(to_top,rgba(0,0,0,0.85),transparent)]" />
                  <div className="absolute bottom-[11px] left-[12px] text-left text-white">
                    <div className="font-display text-[16px] font-bold">
                      {c.profile.name}, {c.profile.age}
                    </div>
                    <div className="text-[11.5px] font-medium opacity-85">
                      {c.profile.city}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
