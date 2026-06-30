"use client";

import { useIsOnline } from "./PresenceProvider";
import { lastSeen } from "@/lib/time";

// "● Active now" when online, else "Active 5m ago". Used in the chat header and
// on the profile detail screen.
export function OnlineStatus({
  userId,
  lastActiveAt,
  className,
}: {
  userId: string;
  lastActiveAt?: string | null;
  className?: string;
}) {
  const online = useIsOnline(userId);

  if (online) {
    return (
      <div
        className={`flex items-center gap-[5px] text-[12px] font-semibold text-[#2E7D54] ${className ?? ""}`}
      >
        <span className="h-[7px] w-[7px] rounded-full bg-[#2E7D54]" />
        Active now
      </div>
    );
  }

  return (
    <div className={`text-[12px] font-semibold text-faint ${className ?? ""}`}>
      {lastSeen(lastActiveAt)}
    </div>
  );
}

// Small green presence dot to overlay on an avatar. Renders nothing when offline.
export function OnlineDot({ userId }: { userId: string }) {
  const online = useIsOnline(userId);
  if (!online) return null;
  return (
    <span className="absolute bottom-0 right-0 h-[14px] w-[14px] rounded-full border-2 border-white bg-[#2E7D54]" />
  );
}
