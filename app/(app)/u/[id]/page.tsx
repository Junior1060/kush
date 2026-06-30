/* eslint-disable @next/next/no-img-element */
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfileById } from "@/lib/queries";
import { PLACEHOLDER_BG } from "@/lib/style";
import { StarIcon, PinIcon } from "@/components/icons";
import { BackButton } from "@/components/BackButton";
import { OnlineStatus } from "@/components/presence/OnlineStatus";

// Read-only profile view: anyone can tap a name/avatar to see who someone is.
export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  // Your own profile lives at /profile (with editing controls).
  if (id === user.id) redirect("/profile");

  const profile = await getProfileById(supabase, id);
  if (!profile) notFound();

  const photoUrls = profile.photos.map(
    (p) => supabase.storage.from("photos").getPublicUrl(p).data.publicUrl
  );

  return (
    <div className="kush-scroll mx-auto h-full w-full max-w-[600px] overflow-y-auto pb-[40px]">
      {/* Lead photo */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden"
        style={{ background: photoUrls[0] ? "#000" : PLACEHOLDER_BG }}
      >
        {photoUrls[0] ? (
          <img
            src={photoUrls[0]}
            alt={profile.name}
            className="kush-photo h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-[64px] font-bold text-[rgba(255,255,255,0.5)]">
              {profile.initial}
            </span>
          </div>
        )}
        <BackButton className="absolute left-3 top-3 flex h-[38px] w-[38px] items-center justify-center rounded-full border-[1.5px] border-ink bg-white" />
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-[linear-gradient(to_top,rgba(0,0,0,0.9),transparent)]" />
        <div className="absolute inset-x-[20px] bottom-[18px] text-white">
          <div className="flex items-center gap-2">
            <span className="font-display text-[30px] font-bold tracking-[-0.5px]">
              {profile.name}
            </span>
            <span className="font-display text-[26px] font-medium opacity-90">
              {profile.age}
            </span>
            <StarIcon size={18} fill="#FFFFFF" style={{ marginBottom: 3 }} />
          </div>
          <div className="mt-[5px] flex items-center gap-[5px] opacity-90">
            <PinIcon size={13} stroke="#FFFFFF" />
            <span className="text-[14px] font-medium">{profile.route}</span>
          </div>
        </div>
      </div>

      <div className="px-[22px] py-5">
        <OnlineStatus
          userId={profile.id}
          lastActiveAt={profile.last_active_at}
          className="mb-4"
        />

        {profile.bio && (
          <>
            <div className="mb-2 text-[12.5px] font-bold uppercase tracking-[0.4px] text-faint">
              About
            </div>
            <p className="m-0 mb-5 whitespace-pre-line text-[15px] leading-[1.5] text-ink">
              {profile.bio}
            </p>
          </>
        )}

        <div className="mb-5 flex flex-wrap gap-2">
          {profile.tribe && profile.tribe !== "Prefer not to say" && (
            <Chip label={profile.tribe} />
          )}
          {profile.country && <Chip label={profile.country} />}
          {profile.location_focus && <Chip label={profile.location_focus} />}
        </div>

        {profile.tags.length > 0 && (
          <>
            <div className="mb-2 text-[12.5px] font-bold uppercase tracking-[0.4px] text-faint">
              Interests
            </div>
            <div className="mb-5 flex flex-wrap gap-2">
              {profile.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[20px] border border-ink bg-white px-[13px] py-[7px] text-[13px] font-semibold text-ink"
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}

        {photoUrls.length > 1 && (
          <div className="flex flex-col gap-3">
            {photoUrls.slice(1).map((url, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-[18px] border-[1.5px] border-ink"
              >
                <img
                  src={url}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="kush-photo w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-[10px] border border-ink px-[11px] py-[6px] text-[13px] font-semibold text-ink">
      {label}
    </span>
  );
}
