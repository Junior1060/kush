"use client";

import { useRouter } from "next/navigation";
import { BackIcon } from "./icons";

// Goes back to wherever you came from (chat, notifications, matches…). Falls back
// to /discover if there's no history to pop.
export function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      aria-label="Back"
      onClick={() => router.back()}
      className={className}
    >
      <BackIcon size={20} />
    </button>
  );
}
