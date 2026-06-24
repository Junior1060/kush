/**
 * App shell container. Full-bleed on every screen size — fills the phone on mobile
 * and the whole window on desktop. Desktop chrome (sidebar nav) is added by AppShell;
 * the welcome/onboarding screens center their own content.
 */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-cream">{children}</div>
  );
}
