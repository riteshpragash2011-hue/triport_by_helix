"use client";

import { useState, useRef } from "react";
import {
  getMembersAction,
  addMemberAction,
  deleteMemberAction,
  updateMemberNameAction,
  togglePermissionAction,
  MemberView,
} from "@/actions/members";
import type { Rank } from "@/lib/accounts";
import PasswordChangeAnimation from "@/components/PasswordChangeAnimation";

// ─── Types ────────────────────────────────────────────────────────────────────

type PermKey =
  | "canLogin" | "canViewRequests" | "canAddProducts" | "canDeleteProducts"
  | "canAddMembers" | "canDeleteMembers" | "canManageMembers" | "canManageProducts";

const PERM_LABELS: Record<PermKey, string> = {
  canLogin:          "Admin Login",
  canViewRequests:   "View Requests & Buys",
  canAddProducts:    "Add Products",
  canDeleteProducts: "Delete Products",
  canAddMembers:     "Add Members",
  canDeleteMembers:  "Delete Members",
  canManageMembers:  "Manage & Edit Members",
  canManageProducts: "Manage & Edit Products",
};

const RANK_OPTIONS: { value: Rank; label: string }[] = [
  { value: "ser_member",  label: "Founding SER Member" },
  { value: "base_member", label: "Base Helix Member" },
];

// ─── Small PinInput ───────────────────────────────────────────────────────────

function PinInput({
  length, value, onChange, masked = false, disabled = false, hasError = false,
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
  }
  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(p);
    refs.current[Math.min(p.length, length - 1)]?.focus();
  }
  return (
    <div className={`flex gap-1.5 ${length === 8 ? "w-full" : ""}`}>
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
            ${length === 8 ? "flex-1 min-w-0 h-10 text-sm" : "w-9 h-10 text-sm"}
            text-center font-bold rounded-sm border-2 outline-none bg-white transition-all font-mono
            disabled:opacity-50 disabled:cursor-not-allowed
            ${hasError
              ? "border-red-400 bg-red-50 text-red-700"
              : value[i]
              ? "border-gold text-neutral-900"
              : "border-neutral-200 text-neutral-900 focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]"}
          `}
        />
      ))}
    </div>
  );
}

// ─── Rank badge ───────────────────────────────────────────────────────────────

function RankBadge({ rank, label }: { rank: string; label: string }) {
  const cls =
    rank === "team_lead"
      ? "bg-amber-50 text-gold border-gold/30"
      : rank === "ser_member"
      ? "bg-indigo-50 text-indigo-600 border-indigo-200"
      : "bg-neutral-100 text-neutral-500 border-neutral-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm border ${cls}`}>
      {label}
    </span>
  );
}

// ─── Toggle switch ────────────────────────────────────────────────────────────

function Toggle({
  checked, onChange, disabled = false,
}: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        ${checked ? "bg-gold" : "bg-neutral-200"}`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200
          ${checked ? "translate-x-4" : "translate-x-0"}`}
      />
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  initialMembers: MemberView[];
  viewerRank: Rank;
  viewerId: string;
}

