// Compact, chat-list style timestamp: "9:02", "Yesterday", "Mon", or "12 Jun".
export function formatListTime(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  if (sameDay) {
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  if (isYesterday) return "Yesterday";

  const sixDaysAgo = new Date(now);
  sixDaysAgo.setDate(now.getDate() - 6);
  if (d >= sixDaysAgo) {
    return d.toLocaleDateString([], { weekday: "short" });
  }
  return d.toLocaleDateString([], { day: "numeric", month: "short" });
}

// "Active 5m ago" style label for someone who isn't currently online. Used as the
// offline fallback next to a presence indicator.
export function lastSeen(iso: string | null | undefined): string {
  if (!iso) return "Offline";
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "Active recently";
  if (mins < 60) return `Active ${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Active ${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `Active ${days}d ago`;
  return "Offline";
}
