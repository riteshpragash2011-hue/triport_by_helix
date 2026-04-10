"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { logoutAction } from "@/actions/auth";

interface AdminNavProps {
  userName: string;
  helixId: string;
  rank: string;
  rankLabel: string;
}

export default function AdminNav({ userName, helixId, rank, rankLabel }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await logoutAction();
    router.push("/admin/login");
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const navLinks = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
    },
    {
      label: "Requests",
      href: "/admin/requests",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
        </svg>
      ),
    },
    {
      label: "Past Orders",
      href: "/admin/past-orders",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
    },
    {
      label: "Members",
      href: "/admin/members",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      label: "Products",
      href: "/admin/products",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
      ),
    },
    {
      label: "Account",
      href: "/admin/account",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
    },
  ];

  const rankBadgeClass =
    rank === "team_lead"
      ? "text-gold bg-amber-50 border-gold/30"
      : rank === "ser_member"
      ? "text-indigo-600 bg-indigo-50 border-indigo-200"
      : "text-neutral-500 bg-neutral-50 border-neutral-200";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">

        {/* Logo + Portal label */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/admin">
            <Image src="/logo.png" alt="TRIport" width={90} height={26} className="h-6 w-auto" priority />
          </Link>
          <div className="h-5 w-px bg-neutral-200" />
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 hidden sm:block">Admin</span>
        </div>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm transition-colors duration-150 ${
                  isActive(link.href)
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: user info + sign out */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-xs font-semibold text-neutral-800 leading-tight">{userName}</p>
            <p className="text-xs font-mono text-neutral-400 leading-tight">ID {helixId}</p>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm border ${rankBadgeClass} hidden lg:block`}>
            {rankLabel}
          </span>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-500 border border-neutral-200 rounded-sm hover:border-neutral-300 hover:text-neutral-700 transition-colors disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            {loggingOut ? "Signing out…" : "Sign Out"}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-neutral-600 hover:text-neutral-900"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-3.5 flex flex-col justify-between">
            <span className={`block h-0.5 bg-current transition-transform duration-200 ${mobileOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
            <span className={`block h-0.5 bg-current transition-opacity duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 bg-current transition-transform duration-200 ${mobileOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-200 ${mobileOpen ? "max-h-96 border-t border-neutral-100" : "max-h-0"}`}>
        <div className="bg-white px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                isActive(link.href) ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-neutral-100 mt-2 flex items-center justify-between px-3 py-2">
            <div>
              <p className="text-xs font-semibold text-neutral-800">{userName}</p>
              <p className="text-xs text-neutral-400 font-mono">ID {helixId}</p>
              <p className={`text-[10px] font-semibold mt-0.5 ${rank === "team_lead" ? "text-gold" : rank === "ser_member" ? "text-indigo-600" : "text-neutral-400"}`}>
                {rankLabel}
              </p>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-xs text-neutral-500 border border-neutral-200 px-3 py-1.5 rounded-sm hover:border-neutral-300 transition-colors"
            >
              {loggingOut ? "Signing out…" : "Sign Out"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
