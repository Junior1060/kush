"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo } from "react";
import type { Profile, SwipeDirection } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { StarIcon, PinIcon, CloseIcon, HeartIcon, BackIcon } from "@/components/icons";
import { PLACEHOLDER_BG } from "@/lib/style";

// Full-screen profile detail: all photos + info, with Pass / Super / Like actions.
export function ProfileDetail({
  profile,
  onAct,
  onClose,
}: {
  profile: Profile;
  onAct: (type: SwipeDirection) => void;
  onClose: () => void;
}) {
  const supabase = useMemo(() => createClient(), []);
  const photoUrls = profile.photos.map(
    (p) => supabase.storage.from("photos").getPublicUrl(p).data.publicUrl
  );

  return (
    <div className="absolute inset-0 z-[80] flex flex-col bg-white">
      {/* Scrollable content */}
      <div className="kush-scroll flex-1 overflow-y-auto pb-[120px]">
        {/* Lead photo */}
        <div
          className="relative aspect-[3/4] w-full overflow-hidden"
          style={{ background: photoUrls[0] ? "#000" : PLACEHOLDER_BG }}
        >
          {photoUrls[0] ? (
            <img
              src={photoUrls[0]}
              alt={profile.name}
              className="kush-photo h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-[64px] font-bold text-[rgba(255,255,255,0.5)]">
                {profile.initial}
              </span>
            </div>
          )}
          <button
            onClick={onClose}
            aria-label="Back"
            className="absolute left-3 top-3 flex h-[38px] w-[38px] items-center justify-center rounded-full border-[1.5px] border-ink bg-white"
          >
            <BackIcon size={20} />
          </button>
          <div className="absolute inset-x-0 bottom-0 h-[45%] bg-[linear-gradient(to_top,rgba(0,0,0,0.9),transparent)]" />
          <div className="absolute inset-x-[20px] bottom-[18px] text-white">
            <div className="flex items-center gap-2">
              <span className="font-display text-[30px] font-bold tracking-[-0.5px]">
                {profile.name}
              </span>
              <span className="font-display text-[26px] font-medium opacity-90">
                {profile.age}
              </span>
              <StarIcon size={18} fill="#FFFFFF" style={{ marginBottom: 3 }} />
            </div>
            <div className="mt-[5px] flex items-center gap-[5px] opacity-90">
              <PinIcon size={13} stroke="#FFFFFF" />
              <span className="text-[14px] font-medium">{profile.route}</span>
            </div>
          </div>
        </div>

        <div className="px-[22px] py-5">
          {profile.bio && (
            <>
              <div className="mb-2 text-[12.5px] font-bold uppercase tracking-[0.4px] text-faint">
                About
              </div>
              <p className="m-0 mb-5 whitespace-pre-line text-[15px] leading-[1.5] text-ink">
                {profile.bio}
              </p>
            </>
          )}

          <div className="mb-5 flex flex-wrap gap-2">
            {profile.tribe && profile.tribe !== "Prefer not to say" && (
              <Chip label={profile.tribe} />
            )}
            {profile.country && <Chip label={profile.country} />}
            {profile.location_focus && <Chip label={profile.location_focus} />}
          </div>

          {profile.tags.length > 0 && (
            <>
              <div className="mb-2 text-[12.5px] font-bold uppercase tracking-[0.4px] text-faint">
                Interests
              </div>
              <div className="mb-5 flex flex-wrap gap-2">
                {profile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-[20px] border border-ink bg-white px-[13px] py-[7px] text-[13px] font-semibold text-ink"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}

          {photoUrls.length > 1 && (
            <div className="flex flex-col gap-3">
              {photoUrls.slice(1).map((url, i) => (
                <div key={i} className="overflow-hidden rounded-[18px] border-[1.5px] border-ink">
                  <img src={url} alt="" className="kush-photo w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action bar */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-5 bg-[linear-gradient(to_top,#FFFFFF_70%,transparent)] pb-5 pt-6">
        <button
          onClick={() => onAct("pass")}
          aria-label="Pass"
          className="flex h-[58px] w-[58px] items-center justify-center rounded-full border-[1.5px] border-ink bg-white"
        >
          <CloseIcon size={24} stroke="#0A0A0A" />
        </button>
        <button
          onClick={() => onAct("star")}
          aria-label="Super like"
          className="flex h-[50px] w-[50px] items-center justify-center rounded-full border-[1.5px] border-ink bg-white"
        >
          <StarIcon size={23} fill="#0A0A0A" />
        </button>
        <button
          onClick={() => onAct("like")}
          aria-label="Like"
          className="flex h-[58px] w-[58px] items-center justify-center rounded-full border-[1.5px] border-ink bg-ink"
        >
          <HeartIcon size={26} />
        </button>
      </div>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-[10px] border border-ink px-[11px] py-[6px] text-[13px] font-semibold text-ink">
      {label}
    </span>
  );
}
