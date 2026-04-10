"use server";

import { cookies } from "next/headers";
import { verifySessionToken, getSessionHelixId, SESSION_COOKIE } from "@/lib/auth";
import {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccountPassword,
  updateAccountName,
  updatePermissions,
  deleteAccountById,
  AdminAccount,
  AdminPermissions,
  DEFAULT_PERMISSIONS,
  RANK_LABELS,
  Rank,
} from "@/lib/accounts";

// ─── Helper: get the logged-in account ────────────────────────────────────────

async function getActor(): Promise<AdminAccount | null> {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session?.value || !verifySessionToken(session.value)) return null;
  const id = getSessionHelixId(session.value);
  return id ? getAccountById(id) : null;
}

// ─── Permission helpers ───────────────────────────────────────────────────────

function canManage(actor: AdminAccount, target: AdminAccount): boolean {
  if (actor.id === target.id) return false;
  if (actor.rank === "team_lead") return true;
  if (
    actor.rank === "ser_member" &&
    actor.permissions.canManageMembers &&
    target.rank === "base_member"
  ) return true;
  return false;
}

function canSeePassword(actor: AdminAccount, target: AdminAccount): boolean {
  if (actor.rank === "team_lead") return true;
  if (actor.rank === "ser_member" && target.rank === "base_member") return true;
  return false;
}

function canSeeId(actor: AdminAccount): boolean {
  // All logged-in admins can see IDs; visibility differences are on the public page
  return true;
}

// ─── Get all members ──────────────────────────────────────────────────────────

export type MemberView = {
  id: string;
  name: string;
  rank: Rank;
  rankLabel: string;
  password: string | null;
  permissions: AdminPermissions;
  createdBy: string | null;
  canEdit: boolean;
  canDelete: boolean;
  isYou: boolean;
};

export type GetMembersResult =
  | { members: MemberView[]; viewerRank: Rank; viewerId: string }
  | { error: string };

export async function getMembersAction(): Promise<GetMembersResult> {
  const actor = await getActor();
  if (!actor) return { error: "Not authenticated." };

  const accounts = getAccounts();
  const members: MemberView[] = accounts.map((a) => ({
    id: a.id,
    name: a.name,
    rank: a.rank,
    rankLabel: RANK_LABELS[a.rank] ?? a.rank,
    password: canSeePassword(actor, a) ? a.password : null,
    permissions: a.permissions,
    createdBy: a.createdBy,
    canEdit: canManage(actor, a),
    canDelete: canManage(actor, a) && actor.permissions.canDeleteMembers,
    isYou: a.id === actor.id,
  }));

  return { members, viewerRank: actor.rank, viewerId: actor.id };
}

// ─── Add member ───────────────────────────────────────────────────────────────

export async function addMemberAction(data: {
  id: string;
  name: string;
  rank: Rank;
  password: string;
}): Promise<{ success: true } | { error: string }> {
  const actor = await getActor();
  if (!actor) return { error: "Not authenticated." };

  if (actor.rank !== "team_lead" && !actor.permissions.canAddMembers)
    return { error: "You don't have permission to add members." };
  if (actor.rank === "ser_member" && data.rank !== "base_member")
    return { error: "SER members can only add Base Helix Members." };
  if (!/^\d{4}$/.test(data.id))
    return { error: "ID must be exactly 4 digits." };
  if (getAccountById(data.id))
    return { error: `ID ${data.id} is already taken by another member.` };
  if (!data.name.trim())
    return { error: "Name is required." };
  if (!/^\d{8}$/.test(data.password))
    return { error: "Password must be exactly 8 digits." };

  createAccount({
    id: data.id,
    name: data.name.trim(),
    rank: data.rank,
    password: data.password,
    permissions: { ...DEFAULT_PERMISSIONS[data.rank] },
    createdBy: actor.id,
  });
  return { success: true };
}

// ─── Delete member ────────────────────────────────────────────────────────────

export async function deleteMemberAction(
  targetId: string
): Promise<{ success: true } | { error: string }> {
  const actor = await getActor();
  if (!actor) return { error: "Not authenticated." };
  if (actor.id === targetId) return { error: "You cannot delete your own account." };

  const target = getAccountById(targetId);
  if (!target) return { error: "Member not found." };
  if (!canManage(actor, target)) return { error: "Insufficient permissions." };
  if (!actor.permissions.canDeleteMembers) return { error: "You don't have permission to delete members." };

  deleteAccountById(targetId);
  return { success: true };
}

// ─── Update name ──────────────────────────────────────────────────────────────

export async function updateMemberNameAction(
  targetId: string,
  name: string
): Promise<{ success: true } | { error: string }> {
  const actor = await getActor();
  if (!actor) return { error: "Not authenticated." };

  const target = getAccountById(targetId);
  if (!target) return { error: "Member not found." };
  if (!canManage(actor, target)) return { error: "Insufficient permissions." };
  if (!name.trim()) return { error: "Name is required." };

  updateAccountName(targetId, name.trim());
  return { success: true };
}

// ─── Set password (by admin) ──────────────────────────────────────────────────

export async function setMemberPasswordAction(
  targetId: string,
  password: string
): Promise<{ success: true } | { error: string }> {
  const actor = await getActor();
  if (!actor) return { error: "Not authenticated." };

  const target = getAccountById(targetId);
  if (!target) return { error: "Member not found." };
  if (!canManage(actor, target)) return { error: "Insufficient permissions." };
  if (!/^\d{8}$/.test(password)) return { error: "Password must be exactly 8 digits." };

  updateAccountPassword(targetId, password);
  return { success: true };
}

// ─── Toggle permission ────────────────────────────────────────────────────────

export async function togglePermissionAction(
  targetId: string,
  permission: keyof AdminPermissions,
  value: boolean
): Promise<{ success: true } | { error: string }> {
  const actor = await getActor();
  if (!actor) return { error: "Not authenticated." };

  const target = getAccountById(targetId);
  if (!target) return { error: "Member not found." };
  if (target.rank === "team_lead") return { error: "Cannot modify Team Lead permissions." };
  if (!canManage(actor, target)) return { error: "Insufficient permissions." };

  updatePermissions(targetId, { [permission]: value });
  return { success: true };
}
