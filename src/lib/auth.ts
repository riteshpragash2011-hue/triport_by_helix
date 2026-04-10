import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { getAccountById, validatePassword, getAccounts } from "@/lib/accounts";

const SECRET =
  process.env.SESSION_SECRET ??
  "triport-helix-dev-secret-change-in-production";

export const SESSION_COOKIE = "triport_admin_session";
export const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

/** Validate 4-digit Helix ID + 8-digit password against accounts store */
export function validateAdminCredentials(
  helixId: string,
  password: string
): boolean {
  if (!/^\d{4}$/.test(helixId)) return false;
  if (!/^\d{8}$/.test(password)) return false;
  const account = getAccountById(helixId);
  if (!account) return false;
  if (!account.permissions?.canLogin) return false;
  return validatePassword(account, password);
}

/** Create a signed session token: base64url(payload).hmac */
export function createSessionToken(helixId: string): string {
  const nonce = randomBytes(16).toString("hex");
  const timestamp = Date.now().toString();
  const payload = `${helixId}:${nonce}:${timestamp}`;
  const payloadB64 = Buffer.from(payload).toString("base64url");
  const sig = createHmac("sha256", SECRET).update(payloadB64).digest("hex");
  return `${payloadB64}.${sig}`;
}

/** Verify a session token using constant-time comparison */
export function verifySessionToken(token: string): boolean {
  try {
    const dotIndex = token.lastIndexOf(".");
    if (dotIndex === -1) return false;
    const payloadB64 = token.slice(0, dotIndex);
    const sig = token.slice(dotIndex + 1);
    if (!payloadB64 || !sig) return false;
    const expectedSig = createHmac("sha256", SECRET)
      .update(payloadB64)
      .digest("hex");
    if (sig.length !== expectedSig.length) return false;
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig));
  } catch {
    return false;
  }
}

/** Decode the Helix ID from a verified session token */
export function getSessionHelixId(token: string): string | null {
  try {
    const dotIndex = token.lastIndexOf(".");
    if (dotIndex === -1) return null;
    const payloadB64 = token.slice(0, dotIndex);
    const payload = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const [helixId] = payload.split(":");
    return helixId || null;
  } catch {
    return null;
  }
}
