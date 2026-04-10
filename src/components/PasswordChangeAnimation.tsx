"use client";

import { useState, useRef, useEffect } from "react";
import { verifyCurrentPasswordAction, changePasswordAction } from "@/actions/auth";
import { setMemberPasswordAction } from "@/actions/members";
import BiometricAnimation from "@/components/BiometricAnimation";

// ─── PIN input ────────────────────────────────────────────────────────────────
function PinInput({
  length, value, onChange, masked = true, disabled = false, hasError = false,
}: {
  length: number; value: string; onChange: (v: string) => void;
  masked?: boolean; disabled?: boolean; hasError?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(i: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const chars = value.padEnd(length, "").split("");
    chars[i] = digit;
    const next = chars.join("").slice(0, length);
    onChange(next);
    if (digit && i < length - 1) refs.current[i + 1]?.focus();
  }
  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace") {
      if (value[i]) { const c = value.split(""); c[i] = ""; onChange(c.join("")); }
      else if (i > 0) refs.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus();
  }
  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(p);
    refs.current[Math.min(p.length, length - 1)]?.focus();
  }

  return (
    <div className="flex gap-1.5 w-full">
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
            flex-1 min-w-0 h-12 text-center text-lg font-bold rounded-sm border-2 outline-none
            bg-transparent transition-all duration-150 font-mono
            disabled:opacity-40 disabled:cursor-not-allowed
            ${hasError
              ? "border-red-500/60 bg-red-950/30 text-red-400"
              : value[i]
              ? "border-gold text-white"
              : "border-white/20 text-white focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]"}
          `}
        />
      ))}
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = "intro" | "old" | "new" | "confirm" | "loading" | "success";

export interface PasswordChangeAnimationProps {
  /** "self" = changing your own password (requires old PW verification)
   *  "admin" = admin changing a member's password (skips verification) */
  mode: "self" | "admin";
  targetId?: string;    // admin mode only
  targetName?: string;  // admin mode only — shown as subtitle
  onClose: () => void;
  onSuccess?: () => void;
}

// ─── Steps config ─────────────────────────────────────────────────────────────
const STEP_LABELS: Record<string, string> = {
  old:     "VERIFY IDENTITY",
  new:     "NEW PASSWORD",
  confirm: "CONFIRM PASSWORD",
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function PasswordChangeAnimation({
  mode, targetId, targetName, onClose, onSuccess,
}: PasswordChangeAnimationProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [oldPw,     setOldPw]     = useState("");
  const [newPw,     setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  // Auto-advance from intro screen
  useEffect(() => {
    const t = setTimeout(() => setPhase(mode === "self" ? "old" : "new"), 1300);
    return () => clearTimeout(t);
  }, [mode]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  async function submitOld() {
    if (oldPw.length !== 8) return;
    setLoading(true); setError("");
    try {
      const res = await verifyCurrentPasswordAction(oldPw);
      if ("error" in res) { setError(res.error); setOldPw(""); }
      else { setPhase("new"); setOldPw(""); }
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  function submitNew() {
    if (newPw.length !== 8) return;
    setError(""); setPhase("confirm");
  }

  async function submitConfirm() {
    if (confirmPw.length !== 8) return;
    if (confirmPw !== newPw) { setError("Passwords don't match. Try again."); setConfirmPw(""); return; }
    setLoading(true); setError(""); setPhase("loading");
    try {
      const res = mode === "self"
        ? await changePasswordAction(newPw)
        : await setMemberPasswordAction(targetId!, newPw);
      if ("error" in res) { setError(res.error); setPhase("confirm"); }
      else {
        setPhase("success");
        setTimeout(() => { onSuccess?.(); onClose(); }, 2400);
      }
    } catch { setError("Something went wrong."); setPhase("confirm"); }
    finally { setLoading(false); }
  }

  // ── Steps for progress bar ─────────────────────────────────────────────────
  const steps = mode === "self" ? ["old", "new", "confirm"] : ["new", "confirm"];
  const currentStepIdx = steps.indexOf(phase as string);

  // ── Show BiometricAnimation for forgot password ────────────────────────────
  if (showForgot) {
    return <BiometricAnimation onClose={() => setShowForgot(false)} />;
  }

  const isActive = phase === "old" || phase === "new" || phase === "confirm";
  const currentVal = phase === "old" ? oldPw : phase === "new" ? newPw : confirmPw;
  const currentSet = phase === "old" ? setOldPw : phase === "new" ? setNewPw : setConfirmPw;
  const canContinue = currentVal.length === 8 && !loading;

  function handleContinue() {
    if (phase === "old")     submitOld();
    if (phase === "new")     submitNew();
    if (phase === "confirm") submitConfirm();
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">

      {/* Gold grid */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Corner brackets */}
      <div className="absolute top-6 left-6  w-7 h-7 border-t border-l border-gold/50" />
      <div className="absolute top-6 right-6 w-7 h-7 border-t border-r border-gold/50" />
      <div className="absolute bottom-6 left-6  w-7 h-7 border-b border-l border-gold/50" />
      <div className="absolute bottom-6 right-6 w-7 h-7 border-b border-r border-gold/50" />

      {/* Scanline */}
      <div
        className="absolute left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
          animation: "bioScan 2.8s ease-in-out infinite",
        }}
      />

      {/* ── Central panel ── */}
      <div className="relative z-10 w-full max-w-sm mx-4 space-y-7">

        {/* ── INTRO ── */}
        {phase === "intro" && (
          <div className="text-center space-y-5">
            {/* Spinning ring */}
            <div
              className="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
              style={{ border: "1px solid rgba(212,175,55,0.35)", boxShadow: "0 0 40px rgba(212,175,55,0.15)" }}
            >
              <svg className="w-8 h-8 animate-spin" style={{ color: "#C9A84C" }} viewBox="0 0 24 24" fill="none">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.35em] uppercase" style={{ color: "#C9A84C" }}>
                {mode === "admin" ? `Changing Password · ${targetName}` : "Change Password"}
              </p>
              <p className="text-[9px] text-white/25 tracking-widest uppercase mt-2">
                Initializing secure session…
              </p>
            </div>
          </div>
        )}

        {/* ── LOADING ── */}
        {phase === "loading" && (
          <div className="text-center space-y-5">
            <div
              className="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
              style={{ border: "1px solid rgba(212,175,55,0.35)", boxShadow: "0 0 40px rgba(212,175,55,0.15)" }}
            >
              <svg className="w-8 h-8 animate-spin" style={{ color: "#C9A84C" }} viewBox="0 0 24 24" fill="none">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
            <p className="text-[10px] font-semibold tracking-[0.35em] uppercase" style={{ color: "#C9A84C" }}>
              Updating Password…
            </p>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {phase === "success" && (
          <div className="text-center space-y-5">
            <div
              className="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
              style={{ border: "1px solid rgba(34,197,94,0.4)", background: "rgba(20,83,45,0.3)", boxShadow: "0 0 40px rgba(34,197,94,0.15)" }}
            >
              <svg className="w-9 h-9 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-green-400">
                Password Updated
              </p>
              <p className="text-[9px] text-white/30 tracking-widest uppercase mt-2">
                {mode === "admin" ? `${targetName}'s password has been changed` : "Your password is now active"}
              </p>
            </div>
          </div>
        )}

        {/* ── ACTIVE STEPS ── */}
        {isActive && (
          <div className="space-y-6">

            {/* Step progress bar */}
            <div className="flex items-center gap-1.5 justify-center">
              {steps.map((s, i) => (
                <div
                  key={s}
                  className="h-0.5 rounded-full transition-all duration-500"
                  style={{
                    width: i <= currentStepIdx ? "48px" : "24px",
                    background: i <= currentStepIdx ? "#C9A84C" : "rgba(255,255,255,0.15)",
                  }}
                />
              ))}
            </div>

            {/* Title */}
            <div className="text-center">
              {mode === "admin" && (
                <p className="text-[9px] font-semibold tracking-[0.3em] uppercase text-white/30 mb-2">
                  {targetName}
                </p>
              )}
              <h2 className="text-sm font-bold tracking-[0.25em] uppercase" style={{ color: "#C9A84C" }}>
                {STEP_LABELS[phase]}
              </h2>
              <p className="text-[11px] text-white/35 mt-1.5">
                {phase === "old"     ? "Enter your current 8-digit password"
                : phase === "new"    ? "Enter a new 8-digit password"
                :                     "Re-enter your new password to confirm"}
              </p>
            </div>

            {/* PIN boxes */}
            <PinInput
              length={8}
              value={currentVal}
              onChange={currentSet}
              masked
              disabled={loading}
              hasError={!!error}
            />

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-sm"
                style={{ background: "rgba(127,29,29,0.4)", border: "1px solid rgba(239,68,68,0.3)" }}>
                <svg className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            {/* Continue / Submit button */}
            <button
              onClick={handleContinue}
              disabled={!canContinue}
              className="w-full btn-gold py-3 text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Verifying…
                </>
              ) : phase === "confirm" ? "Update Password" : "Continue →"}
            </button>

            {/* Forgot password — only on the verify step */}
            {phase === "old" && (
              <button
                onClick={() => setShowForgot(true)}
                className="w-full text-center text-[11px] transition-colors"
                style={{ color: "rgba(255,255,255,0.25)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C9A84C")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
              >
                Forgot password?
              </button>
            )}

            {/* Cancel */}
            <button
              onClick={onClose}
              className="w-full text-center text-[11px] transition-colors"
              style={{ color: "rgba(255,255,255,0.18)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.18)")}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
