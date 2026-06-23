/**
 * App shell. The UI is mobile-first: on a phone it fills the whole screen; on
 * larger screens it sits in a centered mobile-width column (no fake device bezel,
 * notch, or status bar — those only ever made sense as a design mockup).
 */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] w-full justify-center bg-[#E7E2D9]">
      <div className="relative flex h-[100dvh] w-full max-w-[480px] flex-col overflow-hidden bg-cream shadow-[0_0_60px_-20px_rgba(27,23,20,0.25)]">
        <div className="relative flex flex-1 flex-col overflow-hidden pt-[max(env(safe-area-inset-top),12px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
