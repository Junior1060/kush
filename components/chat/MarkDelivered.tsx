"use client";

import { useEffect } from "react";
import { markDelivered } from "@/app/(app)/actions";

// Fire-and-forget: when the inbox mounts, mark everything the user has received as
// delivered. Renders nothing.
export function MarkDelivered() {
  useEffect(() => {
    void markDelivered();
  }, []);
  return null;
}
