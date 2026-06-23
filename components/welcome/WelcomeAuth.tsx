"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "signup" | "signin";
type Step = "form" | "verify";

const INPUT =
  "h-[52px] w-full rounded-input border border-[rgba(27,23,20,0.12)] bg-surface px-[18px] text-[15px] text-ink outline-none placeholder:text-faint focus:border-[rgba(27,23,20,0.3)]";

export function WelcomeAuth() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signup");
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  function reset() {
    setStep("form");
    setPassword("");
    setConfirm("");
    setCode("");
    setError(null);
    setInfo(null);
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

    // Sign up → Supabase emails a 6-digit code (see email template note).
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error) return setError(error.message);

    // If email confirmation is OFF, a session comes back immediately.
    if (data.session) {
      router.push("/onboarding");
      router.refresh();
    } else {
      setStep("verify");
      setInfo(null);
    }
  }

  async function verify() {
    setError(null);
    if (code.trim().length < 6) return setError("Enter the 6-digit code.");

    setBusy(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: "signup",
    });
    setBusy(false);
    if (error) return setError(error.message);
    if (data.session) {
      router.push("/onboarding");
      router.refresh();
    } else {
      setError("That code didn't work. Try again or resend.");
    }
  }

  async function resend() {
    setError(null);
    setInfo(null);
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
    });
    setBusy(false);
    if (error) return setError(error.message);
    setInfo("New code sent.");
  }

  // ---- Verify step (enter the code without leaving the page) ----
  if (mode === "signup" && step === "verify") {
    return (
      <div className="pt-5 text-center">
        <div className="mb-2 text-[30px]">✉️</div>
        <p className="m-0 mb-4 text-[14.5px] leading-[1.5] text-[#6F665C]">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-ink">{email}</span>. Enter it below.
        </p>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
          onKeyDown={(e) => e.key === "Enter" && verify()}
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="123456"
          className={`${INPUT} text-center text-[22px] font-bold tracking-[8px]`}
        />
        {error && (
          <p className="m-0 mt-3 text-[13px] font-semibold text-red">{error}</p>
        )}
        {info && <p className="m-0 mt-3 text-[13px] font-semibold text-green">{info}</p>}

        <button
          onClick={verify}
          disabled={busy}
          className="mt-4 h-[56px] w-full cursor-pointer rounded-button border-none bg-ink text-[16px] font-bold tracking-[0.2px] text-cream disabled:opacity-70"
        >
          {busy ? "Verifying…" : "Verify & continue"}
        </button>
        <div className="mt-2 flex items-center justify-center gap-1 text-[13.5px]">
          <span className="text-muted">Didn&rsquo;t get it?</span>
          <button
            onClick={resend}
            disabled={busy}
            className="cursor-pointer border-none bg-transparent font-semibold text-ink underline"
          >
            Resend code
          </button>
        </div>
        <button
          onClick={reset}
          className="mt-3 cursor-pointer border-none bg-transparent text-[13.5px] font-semibold text-muted"
        >
          Use a different email
        </button>
      </div>
    );
  }

  // ---- Form step (email / password / confirm) ----
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
