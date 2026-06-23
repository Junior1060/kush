"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "./BottomNav";

// Lays out the screen content + persistent bottom nav. The nav is hidden on Chat
// (full-screen conversation), matching the prototype.
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNav = !pathname.startsWith("/chat/");

  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative flex flex-1 flex-col overflow-hidden">{children}</div>
      {showNav && <BottomNav />}
    </div>
  );
}
