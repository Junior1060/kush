"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DiscoverNavIcon,
  MatchesNavIcon,
  MessagesNavIcon,
  ProfileNavIcon,
} from "./icons";

const ACTIVE = "#C9962E";
const IDLE = "#B0A79C";

const TABS = [
  { href: "/discover", label: "Discover", Icon: DiscoverNavIcon },
  { href: "/matches", label: "Matches", Icon: MatchesNavIcon },
  { href: "/messages", label: "Messages", Icon: MessagesNavIcon },
  { href: "/profile", label: "Profile", Icon: ProfileNavIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-none items-start border-t border-[rgba(27,23,20,0.07)] bg-[rgba(247,242,234,0.92)] px-4 pb-[max(env(safe-area-inset-bottom),11px)] pt-[11px] backdrop-blur-[12px]">
      {TABS.map(({ href, label, Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        const color = active ? ACTIVE : IDLE;
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center gap-[5px]"
            style={{ color }}
          >
            {label === "Matches" ? (
              <MatchesNavIcon fill={active ? ACTIVE : "none"} />
            ) : (
              <Icon />
            )}
            <span className="text-[11px] font-semibold">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
