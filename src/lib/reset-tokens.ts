import fs from "fs";
import path from "path";
import crypto from "crypto";

const FILE = path.join(process.cwd(), "data", "password-reset-tokens.json");

export interface ResetToken {
  token: string;
  accountId: string;
  expiresAt: string; // ISO string
  used: boolean;
}

function readTokens(): ResetToken[] {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeTokens(tokens: ResetToken[]) {
  fs.writeFileSync(FILE, JSON.stringify(tokens, null, 2));
}

/** Generate a new reset token for the given account. Expires in 1 hour. */
export function createResetToken(accountId: string): string {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  // Clean up old tokens for this account
  const tokens = readTokens().filter(
    (t) => t.accountId !== accountId || t.used
  );
  tokens.push({ token, accountId, expiresAt, used: false });
  writeTokens(tokens);
  return token;
}

/** Validate a reset token. Returns the accountId if valid, null otherwise. */
export function validateResetToken(token: string): string | null {
  const tokens = readTokens();
  const entry = tokens.find((t) => t.token === token);
  if (!entry) return null;
  if (entry.used) return null;
  if (new Date(entry.expiresAt) < new Date()) return null;
  return entry.accountId;
}

/** Mark a token as used so it can't be reused. */
export function consumeResetToken(token: string) {
  const tokens = readTokens();
  const entry = tokens.find((t) => t.token === token);
  if (entry) {
    entry.used = true;
    writeTokens(tokens);
  }
}
