"use server";

import { cookies } from "next/headers";
import {
  validateAdminCredentials,
  createSessionToken,
  verifySessionToken,
  getSessionHelixId,
  SESSION_COOKIE,
} from "@/lib/auth";
import { getAccountById, validatePassword, updateAccountPassword } from "@/lib/accounts";

/** Login — returns { success: true, name } or { error: string } */
export async function loginAction(
  helixId: string,
  password: string
): Promise<{ success: true; name: string } | { error: string }> {
  if (!helixId || !password) {
    return { error: "Please enter your Helix ID and password." };
  }
  if (!validateAdminCredentials(helixId, password)) {
    return { error: "Invalid credentials. Please try again." };
  }

  const token = createSessionToken(helixId);
  const cookieStore = cookies();
  // No maxAge → browser session cookie, deleted when the browser window closes.
  // AdminSessionGuard additionally clears it when the specific tab is closed.
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  const account = getAccountById(helixId);
  return { success: true, name: account?.name ?? "Admin" };
}

/** Logout — clears the session cookie */
export async function logoutAction(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** Verify current password before allowing change */
export async function verifyCurrentPasswordAction(
  currentPassword: string
): Promise<{ success: true } | { error: string }> {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session?.value || !verifySessionToken(session.value)) {
    return { error: "Not authenticated." };
  }
  const helixId = getSessionHelixId(session.value);
  if (!helixId) return { error: "Invalid session." };
  const account = getAccountById(helixId);
  if (!account) return { error: "Account not found." };
  if (!validatePassword(account, currentPassword)) {
    return { error: "Invalid credentials." };
  }
  return { success: true };
}

/** Save new password after verification */
export async function changePasswordAction(
  newPassword: string
): Promise<{ success: true } | { error: string }> {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session?.value || !verifySessionToken(session.value)) {
    return { error: "Not authenticated." };
  }
  const helixId = getSessionHelixId(session.value);
  if (!helixId) return { error: "Invalid session." };
  if (!/^\d{8}$/.test(newPassword)) {
    return { error: "Password must be exactly 8 digits." };
  }
  const updated = updateAccountPassword(helixId, newPassword);
  if (!updated) return { error: "Failed to update password." };
  return { success: true };
}
