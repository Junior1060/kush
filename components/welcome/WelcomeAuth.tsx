"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "signup" | "signin";

const INPUT =
  "h-[52px] w-full rounded-input border-[1.5px] border-ink bg-white px-[18px] text-[15px] text-ink outline-none placeholder:text-faint";

export function WelcomeAuth() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setPassword("");
    setConfirm("");
    setError(null);
  }

  async function submit() {
    setError(null);
    if (!email.trim()) return setError("Enter your email.");
    if (!password) return setError("Enter a password.");

    if (mode === "signup") {
      if (password.length < 8)
        return setError("Password must be at least 8 characters.");
      if (password !== confirm) return setError("Passwords don't match.");
    }

    setBusy(true);
    const supabase = createClient();

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      setBusy(false);
      if (error) return setError(error.message);
      router.push("/discover");
      router.refresh();
      return;
    }

    // Sign up. Email confirmation is OFF (Supabase → Authentication → Providers →
    // Email → "Confirm email" disabled), so signUp returns a session immediately
    // and we go straight into onboarding — no 6-digit code step.
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      setBusy(false);
      return setError(error.message);
    }

    // If a session came back, we're in.
    if (data.session) {
      router.push("/onboarding");
      router.refresh();
      return;
    }

    // No session means either the email already exists or email confirmation is
    // still enabled on the project. Try signing in with the same credentials.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);

    if (signInError) {
      // Most common: confirmation is still toggled on in the dashboard.
      if (/confirm/i.test(signInError.message)) {
        return setError(
          "Email confirmation is still enabled on the server. Turn it off in Supabase → Authentication → Providers → Email."
        );
      }
      return setError(signInError.message);
    }

    router.push("/onboarding");
    router.refresh();
  }

  return (
    <div className="pt-5">
      <p className="mx-0 mb-4 mt-0 text-center text-[14.5px] leading-[1.45] text-muted">
        {mode === "signup"
          ? "Create your account to meet South Sudanese singles."
          : "Welcome back."}
      </p>

      <div className="flex flex-col gap-[10px]">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={INPUT}
        />
        <input
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && mode === "signin" && submit()}
          className={INPUT}
        />
        {mode === "signup" && (
          <>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className={INPUT}
            />
            <p className="m-0 px-1 text-[12.5px] text-faint">
              Use at least 8 characters.
            </p>
          </>
        )}
      </div>

      {error && (
        <p className="m-0 mt-3 text-center text-[13px] font-semibold text-red">
          {error}
        </p>
      )}

      <button
        onClick={submit}
        disabled={busy}
        className="mt-4 h-[56px] w-full cursor-pointer rounded-button border-none bg-ink text-[16px] font-bold tracking-[0.2px] text-cream disabled:opacity-70"
      >
        {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
      </button>

      <button
        onClick={() => {
          setMode(mode === "signup" ? "signin" : "signup");
          reset();
        }}
        className="mt-2 h-[44px] w-full cursor-pointer border-none bg-transparent text-[14.5px] font-semibold text-ink"
      >
        {mode === "signup"
          ? "I already have an account"
          : "New here? Create an account"}
      </button>
    </div>
  );
}
