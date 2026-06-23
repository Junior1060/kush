"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "signup" | "signin";

const INPUT =
  "h-[52px] w-full rounded-input border border-[rgba(27,23,20,0.12)] bg-surface px-[18px] text-[15px] text-ink outline-none placeholder:text-faint focus:border-[rgba(27,23,20,0.3)]";

export function WelcomeAuth() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

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

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      setBusy(false);
      if (error) return setError(error.message);

      // If email confirmation is OFF, a session is returned immediately.
      if (data.session) {
        router.push("/onboarding");
        router.refresh();
      } else {
        setCheckEmail(true);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      setBusy(false);
      if (error) return setError(error.message);
      // Layout routing sends incomplete profiles to onboarding automatically.
      router.push("/discover");
      router.refresh();
    }
  }

  if (checkEmail) {
    return (
      <div className="pt-6 text-center">
        <div className="mb-3 text-[32px]">✉️</div>
        <p className="m-0 text-[15px] leading-[1.5] text-[#6F665C]">
          We sent a verification link to{" "}
          <span className="font-semibold text-ink">{email}</span>. Confirm it, then
          come back and sign in.
        </p>
        <button
          onClick={() => {
            setCheckEmail(false);
            setMode("signin");
            setPassword("");
            setConfirm("");
          }}
          className="mt-4 h-[48px] w-full cursor-pointer rounded-button border border-[rgba(27,23,20,0.2)] bg-transparent text-[15px] font-semibold text-ink"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="pt-5">
      <p className="mx-0 mb-4 mt-0 text-center text-[14.5px] leading-[1.45] text-[#6F665C]">
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
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className={INPUT}
          />
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
        {busy
          ? "Please wait…"
          : mode === "signup"
            ? "Create account"
            : "Sign in"}
      </button>

      <button
        onClick={() => {
          setMode(mode === "signup" ? "signin" : "signup");
          setError(null);
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
