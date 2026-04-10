import type { Metadata } from "next";
import { getMembersAction } from "@/actions/members";
import MembersClient from "./MembersClient";

export const metadata: Metadata = { title: "Admin — Members" };

export default async function MembersPage() {
  const result = await getMembersAction();

  if ("error" in result) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-red-500 text-sm">{result.error}</p>
      </div>
    );
  }

  return (
    <MembersClient
      initialMembers={result.members}
      viewerRank={result.viewerRank}
      viewerId={result.viewerId}
    />
  );
}
