/**
 * App shell. Mobile-first: on a phone the app fills the whole screen edge-to-edge.
 * On desktop (sm+) the whole viewport is filled with the warm Kush brand background
 * (hero gradient + flag-stripe motif) and the app sits in a centered, polished card —
 * so the screen feels full and intentional while the mobile UI stays usable.
 */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[100dvh] w-full justify-center bg-cream sm:items-center sm:bg-[linear-gradient(150deg,#C97A3A,#7E2B22_72%)] sm:p-6">
      {/* Flag-stripe texture + soft vignette, desktop only */}
      <div className="pointer-events-none absolute inset-0 hidden sm:block bg-[repeating-linear-gradient(125deg,rgba(255,255,255,0.05)_0_2px,transparent_2px_14px)]" />
      <div className="pointer-events-none absolute inset-0 hidden sm:block bg-[radial-gradient(120%_120%_at_50%_0%,transparent_55%,rgba(40,12,8,0.45))]" />

      <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-cream sm:h-[min(880px,calc(100dvh-48px))] sm:w-[420px] sm:rounded-[34px] sm:shadow-[0_45px_90px_-30px_rgba(40,12,8,0.65)] sm:ring-1 sm:ring-black/5">
        <div className="relative flex flex-1 flex-col overflow-hidden pt-[max(env(safe-area-inset-top),12px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
