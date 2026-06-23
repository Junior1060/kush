import { PhoneFrame } from "@/components/PhoneFrame";
import { Wordmark } from "@/components/Wordmark";
import { WelcomeAuth } from "@/components/welcome/WelcomeAuth";

// Welcome / Onboarding — brand intro + magic-link auth entry.
export default function WelcomePage() {
  return (
    <PhoneFrame>
      <div className="kush-scroll flex h-full w-full flex-col overflow-y-auto px-[26px] pb-[30px] pt-2">
        <div className="flex items-center justify-center pb-[18px] pt-[6px]">
          <Wordmark />
        </div>

        {/* Hero */}
        <div className="relative min-h-[230px] flex-1 overflow-hidden rounded-sheet bg-[linear-gradient(150deg,#C97A3A,#7E2B22_70%)] shadow-[0_24px_50px_-18px_rgba(126,43,34,0.55)]">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(125deg,rgba(255,255,255,0.06)_0_2px,transparent_2px_13px)]" />
          <div className="absolute left-4 top-4 rounded-[20px] bg-[rgba(0,0,0,0.18)] px-[9px] py-1 font-mono text-[10px] tracking-[0.5px] text-[rgba(255,255,255,0.7)]">
            photo · couple
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[60%] bg-[linear-gradient(to_top,rgba(40,12,8,0.82),transparent)]" />
          <div className="absolute inset-x-[26px] bottom-[30px]">
            <div className="mb-[14px] inline-flex gap-1">
              <div className="h-[5px] w-[26px] rounded-[3px] bg-ink" />
              <div className="h-[5px] w-[26px] rounded-[3px] bg-red" />
              <div className="h-[5px] w-[26px] rounded-[3px] bg-green" />
            </div>
            <div className="text-balance font-display text-[34px] font-bold leading-[1.04] tracking-[-0.8px] text-[#FBF5EC]">
              Love that knows where it&rsquo;s from.
            </div>
          </div>
        </div>

        <WelcomeAuth />
      </div>
    </PhoneFrame>
  );
}
