"use server";

import { getAccountById } from "@/lib/accounts";
import { createResetToken, validateResetToken, consumeResetToken } from "@/lib/reset-tokens";
import { sendPasswordResetEmail } from "@/lib/email";
import { updateAccountPassword } from "@/lib/accounts";
import { headers } from "next/headers";

/** Step 1: Request a reset link for a given Helix ID. */
export async function requestPasswordResetAction(helixId: string): Promise<
  { success: true } | { error: string }
> {
  try {
    if (!helixId || helixId.length !== 4 || !/^\d{4}$/.test(helixId)) {
      return { error: "Please enter a valid 4-digit Helix ID." };
    }

    const account = getAccountById(helixId);
    if (!account) {
      // Don't reveal whether the account exists — always say "sent"
      return { success: true };
    }

    const token = createResetToken(helixId);

    // Determine base URL
    const headersList = headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const proto = headersList.get("x-forwarded-proto") ?? "http";
    const baseUrl = `${proto}://${host}`;

    await sendPasswordResetEmail(helixId, token, baseUrl);
    return { success: true };
  } catch (err) {
    console.error("Password reset email error:", err);
    return { error: "Failed to send reset email. Check server email configuration." };
  }
}

/** Step 2: Validate the token and set a new password. */
export async function resetPasswordAction(
  token: string,
  newPassword: string
): Promise<{ success: true } | { error: string }> {
  if (!token) return { error: "Invalid or missing reset token." };
  if (!newPassword || newPassword.length !== 8 || !/^\d{8}$/.test(newPassword)) {
    return { error: "Password must be exactly 8 digits." };
  }

  const accountId = validateResetToken(token);
  if (!accountId) {
    return { error: "This reset link is invalid or has expired. Please request a new one." };
  }

  try {
    updateAccountPassword(accountId, newPassword);
    consumeResetToken(token);
    return { success: true };
  } catch {
    return { error: "Failed to update password. Please try again." };
  }
}

/** Check if a token is valid (for page-load validation). */
export async function checkResetTokenAction(
  token: string
): Promise<{ valid: true; accountId: string } | { valid: false }> {
  const accountId = validateResetToken(token);
  if (!accountId) return { valid: false };
  return { valid: true, accountId };
}
