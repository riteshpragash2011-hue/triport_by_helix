"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginAction } from "@/actions/auth";
import AdminLoginAnimation from "@/components/AdminLoginAnimation";
import BiometricAnimation from "@/components/BiometricAnimation";

// ─── Individual PIN digit box ────────────────────────────────────────────────
interface PinInputProps {
  length: number;
  value: string;
  onChange: (val: string) => void;
  onComplete?: () => void;
  masked?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  focusRef?: React.RefObject<HTMLDivElement>;
  compact?: boolean;
}

function PinInput({
  length,
  value,
  onChange,
  onComplete,
  masked = false,
  disabled = false,
  hasError = false,
  focusRef,
  compact = false,
}: PinInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const chars = value.padEnd(length, "").split("");
    chars[index] = digit;
    const next = chars.join("").slice(0, length);
    onChange(next);
    if (digit && index < length - 1) refs.current[index + 1]?.focus();
    if (digit && index === length - 1 && next.length === length) onComplete?.();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace") {
      if (value[index]) {
        const chars = value.split("");
        chars[index] = "";
        onChange(chars.join(""));
      } else if (index > 0) {
        refs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < length - 1)
      refs.current[index + 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    onChange(pasted);
    const fi = Math.min(pasted.length, length - 1);
    refs.current[fi]?.focus();
    if (pasted.length === length) onComplete?.();
  }

  return (
    <div ref={focusRef} className={compact ? "flex gap-1.5 w-full" : "flex gap-2.5"}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type={masked ? "password" : "text"}
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          className={`
            ${compact ? "flex-1 min-w-0 h-12 text-lg" : "w-12 h-14 text-xl"}
            text-center font-bold rounded-sm border-2 outline-none
            bg-white transition-all duration-150 font-mono
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              hasError
                ? "border-red-400 bg-red-50 text-red-700"
                : value[i]
                ? "border-gold text-neutral-900"
                : "border-neutral-200 text-neutral-900 focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]"
            }
          `}
        />
      ))}
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────
export default function AdminLoginPage() {
  const router = useRouter();
  const [helixId, setHelixId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animName, setAnimName] = useState("");
  const [showBiometric, setShowBiometric] = useState(false);
  const passwordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (helixId.length === 4) {
      const first = passwordRef.current?.querySelector("input");
      first?.focus();
    }
  }, [helixId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (helixId.length !== 4) {
      triggerError("Please enter your 4-digit Helix ID.");
      return;
    }
    if (password.length !== 8) {
      triggerError("Please enter your 8-digit password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await loginAction(helixId, password);
      if ("error" in result) {
        triggerError(result.error);
        setPassword("");
      } else {
        // Mark this tab as active — cleared automatically when the tab is closed
        sessionStorage.setItem("triport_admin_tab", "1");
        setAnimName(result.name ?? "Admin");
        setShowAnimation(true);
      }
    } catch {
      triggerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function triggerError(msg: string) {
    setError(msg);
    setShake(true);
    setLoading(false);
    setTimeout(() => setShake(false), 500);
  }

  if (showBiometric) {
    return <BiometricAnimation onClose={() => setShowBiometric(false)} />;
  }

  if (showAnimation) {
    return (
      <AdminLoginAnimation
        userName={animName}
        onComplete={() => {
          router.push("/admin");
          router.refresh();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
      <div className={`w-full max-w-sm ${shake ? "animate-shake" : ""}`}>

        {/* Card */}
        <div className="bg-white border border-neutral-100 rounded-sm shadow-sm px-8 py-10">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/logo.png"
              alt="TRIport by Helix"
              width={120}
              height={34}
              className="h-8 w-auto mb-5"
              priority
            />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-1">
              Admin Portal
            </p>
            <h1 className="text-2xl font-bold text-neutral-900">Sign In</h1>
            <p className="text-sm text-neutral-400 mt-1">
              Enter your Helix credentials
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7" noValidate>

            {/* Helix ID */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">
                Helix ID
              </label>
              <p className="text-xs text-neutral-400 mb-3">
                Your 4-digit member ID number
              </p>
              <PinInput
                length={4}
                value={helixId}
                onChange={setHelixId}
                disabled={loading}
                hasError={!!error}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">
                Helix Password
              </label>
              <p className="text-xs text-neutral-400 mb-3">
                Your 8-digit password
              </p>
              <PinInput
                length={8}
                value={password}
                onChange={setPassword}
                masked
                disabled={loading}
                hasError={!!error}
                focusRef={passwordRef}
                compact
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-sm">
                <svg
                  className="w-4 h-4 text-red-500 shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Forgot password */}
            <div className="text-center -mt-3">
              <button
                type="button"
                onClick={() => setShowBiometric(true)}
                className="text-xs text-neutral-400 hover:text-gold transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={
                loading || helixId.length !== 4 || password.length !== 8
              }
              className="w-full btn-gold py-3 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing In…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-neutral-400 mt-5">
          TRIport Admin · Helix Project 0002
        </p>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-6px); }
          30% { transform: translateX(6px); }
          45% { transform: translateX(-5px); }
          60% { transform: translateX(5px); }
          75% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}
