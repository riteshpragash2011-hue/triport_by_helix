import type { Metadata } from "next";
import { cookies } from "next/headers";
import { verifySessionToken, getSessionHelixId, SESSION_COOKIE } from "@/lib/auth";
import { getAccountById, RANK_LABELS, Rank } from "@/lib/accounts";
import AccountClient from "./AccountClient";

export const metadata: Metadata = { title: "Admin — Account" };

export default async function AccountPage() {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  const helixId = session?.value && verifySessionToken(session.value)
    ? (getSessionHelixId(session.value) ?? "")
    : "";
  const account = helixId ? getAccountById(helixId) : null;
  const rank = (account?.rank ?? "base_member") as Rank;

  return (
    <AccountClient
      name={account?.name ?? "Unknown"}
      rank={rank}
      rankLabel={RANK_LABELS[rank] ?? rank}
      helixId={account?.id ?? helixId}
    />
  );
}
