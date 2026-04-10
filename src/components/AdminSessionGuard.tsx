"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/actions/auth";

/**
 * Mounted inside every admin dashboard page.
 * sessionStorage is cleared automatically by the browser when the tab is closed,
 * so on the next fresh tab open (or new browser session) the flag is missing
 * and we immediately sign the user out before they see any admin content.
 */
export default function AdminSessionGuard() {
  const router = useRouter();

  useEffect(() => {
    const tabActive = sessionStorage.getItem("triport_admin_tab");
    if (!tabActive) {
      // Tab was closed — clear cookie and redirect to login
      logoutAction().then(() => {
        router.replace("/admin/login");
      });
    }
  }, [router]);

  return null; // renders nothing
}
