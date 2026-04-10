import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";

const ACCOUNTS_FILE = join(process.cwd(), "data", "admin-accounts.json");

// ─── Rank System ──────────────────────────────────────────────────────────────

export type Rank = "team_lead" | "ser_member" | "base_member";

export const RANK_LABELS: Record<Rank, string> = {
  team_lead: "Founding SER Member / Team Lead",
  ser_member: "Founding SER Member",
  base_member: "Base Helix Member",
};

export const RANK_ORDER: Record<Rank, number> = {
  team_lead: 0,
  ser_member: 1,
  base_member: 2,
};

// ─── Permissions ──────────────────────────────────────────────────────────────

export interface AdminPermissions {
  canLogin: boolean;
  canViewRequests: boolean;
  canAddProducts: boolean;
  canDeleteProducts: boolean;
  canAddMembers: boolean;
  canDeleteMembers: boolean;
  canManageMembers: boolean;
  canManageProducts: boolean;
}

export const PERMISSION_LABELS: Record<keyof AdminPermissions, string> = {
  canLogin:          "Admin Login",
  canViewRequests:   "View Requests & Buys",
  canAddProducts:    "Add Products",
  canDeleteProducts: "Delete Products",
  canAddMembers:     "Add Members",
  canDeleteMembers:  "Delete Members",
  canManageMembers:  "Manage & Edit Members",
  canManageProducts: "Manage & Edit Products",
};

export const DEFAULT_PERMISSIONS: Record<Rank, AdminPermissions> = {
  team_lead: {
    canLogin: true, canViewRequests: true, canAddProducts: true,
    canDeleteProducts: true, canAddMembers: true, canDeleteMembers: true,
    canManageMembers: true, canManageProducts: true,
  },
  ser_member: {
    canLogin: true, canViewRequests: true, canAddProducts: true,
    canDeleteProducts: true, canAddMembers: true, canDeleteMembers: true,
    canManageMembers: true, canManageProducts: true,
  },
  base_member: {
    canLogin: true, canViewRequests: false, canAddProducts: true,
    canDeleteProducts: true, canAddMembers: false, canDeleteMembers: false,
    canManageMembers: false, canManageProducts: true,
  },
};

// ─── Account ──────────────────────────────────────────────────────────────────

export interface AdminAccount {
  id: string;
  name: string;
  rank: Rank;
  password: string;       // plain text — for authorized viewing
  passwordHash: string;
  permissions: AdminPermissions;
  createdBy: string | null;
}

// ─── File I/O ─────────────────────────────────────────────────────────────────

function read(): AdminAccount[] {
  try {
    return JSON.parse(readFileSync(ACCOUNTS_FILE, "utf-8")) as AdminAccount[];
  } catch {
    return [];
  }
}

function save(accounts: AdminAccount[]) {
  writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function getAccounts(): AdminAccount[] {
  return read();
}

export function getAccountById(id: string): AdminAccount | null {
  return read().find((a) => a.id === id) ?? null;
}

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export function validatePassword(account: AdminAccount, password: string): boolean {
  return account.passwordHash === hashPassword(password);
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function createAccount(data: Omit<AdminAccount, "passwordHash">): AdminAccount {
  const accounts = read();
  const account: AdminAccount = { ...data, passwordHash: hashPassword(data.password) };
  accounts.push(account);
  save(accounts);
  return account;
}

export function updateAccountPassword(id: string, newPassword: string): boolean {
  const accounts = read();
  const idx = accounts.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  accounts[idx].password = newPassword;
  accounts[idx].passwordHash = hashPassword(newPassword);
  save(accounts);
  return true;
}

export function updateAccountName(id: string, name: string): boolean {
  const accounts = read();
  const idx = accounts.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  accounts[idx].name = name;
  save(accounts);
  return true;
}

export function updatePermissions(id: string, perms: Partial<AdminPermissions>): boolean {
  const accounts = read();
  const idx = accounts.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  accounts[idx].permissions = { ...accounts[idx].permissions, ...perms };
  save(accounts);
  return true;
}

export function deleteAccountById(id: string): boolean {
  const accounts = read();
  const idx = accounts.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  accounts.splice(idx, 1);
  save(accounts);
  return true;
}
