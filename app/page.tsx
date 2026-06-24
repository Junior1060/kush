/* eslint-disable @next/next/no-img-element */
import { PhoneFrame } from "@/components/PhoneFrame";
import { Wordmark } from "@/components/Wordmark";
import { WelcomeAuth } from "@/components/welcome/WelcomeAuth";

// Welcome / Onboarding — brand intro + magic-link auth entry.
export default function WelcomePage() {
  return (
    <PhoneFrame>
      <div className="kush-scroll mx-auto flex h-full w-full max-w-[460px] flex-col overflow-y-auto px-[26px] pb-[30px] pt-2">
        <div className="flex items-center justify-center pb-[18px] pt-[6px]">
          <Wordmark />
        </div>

        {/* Hero */}
        <div className="relative min-h-[230px] flex-1 overflow-hidden rounded-sheet border-[1.5px] border-ink bg-ink">
          <img
            src="/hero-couple.jpg"
            alt="A South Sudanese couple in traditional dress"
            className="absolute inset-0 h-full w-full object-cover object-[center_25%]"
          />
          <div className="absolute inset-x-0 bottom-0 h-[60%] bg-[linear-gradient(to_top,rgba(0,0,0,0.9),transparent)]" />
          <div className="absolute inset-x-[26px] bottom-[30px]">
            <div className="mb-[14px] inline-flex gap-1">
              <div className="h-[5px] w-[26px] rounded-[3px] bg-white" />
              <div className="h-[5px] w-[26px] rounded-[3px] bg-white/60" />
              <div className="h-[5px] w-[26px] rounded-[3px] bg-white/35" />
            </div>
            <div className="text-balance font-display text-[34px] font-bold leading-[1.04] tracking-[-0.8px] text-white">
              Love that knows where it&rsquo;s from.
            </div>
          </div>
        </div>

        <WelcomeAuth />
      </div>
    </PhoneFrame>
  );
}
