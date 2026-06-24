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

const ACTIVE = "#C9962E";
const IDLE = "#6F665C";

const TABS = [
  { href: "/discover", label: "Discover", Icon: DiscoverNavIcon },
  { href: "/matches", label: "Matches", Icon: MatchesNavIcon },
  { href: "/messages", label: "Messages", Icon: MessagesNavIcon },
  { href: "/profile", label: "Profile", Icon: ProfileNavIcon },
];

// Desktop-only left navigation rail.
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-full w-[248px] flex-none flex-col border-r border-[rgba(27,23,20,0.08)] bg-[rgba(247,242,234,0.7)] px-4 py-7 lg:flex">
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
                color: active ? ACTIVE : IDLE,
                background: active ? "rgba(201,150,46,0.10)" : "transparent",
              }}
            >
              {label === "Matches" ? (
                <MatchesNavIcon size={22} fill={active ? ACTIVE : "none"} />
              ) : (
                <Icon size={22} />
              )}
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
