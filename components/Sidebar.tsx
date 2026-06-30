"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "./Wordmark";
import {
  DiscoverNavIcon,
  MatchesNavIcon,
  MessagesNavIcon,
  ProfileNavIcon,
} from "./icons";

const ACTIVE = "#0A0A0A";
const IDLE = "#6B6B6B";

const TABS = [
  { href: "/discover", label: "Discover", Icon: DiscoverNavIcon },
  { href: "/matches", label: "Matches", Icon: MatchesNavIcon },
  { href: "/messages", label: "Messages", Icon: MessagesNavIcon },
  { href: "/profile", label: "Profile", Icon: ProfileNavIcon },
];

// Desktop-only left navigation rail.
export function Sidebar({ unread = 0 }: { unread?: number }) {
  const pathname = usePathname();

  return (
    <aside className="hidden h-full w-[248px] flex-none flex-col border-r-[1.5px] border-ink bg-white px-4 py-7 lg:flex">
      <div className="px-3 pb-9">
        <Wordmark size={26} star={22} />
      </div>
      <nav className="flex flex-col gap-1">
        {TABS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-[14px] px-3 py-[11px] text-[15px] font-semibold transition-colors"
              style={{
                color: active ? "#FFFFFF" : IDLE,
                background: active ? ACTIVE : "transparent",
              }}
            >
              {label === "Matches" ? (
                <MatchesNavIcon size={22} fill={active ? "#FFFFFF" : "none"} />
              ) : (
                <Icon size={22} />
              )}
              <span className="flex-1">{label}</span>
              {label === "Messages" && unread > 0 && (
                <span
                  className="flex h-[20px] min-w-[20px] items-center justify-center rounded-full px-[6px] text-[11px] font-bold leading-none"
                  style={{
                    background: active ? "#FFFFFF" : ACTIVE,
                    color: active ? ACTIVE : "#FFFFFF",
                  }}
                >
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
