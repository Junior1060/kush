/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import type { Profile } from "@/lib/types";
import { StarIcon, PinIcon } from "@/components/icons";

export function Card({
  profile,
  style,
  likeOp,
  nopeOp,
  photoUrl,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  profile: Profile;
  style: CSSProperties;
  likeOp: number;
  nopeOp: number;
  photoUrl: string | null;
  onPointerDown?: (e: React.PointerEvent) => void;
  onPointerMove?: (e: React.PointerEvent) => void;
  onPointerUp?: (e: React.PointerEvent) => void;
}) {
  return (
    <div
      style={{ ...style, background: photoUrl ? "#000" : profile.tint }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={profile.name}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(120deg,rgba(255,255,255,0.05)_0_2px,transparent_2px_14px)]" />
          <div className="absolute left-[14px] top-[14px] rounded-[20px] bg-[rgba(0,0,0,0.16)] px-2 py-[3px] font-mono text-[9.5px] tracking-[0.5px] text-[rgba(255,255,255,0.72)]">
            photo
          </div>
        </>
      )}

      {/* LIKE / NOPE badges */}
      <div
        className="absolute left-[18px] top-[18px] rotate-[-16deg] rounded-[10px] border-[3px] border-green px-[13px] py-[7px]"
        style={{ opacity: likeOp }}
      >
        <span className="font-display text-[24px] font-extrabold tracking-[1px] text-green">
          LIKE
        </span>
      </div>
      <div
        className="absolute right-[18px] top-[18px] rotate-[16deg] rounded-[10px] border-[3px] border-red px-[13px] py-[7px]"
        style={{ opacity: nopeOp }}
      >
        <span className="font-display text-[24px] font-extrabold tracking-[1px] text-red">
          NOPE
        </span>
      </div>

      {/* Bottom scrim + info */}
      <div className="absolute inset-x-0 bottom-0 h-[65%] bg-[linear-gradient(to_top,rgba(28,12,6,0.88)_6%,rgba(28,12,6,0.35)_45%,transparent)]" />
      <div className="absolute inset-x-[20px] bottom-[22px] text-[#FBF5EC]">
        <div className="flex items-center gap-2">
          <span className="font-display text-[28px] font-bold tracking-[-0.5px]">
            {profile.name}
          </span>
          <span className="font-display text-[24px] font-medium opacity-90">
            {profile.age}
          </span>
          <StarIcon size={17} style={{ marginBottom: 3 }} />
        </div>
        <div className="mt-[5px] flex items-center gap-[5px] opacity-90">
          <PinIcon size={13} />
          <span className="text-[13.5px] font-medium">{profile.route}</span>
        </div>
        <p className="line-clamp-2 mt-[9px] text-[13.5px] leading-[1.4] opacity-90">
          {profile.bio}
        </p>
        <div className="mt-[11px] flex flex-wrap gap-[6px]">
          {profile.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-[20px] border border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.16)] px-[11px] py-[5px] text-[11.5px] font-semibold backdrop-blur-[4px]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
