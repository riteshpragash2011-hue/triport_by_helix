"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { requestPasswordResetAction } from "@/actions/reset-password";

function PinInput({
  length,
  value,
  onChange,
  onComplete,
  disabled,
  hasError,
}: {
  length: number;
  value: string;
  onChange: (val: string) => void;
  onComplete?: () => void;
  disabled?: boolean;
  hasError?: boolean;
}) {
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
    if (e.key === "ArrowRight" && index < length - 1) refs.current[index + 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted);
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
    if (pasted.length === length) onComplete?.();
  }

  return (
    <div className="flex gap-2.5">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          className={`
            w-12 h-14 text-xl text-center font-bold rounded-sm border-2 outline-none
            bg-white transition-all duration-150 font-mono
            disabled:opacity-50 disabled:cursor-not-allowed
            ${hasError
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

export default function ForgotPasswordPage() {
  const [helixId, setHelixId] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (helixId.length !== 4) {
      setError("Please enter your 4-digit Helix ID.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await requestPasswordResetAction(helixId);
      if ("error" in result) {
        setError(result.error);
      } else {
        setSent(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-sm">
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
            <h1 className="text-2xl font-bold text-neutral-900">Reset Password</h1>
            <p className="text-sm text-neutral-400 mt-1 text-center">
              Enter your Helix ID and we&apos;ll email you a reset link
            </p>
          </div>

          {sent ? (
            /* Success state */
            <div className="text-center space-y-5">
              <div className="w-14 h-14 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800 mb-1">Reset link sent</p>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  If that Helix ID exists, a password reset link has been sent to the registered email address. Check your inbox and click the link to continue.
                </p>
              </div>
              <p className="text-xs text-neutral-400">Link expires in <span className="text-neutral-600 font-medium">1 hour</span>.</p>
              <Link
                href="/admin/login"
                className="block w-full text-center btn-gold py-3 text-sm font-semibold"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            /* Form state */
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                  onComplete={() => {}}
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-sm">
                  <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || helixId.length !== 4}
                className="w-full btn-gold py-3 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <div className="text-center">
                <Link href="/admin/login" className="text-xs text-neutral-400 hover:text-gold transition-colors">
                  ← Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-neutral-400 mt-5">
          TRIport Admin · Helix Project 0002
        </p>
      </div>
    </div>
  );
}
