"use client";

import { useMemo, useRef, useState, type CSSProperties } from "react";
import type { Profile, SwipeDirection } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { firstPhotoUrl } from "@/lib/photos";
import { recordSwipe } from "@/app/(app)/actions";
import { Card } from "./Card";
import { CloseIcon, HeartIcon, StarIcon } from "@/components/icons";

const THRESHOLD = 110;
const clamp = (v: number) => Math.max(0, Math.min(1, v));

const cardBase: CSSProperties = {
  position: "absolute",
  inset: 0,
  borderRadius: "26px",
  overflow: "hidden",
  boxShadow: "0 20px 44px -16px rgba(27,23,20,0.5)",
  touchAction: "none",
  userSelect: "none",
  WebkitUserSelect: "none",
};

type FlyOut = SwipeDirection | null;

export function SwipeDeck({ profiles }: { profiles: Profile[] }) {
  const supabase = useMemo(() => createClient(), []);
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [flyOut, setFlyOut] = useState<FlyOut>(null);
  const [matchToast, setMatchToast] = useState<string | null>(null);
  const startX = useRef(0);

  const deckEmpty = index >= profiles.length;

  function act(type: SwipeDirection) {
    if (flyOut) return;
    const target = profiles[index];
    setFlyOut(type);

    // Persist the swipe; a mutual like/star surfaces a match toast.
    void recordSwipe(target.id, type).then(({ matched }) => {
      if (matched && type !== "pass") {
        setMatchToast(`It's a match with ${target.name}!`);
        setTimeout(() => setMatchToast(null), 2600);
      }
    });

    setTimeout(() => {
      setIndex((i) => i + 1);
      setFlyOut(null);
      setDragX(0);
    }, 360);
  }

  function onDown(e: React.PointerEvent) {
    startX.current = e.clientX;
    setDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* no-op */
    }
  }
  function onMove(e: React.PointerEvent) {
    if (!dragging) return;
    setDragX(e.clientX - startX.current);
  }
  function onUp() {
    setDragging(false);
    if (dragX > THRESHOLD) act("like");
    else if (dragX < -THRESHOLD) act("pass");
    else setDragX(0);
  }

  const slice = profiles.slice(index, index + 3);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative mx-[18px] flex-1">
        {deckEmpty && (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-[30px] text-center">
            <StarIcon size={40} fill="#E2D7C2" />
            <div className="mt-[14px] font-display text-[20px] font-bold text-ink">
              That&rsquo;s everyone for now
            </div>
            <p className="m-0 mt-2 text-[14px] text-muted">
              Check back soon — new people join Kush every day.
            </p>
          </div>
        )}

        {slice.map((profile, k) => {
          const isTop = k === 0;
          let transform: string;
          let transition: string;
          let likeOp = 0;
          let nopeOp = 0;

          if (isTop) {
            if (flyOut) {
              const dir = flyOut === "like" ? 1 : flyOut === "pass" ? -1 : 0;
              const up = flyOut === "star" ? -1 : 0;
              transform = `translate(${dir * 600}px, ${up * 650}px) rotate(${dir * 22}deg)`;
              transition = "transform .36s ease-in, opacity .36s ease-in";
            } else {
              transform = `translate(${dragX}px,0) rotate(${dragX / 24}deg)`;
              transition = dragging ? "none" : "transform .25s ease";
            }
            likeOp = clamp(dragX / THRESHOLD);
            nopeOp = clamp(-dragX / THRESHOLD);
          } else {
            transform = `translateY(${k * 14}px) scale(${1 - k * 0.05})`;
            transition = "transform .25s ease";
          }

          const style: CSSProperties = {
            ...cardBase,
            transform,
            transition,
            zIndex: 10 - k,
            cursor: isTop ? (dragging ? "grabbing" : "grab") : "default",
            pointerEvents: isTop ? "auto" : "none",
            opacity: isTop && flyOut ? 0 : 1,
          };

          return (
            <Card
              key={profile.id}
              profile={profile}
              style={style}
              likeOp={likeOp}
              nopeOp={nopeOp}
              photoUrl={firstPhotoUrl(supabase, profile.photos)}
              onPointerDown={isTop ? onDown : undefined}
              onPointerMove={isTop ? onMove : undefined}
              onPointerUp={isTop ? onUp : undefined}
            />
          );
        })}

        {matchToast && (
          <div className="absolute inset-x-6 bottom-3 z-50 rounded-button bg-ink px-4 py-3 text-center text-[14px] font-semibold text-cream shadow-card">
            {matchToast}
          </div>
        )}
      </div>

      {!deckEmpty && (
        <div className="flex flex-none items-center justify-center gap-5 pb-4 pt-5">
          <button
            onClick={() => act("pass")}
            aria-label="Pass"
            className="flex h-[58px] w-[58px] items-center justify-center rounded-full border border-[rgba(27,23,20,0.1)] bg-surface shadow-btn-pass"
          >
            <CloseIcon size={24} />
          </button>
          <button
            onClick={() => act("star")}
            aria-label="Super like"
            className="flex h-[50px] w-[50px] items-center justify-center rounded-full border-none bg-gold shadow-btn-star"
          >
            <StarIcon size={23} fill="#FFFFFF" />
          </button>
          <button
            onClick={() => act("like")}
            aria-label="Like"
            className="flex h-[58px] w-[58px] items-center justify-center rounded-full border-none bg-red shadow-btn-like"
          >
            <HeartIcon size={26} />
          </button>
        </div>
      )}
    </div>
  );
}
