"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Gender, LocationFocus } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/app/(app)/actions";

export interface OnboardingInitial {
  name: string;
  age: string;
  gender: Gender | "";
  city: string;
  homeTown: string;
  bio: string;
  tags: string;
  location_focus: LocationFocus;
  photos: string[];
}

const SECTION = "mb-2 text-[12.5px] font-bold uppercase tracking-[0.4px] text-muted";
const INPUT =
  "h-[48px] w-full rounded-input border border-[rgba(27,23,20,0.12)] bg-surface px-[16px] text-[15px] text-ink outline-none placeholder:text-faint focus:border-[rgba(27,23,20,0.3)]";

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T | "";
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-2 rounded-[15px] bg-[#EBE3D6] p-1">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="h-[40px] flex-1 rounded-[12px] border-none text-[14px] font-bold transition-all duration-150"
            style={{
              background: active ? "#1B1714" : "transparent",
              color: active ? "#F7F2EA" : "#6F665C",
              boxShadow: active ? "0 4px 10px -4px rgba(27,23,20,0.4)" : "none",
              cursor: "pointer",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function OnboardingForm({
  userId,
  edit,
  initial,
}: {
  userId: string;
  edit: boolean;
  initial: OnboardingInitial;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const fileInput = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<string[]>(initial.photos);
  const [name, setName] = useState(initial.name);
  const [age, setAge] = useState(initial.age);
  const [gender, setGender] = useState<Gender | "">(initial.gender);
  const [city, setCity] = useState(initial.city);
  const [homeTown, setHomeTown] = useState(initial.homeTown);
  const [bio, setBio] = useState(initial.bio);
  const [tags, setTags] = useState(initial.tags);
  const [locationFocus, setLocationFocus] = useState<LocationFocus>(
    initial.location_focus
  );

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function publicUrl(path: string) {
    return supabase.storage.from("photos").getPublicUrl(path).data.publicUrl;
  }

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files).slice(0, 6 - photos.length)) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${userId}/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage
          .from("photos")
          .upload(path, file, { upsert: true, contentType: file.type });
        if (error) {
          setError(`Upload failed: ${error.message}`);
        } else {
          setPhotos((prev) => [...prev, path]);
        }
      }
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  function removePhoto(path: string) {
    setPhotos((prev) => prev.filter((p) => p !== path));
  }

  async function save() {
    setError(null);
    if (!gender) {
      setError("Select who you are.");
      return;
    }
    setSaving(true);
    const res = await updateProfile({
      name,
      age: Number(age),
      gender,
      city,
      homeTown,
      bio,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      location_focus: locationFocus,
      photos,
    });
    setSaving(false);

    if (!res.ok) {
      setError(res.error ?? "Something went wrong.");
      return;
    }
    router.replace(edit ? "/profile" : "/discover");
    router.refresh();
  }

  return (
    <div className="kush-scroll h-full w-full overflow-y-auto px-[22px] pb-[30px] pt-2">
      <h1 className="m-0 mt-1 font-display text-[26px] font-bold tracking-[-0.5px] text-ink">
        {edit ? "Edit your profile" : "Set up your profile"}
      </h1>
      <p className="m-0 mb-5 mt-1 text-[14px] text-muted">
        {edit
          ? "Update your photos and details."
          : "Add a photo and a few details so people can meet the real you."}
      </p>

      {/* Photos */}
      <div className={SECTION}>Photos</div>
      <div className="mb-5 grid grid-cols-3 gap-[10px]">
        {photos.map((path) => (
          <div
            key={path}
            className="relative aspect-[3/4] overflow-hidden rounded-[14px] bg-[#EBE3D6]"
          >
            <img
              src={publicUrl(path)}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removePhoto(path)}
              aria-label="Remove photo"
              className="absolute right-1 top-1 flex h-[22px] w-[22px] items-center justify-center rounded-full border-none bg-[rgba(27,23,20,0.7)] text-[13px] text-white"
            >
              ✕
            </button>
          </div>
        ))}
        {photos.length < 6 && (
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="flex aspect-[3/4] flex-col items-center justify-center gap-1 rounded-[14px] border border-dashed border-[rgba(27,23,20,0.25)] bg-surface text-muted disabled:opacity-60"
          >
            <span className="text-[26px] leading-none">＋</span>
            <span className="text-[12px] font-semibold">
              {uploading ? "Uploading…" : "Add"}
            </span>
          </button>
        )}
      </div>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => onFiles(e.target.files)}
      />

      {/* Name */}
      <div className={SECTION}>Name</div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your first name"
        className={`${INPUT} mb-5`}
      />

      {/* Age */}
      <div className={SECTION}>Age</div>
      <input
        value={age}
        onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ""))}
        inputMode="numeric"
        placeholder="25"
        className={`${INPUT} mb-5`}
      />

      {/* Gender */}
      <div className={SECTION}>I am a</div>
      <div className="mb-5">
        <Segmented<Gender>
          options={["Woman", "Man", "Nonbinary"]}
          value={gender}
          onChange={setGender}
        />
      </div>

      {/* City */}
      <div className={SECTION}>Current city</div>
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Melbourne"
        className={`${INPUT} mb-5`}
      />

      {/* Home town */}
      <div className={SECTION}>Where you&rsquo;re from</div>
      <input
        value={homeTown}
        onChange={(e) => setHomeTown(e.target.value)}
        placeholder="Juba"
        className={`${INPUT} mb-5`}
      />

      {/* Bio */}
      <div className={SECTION}>Bio</div>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell people a little about you…"
        rows={3}
        className="mb-5 w-full resize-none rounded-input border border-[rgba(27,23,20,0.12)] bg-surface px-[16px] py-3 text-[15px] leading-[1.45] text-ink outline-none placeholder:text-faint focus:border-[rgba(27,23,20,0.3)]"
      />

      {/* Tags */}
      <div className={SECTION}>Interests (comma separated)</div>
      <input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Coffee, Afrobeats, Faith"
        className={`${INPUT} mb-5`}
      />

      {/* Location focus */}
      <div className={SECTION}>You&rsquo;re based</div>
      <div className="mb-6">
        <Segmented<LocationFocus>
          options={["Home", "Diaspora", "Both"]}
          value={locationFocus}
          onChange={setLocationFocus}
        />
      </div>

      {error && <p className="m-0 mb-3 text-[13px] font-semibold text-red">{error}</p>}

      <button
        type="button"
        onClick={save}
        disabled={saving || uploading}
        className="h-[54px] w-full cursor-pointer rounded-button border-none bg-ink text-[16px] font-bold text-cream disabled:opacity-70"
      >
        {saving ? "Saving…" : edit ? "Save changes" : "Start meeting people"}
      </button>
    </div>
  );
}
