"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      <main className={`flex-1 ${isAdmin ? "" : pathname === "/" ? "" : "pt-16"}`}>{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
}
