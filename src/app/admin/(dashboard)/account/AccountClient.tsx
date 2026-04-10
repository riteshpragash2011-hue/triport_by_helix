"use client";

import { useState } from "react";
import PasswordChangeAnimation from "@/components/PasswordChangeAnimation";

interface Props {
  name: string;
  rank: string;
  rankLabel: string;
  helixId: string;
}

export default function AccountClient({ name, rank, rankLabel, helixId }: Props) {
  const [showChangePw, setShowChangePw] = useState(false);
  const [pwChanged, setPwChanged] = useState(false);

  return (
    <>
      {/* ── Fullscreen password-change animation ── */}
      {showChangePw && (
        <PasswordChangeAnimation
          mode="self"
          onClose={() => setShowChangePw(false)}
          onSuccess={() => { setPwChanged(true); setShowChangePw(false); }}
        />
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        {/* ── Profile Card ── */}
        <section>
          <h1 className="text-2xl font-bold text-neutral-900 mb-6">My Account</h1>
          <div className="border border-neutral-100 rounded-sm overflow-hidden">

            {/* Avatar row */}
            <div className="bg-neutral-50 border-b border-neutral-100 px-6 py-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-sm bg-neutral-900 flex items-center justify-center shrink-0">
                <span className="text-xl font-bold text-white">{name.charAt(0)}</span>
              </div>
              <div>
                <p className="font-bold text-neutral-900 text-lg leading-tight">{name}</p>
                <p className="text-sm text-gold font-medium mt-0.5">{rankLabel}</p>
              </div>
            </div>

            {/* Details */}
            <div className="divide-y divide-neutral-50">
              {[
                { label: "Full Name", value: name },
                { label: "Rank",     value: rankLabel },
                {
                  label: "Helix ID",
                  value: (
                    <span className="font-mono text-sm font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-sm">
                      {helixId}
                    </span>
                  ),
                },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between px-6 py-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    {row.label}
                  </span>
                  <span className="text-sm text-neutral-700">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Change Password ── */}
        <section>
          <h2 className="text-lg font-bold text-neutral-900 mb-1">Change Password</h2>
          <p className="text-sm text-neutral-500 mb-6">Update your 8-digit Helix password.</p>

          <div className="border border-neutral-100 rounded-sm px-6 py-7">
            {pwChanged ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-50 border border-green-200 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">Password updated</p>
                    <p className="text-xs text-neutral-500 mt-0.5">Your new password is now active.</p>
                  </div>
                </div>
                <button
                  onClick={() => { setPwChanged(false); setShowChangePw(true); }}
                  className="text-xs text-neutral-400 hover:text-gold transition-colors"
                >
                  Change again
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-neutral-800">8-digit Helix Password</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    You&apos;ll need to verify your current password first.
                  </p>
                </div>
                <button
                  onClick={() => setShowChangePw(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-neutral-200 rounded-sm text-neutral-600 hover:border-gold hover:text-gold transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                  </svg>
                  Change Password
                </button>
              </div>
            )}
          </div>
        </section>

      </div>
    </>
  );
}
