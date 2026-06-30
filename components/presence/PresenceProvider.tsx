"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";

// Set of user ids currently connected (anyone with the app open). Backed by
// Supabase Realtime Presence — truly live, so only people actually online appear.
const OnlineContext = createContext<Set<string>>(new Set());

export function useIsOnline(userId: string | null | undefined): boolean {
  const online = useContext(OnlineContext);
  return userId ? online.has(userId) : false;
}

export function PresenceProvider({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const [online, setOnline] = useState<Set<string>>(new Set());

  useEffect(() => {
    const supabase = createClient();
    // presence key = our user id, so presenceState() is keyed by user id.
    const channel = supabase.channel("online-users", {
      config: { presence: { key: userId } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        setOnline(new Set(Object.keys(channel.presenceState())));
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId]);

  const value = useMemo(() => online, [online]);
  return <OnlineContext.Provider value={value}>{children}</OnlineContext.Provider>;
}
