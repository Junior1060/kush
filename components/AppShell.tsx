"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

// Responsive app layout: left sidebar nav on desktop, bottom tab bar on mobile.
// The nav is hidden on Chat (full-screen conversation) on mobile.
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChat = pathname.startsWith("/chat/");

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="flex h-full min-w-0 flex-1 flex-col">
        <div className="relative flex flex-1 flex-col overflow-hidden">{children}</div>
        {!isChat && (
          <div className="lg:hidden">
            <BottomNav />
          </div>
        )}
      </div>
    </div>
  );
}
