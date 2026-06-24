"use client";

import { useState } from "react";
import { SubPageHeader } from "@/components/SubPageHeader";
import { StarIcon } from "@/components/icons";

export default function VerifyPage() {
  const [requested, setRequested] = useState(false);

  return (
    <div className="flex h-full w-full flex-col">
      <SubPageHeader title="Verify your account" />
      <div className="kush-scroll mx-auto w-full max-w-[600px] flex-1 overflow-y-auto px-[22px] pb-[24px]">
        <div className="mb-5 flex flex-col items-center rounded-card border-[1.5px] border-ink bg-white px-5 py-8 text-center">
          <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full border-[1.5px] border-ink bg-white">
            <StarIcon size={30} fill="#0A0A0A" />
          </div>
          <h2 className="mb-1 mt-4 font-display text-[20px] font-bold text-ink">
            Get the gold check
          </h2>
          <p className="m-0 text-[14px] leading-[1.5] text-muted">
            Verified profiles get the gold star, more visibility, and help keep
            Kush safe. We&rsquo;ll ask you to take a quick selfie that matches your
            photos.
          </p>
        </div>

        <ul className="mb-6 space-y-3">
          {[
            "Take a selfie in the pose we show you",
            "Our team checks it against your profile photos",
            "You get the gold star — usually within a day",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-[24px] w-[24px] flex-none items-center justify-center rounded-full bg-ink text-[12px] font-bold text-cream">
                {i + 1}
              </span>
              <span className="text-[14px] leading-[1.5] text-ink">{step}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setRequested(true)}
          disabled={requested}
          className="h-[52px] w-full rounded-button border-none bg-ink text-[16px] font-bold text-cream disabled:opacity-70"
        >
          {requested ? "Verification requested ✓" : "Start verification"}
        </button>
        {requested && (
          <p className="mt-3 text-center text-[13px] text-green">
            Thanks! We&rsquo;ll review and let you know.
          </p>
        )}
      </div>
    </div>
  );
}
