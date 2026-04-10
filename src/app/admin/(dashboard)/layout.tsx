import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, getSessionHelixId, SESSION_COOKIE } from "@/lib/auth";
import { getAccountById, RANK_LABELS, Rank } from "@/lib/accounts";
import AdminNav from "@/components/AdminNav";
import AdminSessionGuard from "@/components/AdminSessionGuard";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  if (!session?.value || !verifySessionToken(session.value)) {
    redirect("/admin/login");
  }

  const helixId = getSessionHelixId(session.value) ?? "----";
  const account = helixId ? getAccountById(helixId) : null;
  const userName = account?.name ?? "Admin";
  const rank = (account?.rank ?? "base_member") as Rank;
  const rankLabel = RANK_LABELS[rank] ?? rank;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AdminSessionGuard />
      <AdminNav userName={userName} helixId={helixId} rank={rank} rankLabel={rankLabel} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
