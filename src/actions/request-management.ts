"use server";

import fs from "fs";
import path from "path";
import { cookies } from "next/headers";
import { verifySessionToken, getSessionHelixId, SESSION_COOKIE } from "@/lib/auth";
import { getAccountById } from "@/lib/accounts";

const DATA_DIR = path.join(process.cwd(), "data");
const BUY_FILE = path.join(DATA_DIR, "buy-requests.json");
const CUSTOM_FILE = path.join(DATA_DIR, "custom-requests.json");

export type RequestStatus = "pending" | "in_progress" | "completed" | "cancelled";

export interface StatusUpdate {
  id: string;
  message: string;
  timestamp: string;
  author: string;
}

function readFile(file: string) {
  try { return JSON.parse(fs.readFileSync(file, "utf-8")); }
  catch { return []; }
}

function writeFile(file: string, data: unknown) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}

function fileFor(type: "buy" | "custom") {
  return type === "buy" ? BUY_FILE : CUSTOM_FILE;
}

function getAuthor(): string {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get(SESSION_COOKIE);
    if (!session?.value) return "Admin";
    const helixId = verifySessionToken(session.value) ? getSessionHelixId(session.value) : null;
    if (!helixId) return "Admin";
    const account = getAccountById(helixId);
    return account?.name ?? "Admin";
  } catch { return "Admin"; }
}

export async function updateRequestStatusAction(
  type: "buy" | "custom",
  id: string,
  status: RequestStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const file = fileFor(type);
    const items = readFile(file);
    const idx = items.findIndex((r: { id: string }) => r.id === id);
    if (idx === -1) return { success: false, error: "Request not found." };

    const author = getAuthor();
    const prevStatus = items[idx].status ?? "pending";

    items[idx].status = status;
    if (!Array.isArray(items[idx].statusUpdates)) items[idx].statusUpdates = [];

    // Auto-log the status change
    const labels: Record<RequestStatus, string> = {
      pending: "Pending",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
    };
    items[idx].statusUpdates.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      message: `Status changed from ${labels[prevStatus as RequestStatus] ?? prevStatus} to ${labels[status]}.`,
      timestamp: new Date().toISOString(),
      author,
    });

    writeFile(file, items);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to update status." };
  }
}

export async function addStatusUpdateAction(
  type: "buy" | "custom",
  id: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  if (!message.trim()) return { success: false, error: "Message cannot be empty." };
  try {
    const file = fileFor(type);
    const items = readFile(file);
    const idx = items.findIndex((r: { id: string }) => r.id === id);
    if (idx === -1) return { success: false, error: "Request not found." };

    if (!Array.isArray(items[idx].statusUpdates)) items[idx].statusUpdates = [];
    items[idx].statusUpdates.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      author: getAuthor(),
    });

    writeFile(file, items);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to add update." };
  }
}

export async function getAllRequestsAction() {
  const buy = readFile(BUY_FILE).map((r: Record<string, unknown>) => ({ ...r, type: "buy" as const }));
  const custom = readFile(CUSTOM_FILE).map((r: Record<string, unknown>) => ({ ...r, type: "custom" as const }));
  return { buy, custom };
}
