/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOwnProfile } from "@/lib/queries";
import { firstPhotoUrl } from "@/lib/photos";
import { signOut } from "@/app/(app)/actions";
import { GearIcon, ChevronIcon } from "@/components/icons";
import { PLACEHOLDER_BG } from "@/lib/style";

const SETTINGS = [
  { label: "Edit profile & photos", glyph: "✎", bg: "#F2F2F2", href: "/onboarding?edit=1" },
  { label: "Preferences", glyph: "⚙", bg: "#F2F2F2", href: "/preferences" },
  { label: "Verify your account", glyph: "★", bg: "#F2F2F2", href: "/verify" },
  { label: "Privacy & safety", glyph: "⛨", bg: "#F2F2F2", href: "/privacy" },
];

// Profile completeness, weighted evenly across the fields a user can fill.
function profileStrength(p: {
  name: string;
  age: number;
  city: string;
  route: string;
  bio: string;
  tags: string[];
  photos: string[];
  gender: string | null;
  location_focus: string | null;
}): number {
  const checks = [
    !!p.name,
    !!p.age,
    !!p.city,
    !!p.route,
    !!p.bio,
    p.tags.length > 0,
    p.photos.length > 0,
    !!p.gender,
    !!p.location_focus,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const profile = await getOwnProfile(supabase, user.id);
  const photo = profile ? firstPhotoUrl(supabase, profile.photos) : null;
  const strength = profile ? profileStrength(profile) : 0;

  const name = profile?.name || "Your name";
  const age = profile?.age || null;
  const route = profile?.route || "Add your home & city";

  return (
    <div className="kush-scroll mx-auto h-full w-full max-w-[600px] overflow-y-auto px-[22px] pb-[24px] pt-1">
      <div className="my-[4px] mb-[18px] flex items-center justify-between">
        <h1 className="m-0 font-display text-[26px] font-bold tracking-[-0.5px] text-ink">
          Profile
        </h1>
        <Link
          href="/preferences"
          aria-label="Settings"
          className="flex h-[42px] w-[42px] items-center justify-center rounded-[13px] border-[1.5px] border-ink bg-white"
        >
          <GearIcon size={19} />
        </Link>
      </div>

      {/* Hero */}
      <div
        className="relative aspect-square overflow-hidden rounded-card border-[1.5px] border-ink"
        style={{ background: photo ? "#000" : PLACEHOLDER_BG }}
      >
        {photo ? (
          <img src={photo} alt={name} className="kush-photo absolute inset-0 h-full w-full object-cover" />
        ) : (
          <>
            <div className="absolute inset-0 bg-[repeating-linear-gradient(120deg,rgba(255,255,255,0.05)_0_2px,transparent_2px_14px)]" />
            <div className="absolute left-[14px] top-[14px] rounded-[20px] bg-[rgba(0,0,0,0.18)] px-2 py-[3px] font-mono text-[9.5px] text-[rgba(255,255,255,0.72)]">
              photo · you
            </div>
          </>
        )}
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(to_top,rgba(0,0,0,0.85),transparent)]" />
        <div className="absolute bottom-[18px] left-[20px] text-white">
          <div className="flex items-center gap-2">
            <span className="font-display text-[27px] font-bold tracking-[-0.5px]">{name}</span>
            {age && (
              <span className="font-display text-[23px] font-medium opacity-90">{age}</span>
            )}
          </div>
          <div className="mt-[3px] text-[13.5px] font-medium opacity-90">{route}</div>
        </div>
      </div>

      {/* Profile strength */}
      <div className="mt-[18px] rounded-[20px] border-[1.5px] border-ink bg-white px-[18px] pb-[6px] pt-[18px]">
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-bold text-ink">Profile strength</span>
          <span className="text-[15px] font-bold text-ink">{strength}%</span>
        </div>
        <div className="my-[11px] mb-[14px] h-2 overflow-hidden rounded-[5px] border border-ink bg-white">
          <div
            className="h-full rounded-[5px] bg-ink"
            style={{ width: `${strength}%` }}
          />
        </div>
        <p className="m-0 mb-[14px] text-[13px] leading-[1.4] text-muted">
          {strength >= 100
            ? "Your profile is complete — nice work."
            : "Add more photos and details to strengthen your profile."}
        </p>
      </div>

      {/* Settings list */}
      <div className="mt-[14px] overflow-hidden rounded-[20px] border-[1.5px] border-ink bg-white">
        {SETTINGS.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="flex w-full items-center gap-[14px] border-b border-[rgba(10,10,10,0.1)] px-[18px] py-[15px] text-left last:border-b-0"
          >
            <div
              className="flex h-[36px] w-[36px] flex-none items-center justify-center rounded-[11px] border border-ink"
              style={{ background: s.bg }}
            >
              <span className="text-[16px]">{s.glyph}</span>
            </div>
            <span className="flex-1 text-[15px] font-semibold text-ink">{s.label}</span>
            <ChevronIcon size={18} />
          </Link>
        ))}
      </div>

      <form action={signOut}>
        <button
          type="submit"
          className="mt-4 h-[50px] w-full rounded-button border-[1.5px] border-ink bg-white text-[15px] font-bold text-ink"
        >
          Log out
        </button>
      </form>
    </div>
  );
}
