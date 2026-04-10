"use client";

import { useRouter } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { useState } from "react";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await logoutAction();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-500 border border-neutral-200 rounded-sm hover:border-neutral-300 hover:text-neutral-700 transition-colors disabled:opacity-50"
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
        />
      </svg>
      {loading ? "Signing out…" : "Sign Out"}
    </button>
  );
}
