"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Message, Profile } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { firstPhotoUrl } from "@/lib/photos";
import { sendMessage } from "@/app/(app)/actions";
import { Avatar } from "@/components/Avatar";
import { BackIcon, SendIcon } from "@/components/icons";

export function ChatThread({
  matchId,
  meId,
  profile,
  initialMessages,
}: {
  matchId: string;
  meId: string;
  profile: Profile;
  initialMessages: Message[];
}) {
  const supabase = useMemo(() => createClient(), []);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Realtime: append messages inserted into this match by either party.
  useEffect(() => {
    const channel = supabase
      .channel(`messages:${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const msg = payload.new as Message;
          setMessages((prev) =>
            prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
          );
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, matchId]);

  // Keep pinned to the latest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function send() {
    const body = draft.trim();
    if (!body || sending) return;
    setDraft("");
    setSending(true);
    await sendMessage(matchId, body);
    setSending(false);
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <div className="flex flex-none items-center gap-3 border-b border-[rgba(27,23,20,0.07)] px-[18px] pb-3 pt-[2px]">
        <Link
          href="/messages"
          aria-label="Back"
          className="-ml-2 flex h-[38px] w-[38px] items-center justify-center"
        >
          <BackIcon size={22} />
        </Link>
        <Avatar
          initial={profile.initial}
          tint={profile.tint}
          photoUrl={firstPhotoUrl(supabase, profile.photos)}
          size={40}
          fontSize={16}
        />
        <div className="min-w-0 flex-1">
          <div className="font-body text-[16px] font-bold text-ink">
            {profile.name}
          </div>
          <div className="text-[12px] font-semibold text-green">Active now</div>
        </div>
      </div>

      {/* Thread */}
      <div
        ref={scrollRef}
        className="kush-scroll flex flex-1 flex-col gap-[9px] overflow-y-auto px-[18px] pb-2 pt-[18px]"
      >
        <div className="mb-[6px] text-center text-[11.5px] text-faint">
          You matched on Kush · Today
        </div>
        {messages.map((m) => {
          const mine = m.sender_id === meId;
          return (
            <div
              key={m.id}
              className="flex"
              style={{ justifyContent: mine ? "flex-end" : "flex-start" }}
            >
              <div
                className="max-w-[74%] px-[15px] py-[11px] text-[14.5px] leading-[1.4] shadow-[0_4px_10px_-8px_rgba(27,23,20,0.4)]"
                style={{
                  borderRadius: mine ? "20px 20px 5px 20px" : "20px 20px 20px 5px",
                  background: mine ? "#1B1714" : "#FFFFFF",
                  color: mine ? "#F7F2EA" : "#1B1714",
                  border: mine ? "none" : "1px solid rgba(27,23,20,0.08)",
                }}
              >
                {m.body}
              </div>
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <div className="flex flex-none items-center gap-[10px] px-4 pb-4 pt-[10px]">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={`Message ${profile.name}…`}
          className="h-[46px] flex-1 rounded-pill border border-[rgba(27,23,20,0.12)] bg-surface px-[18px] text-[14.5px] text-ink outline-none placeholder:text-faint"
        />
        <button
          onClick={send}
          disabled={sending}
          aria-label="Send"
          className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-full border-none bg-ink disabled:opacity-70"
        >
          <SendIcon size={20} />
        </button>
      </div>
    </div>
  );
}
