"use client";

import { useEffect, useState } from "react";

interface Props {
  onClose: () => void;
}

export default function BiometricAnimation({ onClose }: Props) {
  const [phase, setPhase] = useState(0);
  // 0 = grid/rings appearing
  // 1 = SCANNING...
  // 2 = VERIFYING BIOMETRIC IDENTITY
  // 3 = IDENTITY CHECK REQUIRED
  // 4 = contact card revealed

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => setPhase(3), 3200);
    const t4 = setTimeout(() => setPhase(4), 4400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <div className="bio-overlay">
      {/* Grid */}
      <div className="bio-grid" />

      {/* Corner brackets */}
      <div className="bio-corners">
        <span /><span /><span /><span />
      </div>

      {/* Scanline */}
      {(phase === 1 || phase === 2) && (
        <div className="bio-scanline" />
      )}

      {/* Center content */}
      <div className="bio-center">

        {/* Ring stack */}
        <div className="bio-rings">
          <div className={`bio-ring-outer ${phase >= 3 ? "bio-ring-denied" : ""}`} />
          <div className={`bio-ring-mid   ${phase >= 3 ? "bio-ring-denied" : ""}`} />
          <div className="bio-ring-inner">
            {/* Fingerprint SVG */}
            <svg viewBox="0 0 64 64" fill="none" className="bio-fp-icon">
              <circle cx="32" cy="32" r="8"  stroke="currentColor" strokeWidth="1.5" />
              <circle cx="32" cy="32" r="14" stroke="currentColor" strokeWidth="1.2" strokeDasharray={phase >= 2 ? "none" : "4 4"} />
              <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="1"   strokeDasharray="6 3" />
              <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="0.8" strokeDasharray="8 4" />
              {phase >= 3 && (
                <>
                  <line x1="20" y1="20" x2="44" y2="44" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" className="bio-cross" />
                  <line x1="44" y1="20" x2="20" y2="44" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" className="bio-cross" />
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Status text */}
        <div className="bio-status-wrap">
          {phase === 0 && (
            <p className="bio-label bio-fade-in">INITIALIZING…</p>
          )}
          {phase === 1 && (
            <p className="bio-label bio-fade-in bio-blink">SCANNING…</p>
          )}
          {phase === 2 && (
            <p className="bio-label bio-fade-in bio-glow">VERIFYING BIOMETRIC IDENTITY</p>
          )}
          {phase === 3 && (
            <p className="bio-label bio-fade-in bio-red">IDENTITY CHECK REQUIRED</p>
          )}
          {phase >= 4 && (
            <p className="bio-label bio-fade-in bio-red">ACCESS RESTRICTED</p>
          )}
        </div>

        {/* Progress bar */}
        <div className="bio-bar-track">
          <div
            className="bio-bar-fill"
            style={{
              width:
                phase === 0 ? "0%"   :
                phase === 1 ? "35%"  :
                phase === 2 ? "72%"  :
                phase === 3 ? "100%" : "100%",
              background:
                phase >= 3
                  ? "linear-gradient(90deg, rgba(239,68,68,0.2), #ef4444, rgba(239,68,68,0.2))"
                  : "linear-gradient(90deg, rgba(212,175,55,0.2), #C9A84C, rgba(212,175,55,0.2))",
            }}
          />
        </div>

        {/* Contact card */}
        {phase >= 4 && (
          <div className="bio-contact bio-fade-in">
            <div className="bio-contact-inner">
              <p className="bio-contact-label">PASSWORD RESET</p>
              <p className="bio-contact-body">Contact your system administrator</p>
              <div className="bio-contact-divider" />
              <p className="bio-contact-name">Ritesh Pragash</p>
              <a
                href="mailto:riteshpragash2011@gmail.com"
                className="bio-contact-email"
              >
                riteshpragash2011@gmail.com
              </a>
            </div>
            <button onClick={onClose} className="bio-close-btn">
              DISMISS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
