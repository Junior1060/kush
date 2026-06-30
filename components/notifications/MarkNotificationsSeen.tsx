"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { markNotificationsSeen } from "@/app/(app)/actions";

// Renders nothing. On mount it stamps the "seen" time and refreshes so the nav
// badge clears the moment you open Notifications.
export function MarkNotificationsSeen() {
  const router = useRouter();
  useEffect(() => {
    void (async () => {
      await markNotificationsSeen();
      router.refresh();
    })();
  }, [router]);
  return null;
}
