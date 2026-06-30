"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Message, Profile } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { firstPhotoUrl } from "@/lib/photos";
import {
  deleteMessage,
  editMessage,
  markRead,
  sendMessage,
} from "@/app/(app)/actions";
import { Avatar } from "@/components/Avatar";
import { OnlineDot, OnlineStatus } from "@/components/presence/OnlineStatus";
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
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Realtime: reflect inserts, edits, and deletions from either party live.
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
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const msg = payload.new as Message;
          setMessages((prev) => prev.map((m) => (m.id === msg.id ? msg : m)));
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const gone = payload.old as Message;
          setMessages((prev) => prev.filter((m) => m.id !== gone.id));
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

  // Opening the conversation marks the other person's messages as read. Re-runs
  // when a new unread message from them arrives while the thread is open.
  const unreadIncoming = messages.some(
    (m) => m.sender_id !== meId && !m.read_at
  );
  useEffect(() => {
    if (unreadIncoming) void markRead(matchId);
  }, [matchId, unreadIncoming]);

  // The last message I sent — the only one that shows a delivery/read status.
  const lastMineId = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender_id === meId) return messages[i].id;
    }
    return null;
  }, [messages, meId]);

  const editing = editingId
    ? messages.find((m) => m.id === editingId) ?? null
    : null;

  async function send() {
    const body = draft.trim();
    if (!body || sending) return;

    // Editing an existing message.
    if (editingId) {
      const id = editingId;
      const stamp = new Date().toISOString();
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, body, edited_at: stamp } : m))
      );
      setEditingId(null);
      setDraft("");
      await editMessage(matchId, id, body);
      return;
    }

    setDraft("");
    setSending(true);
    const sent = await sendMessage(matchId, body);
    // Show the sent message immediately rather than waiting for the realtime
    // INSERT to echo back. Dedup by id so the realtime event is a no-op.
    if (sent) {
      setMessages((prev) =>
        prev.some((m) => m.id === sent.id) ? prev : [...prev, sent]
      );
    }
    setSending(false);
  }

  function startEdit(m: Message) {
    setMenuFor(null);
    setEditingId(m.id);
    setDraft(m.body);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft("");
  }

  async function remove(m: Message) {
    setMenuFor(null);
    if (editingId === m.id) cancelEdit();
    setMessages((prev) => prev.filter((x) => x.id !== m.id)); // optimistic
    await deleteMessage(matchId, m.id);
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <div className="mx-auto flex w-full max-w-[760px] flex-none items-center gap-3 border-b border-[rgba(27,23,20,0.07)] px-[18px] pb-3 pt-[2px]">
        <Link
          href="/messages"
          aria-label="Back"
          className="-ml-2 flex h-[38px] w-[38px] items-center justify-center"
        >
          <BackIcon size={22} />
        </Link>
        <Link
          href={`/u/${profile.id}`}
          aria-label={`View ${profile.name}'s profile`}
          className="flex min-w-0 flex-1 items-center gap-3"
        >
          <Avatar
            initial={profile.initial}
            tint={profile.tint}
            photoUrl={firstPhotoUrl(supabase, profile.photos)}
            size={40}
            fontSize={16}
          >
            <OnlineDot userId={profile.id} />
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="font-body text-[16px] font-bold text-ink">
              {profile.name}
            </div>
            <OnlineStatus userId={profile.id} lastActiveAt={profile.last_active_at} />
          </div>
        </Link>
      </div>

      {/* Thread */}
      <div
        ref={scrollRef}
        className="kush-scroll mx-auto flex w-full max-w-[760px] flex-1 flex-col gap-[9px] overflow-y-auto px-[18px] pb-2 pt-[18px]"
      >
        <div className="mb-[6px] text-center text-[11.5px] text-faint">
          You matched on Kush · Today
        </div>
        {messages.map((m) => {
          const mine = m.sender_id === meId;
          const menuOpen = menuFor === m.id;
          return (
            <div
              key={m.id}
              className="flex w-full flex-col"
              style={{ alignItems: mine ? "flex-end" : "flex-start" }}
            >
              <div
                className="flex max-w-[80%] items-center gap-2"
                style={{ flexDirection: mine ? "row" : "row-reverse" }}
              >
                {/* Action menu — only on your own messages. */}
                {mine && menuOpen && (
                  <div className="flex flex-none items-center gap-1">
                    <button
                      onClick={() => startEdit(m)}
                      className="rounded-full border-[1.5px] border-ink bg-white px-[10px] py-[3px] text-[11px] font-bold text-ink"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(m)}
                      className="rounded-full border-[1.5px] border-ink bg-white px-[10px] py-[3px] text-[11px] font-bold text-ink"
                    >
                      Delete
                    </button>
                  </div>
                )}

                <div
                  role="button"
                  tabIndex={mine ? 0 : -1}
                  onClick={() => mine && setMenuFor(menuOpen ? null : m.id)}
                  className="min-w-0 whitespace-pre-wrap break-words px-[15px] py-[11px] text-left text-[14.5px] leading-[1.4]"
                  style={{
                    borderRadius: mine
                      ? "20px 20px 5px 20px"
                      : "20px 20px 20px 5px",
                    background: mine ? "#0A0A0A" : "#FFFFFF",
                    color: mine ? "#FFFFFF" : "#0A0A0A",
                    border: editingId === m.id ? "1.5px dashed #FFFFFF" : "1.5px solid #0A0A0A",
                    cursor: mine ? "pointer" : "default",
                  }}
                >
                  {m.body}
                </div>
              </div>
              <div className="mt-[2px] flex items-center gap-1 px-1 text-[10.5px] text-faint">
                {m.edited_at && <span>edited</span>}
                {mine && m.id === lastMineId && (
                  <span className={m.read_at ? "font-semibold text-[#2E7D54]" : ""}>
                    {m.read_at ? "Seen" : m.delivered_at ? "Delivered" : "Sent"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <div className="mx-auto w-full max-w-[760px] flex-none px-4 pb-4 pt-[10px]">
        {editing && (
          <div className="mb-[6px] flex items-center justify-between px-1 text-[12px] text-muted">
            <span className="truncate">
              Editing: <span className="text-ink">{editing.body}</span>
            </span>
            <button
              onClick={cancelEdit}
              className="flex-none font-semibold text-ink underline"
            >
              Cancel
            </button>
          </div>
        )}
        <div className="flex items-center gap-[10px]">
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
              if (e.key === "Escape" && editingId) cancelEdit();
            }}
            placeholder={editingId ? "Edit message…" : `Message ${profile.name}…`}
            className="h-[46px] flex-1 rounded-pill border-[1.5px] border-ink bg-white px-[18px] text-[14.5px] text-ink outline-none placeholder:text-faint"
          />
          <button
            onClick={send}
            disabled={sending}
            aria-label={editingId ? "Save edit" : "Send"}
            className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-full border-[1.5px] border-ink bg-ink text-cream disabled:opacity-70"
          >
            {editingId ? <span className="text-[18px] font-bold">✓</span> : <SendIcon size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