export default function MembersClient({ initialMembers, viewerRank, viewerId }: Props) {
  const [members, setMembers] = useState<MemberView[]>(initialMembers);
  const [showAdd, setShowAdd] = useState(false);
  const [expandedPerms, setExpandedPerms] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [newMember, setNewMember] = useState({ id: "", name: "", password: "", rank: "base_member" as Rank });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  // Password change animation state
  const [changePwTarget, setChangePwTarget] = useState<{ id: string; name: string } | null>(null);

  const canAddMembers = viewerRank === "team_lead" || (viewerRank === "ser_member");

  async function refresh() {
    const res = await getMembersAction();
    if (!("error" in res)) setMembers(res.members);
  }

  function flash(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  function setError(key: string, msg: string) {
    setErrors((e) => ({ ...e, [key]: msg }));
  }

  function clearError(key: string) {
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  // ── Add member ──────────────────────────────────────────────────────────────
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading("add");
    clearError("add");
    const res = await addMemberAction(newMember);
    setLoading(null);
    if ("error" in res) { setError("add", res.error); return; }
    setNewMember({ id: "", name: "", password: "", rank: "base_member" });
    setShowAdd(false);
    flash("Member added successfully.");
    await refresh();
  }

  // ── Delete member ───────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    setLoading(`delete-${id}`);
    const res = await deleteMemberAction(id);
    setLoading(null);
    setConfirmDelete(null);
    if ("error" in res) { setError(`delete-${id}`, res.error); return; }
    flash("Member removed.");
    await refresh();
  }

  // ── Edit name ───────────────────────────────────────────────────────────────
  async function handleNameSave(id: string) {
    if (!nameInput.trim()) return;
    setLoading(`name-${id}`);
    const res = await updateMemberNameAction(id, nameInput);
    setLoading(null);
    if ("error" in res) { setError(`name-${id}`, res.error); return; }
    setEditingName(null);
    flash("Name updated.");
    await refresh();
  }

  // ── Toggle permission ────────────────────────────────────────────────────────
  async function handleToggle(memberId: string, perm: PermKey, value: boolean) {
    setLoading(`perm-${memberId}-${perm}`);
    const res = await togglePermissionAction(memberId, perm, value);
    setLoading(null);
    if ("error" in res) { setError(`perm-${memberId}`, res.error); return; }
    await refresh();
  }

  // ── Rank display ─────────────────────────────────────────────────────────────
  const sortedMembers = [...members].sort((a, b) => {
    const order: Record<string, number> = { team_lead: 0, ser_member: 1, base_member: 2 };
    return (order[a.rank] ?? 9) - (order[b.rank] ?? 9);
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Fullscreen password-change animation — fixed overlay, safe inside any div */}
      {changePwTarget && (
        <PasswordChangeAnimation
          mode="admin"
          targetId={changePwTarget.id}
          targetName={changePwTarget.name}
          onClose={() => setChangePwTarget(null)}
          onSuccess={async () => { flash("Password updated."); await refresh(); }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Members</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {sortedMembers.length} member{sortedMembers.length !== 1 ? "s" : ""} ·{" "}
            {viewerRank === "team_lead" ? "Full access — IDs, passwords & permissions visible" :
             viewerRank === "ser_member" ? "IDs & base member passwords visible" :
             "All member IDs visible"}
          </p>
        </div>
        {canAddMembers && (
          <button
            onClick={() => { setShowAdd(!showAdd); clearError("add"); }}
            className="inline-flex items-center gap-2 btn-gold px-4 py-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Member
          </button>
        )}
      </div>

      {/* Success banner */}
      {successMsg && (
        <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-sm text-sm text-green-700">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          {successMsg}
        </div>
      )}

      {/* ── Add Member Panel ── */}
      {showAdd && (
        <div className="mb-8 border border-gold/30 rounded-sm bg-amber-50/30 p-6">
          <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-5">New Member</h2>
          <form onSubmit={handleAdd} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Alex Johnson"
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-sm outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)] bg-white"
                />
              </div>
              {/* Rank */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">Rank</label>
                <select
                  value={newMember.rank}
                  onChange={(e) => setNewMember((p) => ({ ...p, rank: e.target.value as Rank }))}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-sm outline-none focus:border-gold bg-white"
                  disabled={viewerRank === "ser_member"}
                >
                  {viewerRank === "team_lead" ? (
                    RANK_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)
                  ) : (
                    <option value="base_member">Base Helix Member</option>
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* ID */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">Helix ID</label>
                <p className="text-xs text-neutral-400 mb-3">4-digit member ID</p>
                <PinInput length={4} value={newMember.id} onChange={(v) => setNewMember((p) => ({ ...p, id: v }))} />
              </div>
              {/* Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">Password</label>
                <p className="text-xs text-neutral-400 mb-3">8-digit password</p>
                <PinInput length={8} value={newMember.password} onChange={(v) => setNewMember((p) => ({ ...p, password: v }))} masked />
              </div>
            </div>

            {errors.add && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-sm">{errors.add}</p>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading === "add" || !newMember.name.trim() || newMember.id.length !== 4 || newMember.password.length !== 8}
                className="btn-gold px-5 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading === "add" ? (
                  <><svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Adding…</>
                ) : "Add Member"}
              </button>
              <button type="button" onClick={() => { setShowAdd(false); clearError("add"); }} className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Member Cards ── */}
      <div className="space-y-4">
        {sortedMembers.length === 0 && (
          <div className="text-center py-16 border border-neutral-100 rounded-sm bg-neutral-50">
            <p className="text-neutral-400 text-sm">No members yet.</p>
          </div>
        )}
        {sortedMembers.map((member) => {
          const isExpanded = expandedPerms === member.id;
          const isEditingName = editingName === member.id;
          const isConfirmDelete = confirmDelete === member.id;

          return (
            <div key={member.id} className="border border-neutral-100 rounded-sm bg-white overflow-hidden">

              {/* Card header */}
              <div className="px-6 py-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-sm flex items-center justify-center shrink-0 text-white font-bold text-lg
                    ${member.rank === "team_lead" ? "bg-gold" : member.rank === "ser_member" ? "bg-indigo-500" : "bg-neutral-700"}`}>
                    {member.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="space-y-1.5">
                    {/* Name + rank */}
                    {isEditingName ? (
                      <div className="flex items-center gap-2">
                        <input
                          autoFocus
                          type="text"
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          className="px-2 py-1 text-sm border border-neutral-200 rounded-sm outline-none focus:border-gold w-48"
                          onKeyDown={(e) => { if (e.key === "Enter") handleNameSave(member.id); if (e.key === "Escape") setEditingName(null); }}
                        />
                        <button onClick={() => handleNameSave(member.id)} disabled={loading === `name-${member.id}`} className="text-xs btn-gold px-2.5 py-1">Save</button>
                        <button onClick={() => setEditingName(null)} className="text-xs text-neutral-400 hover:text-neutral-600">✕</button>
                        {errors[`name-${member.id}`] && <span className="text-xs text-red-500">{errors[`name-${member.id}`]}</span>}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-neutral-900">{member.name}</span>
                        {member.isYou && <span className="text-[10px] text-neutral-400 font-medium">(you)</span>}
                        <RankBadge rank={member.rank} label={member.rankLabel} />
                      </div>
                    )}

                    {/* ID */}
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span className="font-medium">Helix ID:</span>
                      <code className="font-mono bg-neutral-100 px-1.5 py-0.5 rounded-sm text-neutral-800 font-bold">{member.id}</code>
                    </div>

                    {/* Password */}
                    {member.password !== null && (
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <span className="font-medium">Password:</span>
                        <span className="font-mono bg-neutral-100 px-1.5 py-0.5 rounded-sm text-neutral-800 font-bold tracking-widest">
                          {member.password}
                        </span>
                      </div>
                    )}

                    {/* Created by */}
                    {member.createdBy && (
                      <p className="text-xs text-neutral-400">Added by ID {member.createdBy}</p>
                    )}
                  </div>
                </div>

                {/* Actions — all labelled */}
                {(member.canEdit || member.canDelete) && !isConfirmDelete && (
                  <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                    {member.canEdit && (
                      <>
                        {/* Edit Name */}
                        {!isEditingName && (
                          <button
                            onClick={() => { setEditingName(member.id); setNameInput(member.name); }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-500 border border-neutral-200 rounded-sm hover:border-neutral-400 hover:text-neutral-700 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                            </svg>
                            Edit Name
                          </button>
                        )}
                        {/* Change Password */}
                        {member.password !== null && (
                          <button
                            onClick={() => setChangePwTarget({ id: member.id, name: member.name })}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-500 border border-neutral-200 rounded-sm hover:border-gold hover:text-gold transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                            </svg>
                            Change Password
                          </button>
                        )}
                        {/* Permissions */}
                        {member.rank !== "team_lead" && (
                          <button
                            onClick={() => setExpandedPerms(isExpanded ? null : member.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-sm border transition-colors ${
                              isExpanded
                                ? "border-gold/40 text-gold bg-amber-50"
                                : "border-neutral-200 text-neutral-500 hover:border-indigo-300 hover:text-indigo-600"
                            }`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>
                            Permissions
                          </button>
                        )}
                      </>
                    )}
                    {/* Remove */}
                    {member.canDelete && (
                      <button
                        onClick={() => setConfirmDelete(member.id)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-500 border border-neutral-200 rounded-sm hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Remove
                      </button>
                    )}
                  </div>
                )}

                {/* Confirm delete */}
                {isConfirmDelete && (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-neutral-500">Remove {member.name}?</span>
                    <button
                      onClick={() => handleDelete(member.id)}
                      disabled={loading === `delete-${member.id}`}
                      className="text-xs px-3 py-1.5 bg-red-500 text-white rounded-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {loading === `delete-${member.id}` ? "Removing…" : "Confirm"}
                    </button>
                    <button onClick={() => setConfirmDelete(null)} className="text-xs text-neutral-400 hover:text-neutral-600">Cancel</button>
                  </div>
                )}
              </div>

              {/* Delete error */}
              {errors[`delete-${member.id}`] && (
                <div className="px-6 pb-3">
                  <p className="text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-sm">{errors[`delete-${member.id}`]}</p>
                </div>
              )}

              {/* ── Permissions Panel ── */}
              {isExpanded && member.rank !== "team_lead" && (
                <div className="border-t border-neutral-100 bg-neutral-50 px-6 py-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">Permissions</p>
                  {errors[`perm-${member.id}`] && (
                    <p className="text-xs text-red-600 mb-3">{errors[`perm-${member.id}`]}</p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(Object.keys(PERM_LABELS) as PermKey[]).map((perm) => {
                      const isOn = member.permissions[perm as keyof typeof member.permissions];
                      const isLocked = loading === `perm-${member.id}-${perm}`;
                      return (
                        <div key={perm} className="flex items-center justify-between py-2 px-3 bg-white border border-neutral-100 rounded-sm">
                          <span className="text-xs text-neutral-700">{PERM_LABELS[perm]}</span>
                          <Toggle
                            checked={isOn as boolean}
                            onChange={(v) => handleToggle(member.id, perm, v)}
                            disabled={isLocked || !member.canEdit}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
