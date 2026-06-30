"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

type Toast = {
  kind: "message" | "match";
  matchId: string;
  name: string;
  preview: string;
};

// Responsive app layout: left sidebar nav on desktop, bottom tab bar on mobile.
// The nav is hidden on Chat (full-screen conversation) on mobile.
export function AppShell({
  children,
  unread,
  userId,
}: {
  children: React.ReactNode;
  unread: number;
  userId: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isChat = pathname.startsWith("/chat/");

  const [toast, setToast] = useState<Toast | null>(null);
  // Keep the latest pathname readable inside the realtime callback without
  // resubscribing on every navigation.
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Live: refresh the unread badge and pop a toast when a new message arrives.
  useEffect(() => {
    const supabase = createClient();
    let refreshTimer: ReturnType<typeof setTimeout> | null = null;
    const refresh = () => {
      if (refreshTimer) return; // debounce bursts into a single refresh
      refreshTimer = setTimeout(() => {
        refreshTimer = null;
        router.refresh();
      }, 300);
    };

    const channel = supabase
      .channel("nav-unread")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const msg = payload.new as {
            sender_id: string;
            match_id: string;
            body: string;
          };
          if (msg.sender_id === userId) return; // my own message
          refresh();

          // Don't interrupt with a toast for the chat you're already reading.
          if (pathnameRef.current === `/chat/${msg.match_id}`) return;

          const { data } = await supabase
            .from("profiles")
            .select("name")
            .eq("id", msg.sender_id)
            .maybeSingle();

          if (toastTimer.current) clearTimeout(toastTimer.current);
          setToast({
            kind: "message",
            matchId: msg.match_id,
            name: data?.name || "New message",
            preview:
              msg.body.length > 60 ? `${msg.body.slice(0, 60)}…` : msg.body,
          });
          toastTimer.current = setTimeout(() => setToast(null), 5000);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        () => refresh() // read receipts change my unread count
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "matches" },
        async (payload) => {
          const row = payload.new as {
            id: string;
            user_a: string;
            user_b: string;
          };
          if (row.user_a !== userId && row.user_b !== userId) return;
          const otherId = row.user_a === userId ? row.user_b : row.user_a;
          refresh(); // update the Matches/Messages lists if open

          // The Discover deck shows its own match toast for the active swiper.
          if (pathnameRef.current.startsWith("/discover")) return;

          const { data } = await supabase
            .from("profiles")
            .select("name")
            .eq("id", otherId)
            .maybeSingle();

          if (toastTimer.current) clearTimeout(toastTimer.current);
          setToast({
            kind: "match",
            matchId: row.id,
            name: data?.name || "Someone",
            preview: "You matched! 🎉",
          });
          toastTimer.current = setTimeout(() => setToast(null), 6000);
        }
      )
      .subscribe();

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      void supabase.removeChannel(channel);
    };
  }, [router, userId]);

  function openToast() {
    if (!toast) return;
    const { kind, matchId } = toast;
    setToast(null);
    router.push(kind === "match" ? "/matches" : `/chat/${matchId}`);
  }

  return (
    <div className="relative flex h-full w-full">
      <Sidebar unread={unread} />
      <div className="flex h-full min-w-0 flex-1 flex-col">
        <div className="relative flex flex-1 flex-col overflow-hidden">{children}</div>
        {!isChat && (
          <div className="lg:hidden">
            <BottomNav unread={unread} />
          </div>
        )}
      </div>

      {/* New-message pop-up notification */}
      {toast && (
        <div className="pointer-events-none absolute inset-x-0 top-3 z-[100] flex justify-center px-4">
          <button
            onClick={openToast}
            className="pointer-events-auto flex max-w-[420px] items-center gap-3 rounded-button border-[1.5px] border-ink bg-ink px-4 py-3 text-left text-cream shadow-card"
          >
            <span className="text-[16px]">💬</span>
            <span className="min-w-0 text-[13.5px] leading-[1.3]">
              <span className="font-bold">{toast.name}</span>
              <span className="opacity-90"> · {toast.preview}</span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
