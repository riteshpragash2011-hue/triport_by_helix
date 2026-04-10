import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { getBuyRequests, getCustomRequests } from "@/actions/requests";
import { verifySessionToken, getSessionHelixId, SESSION_COOKIE } from "@/lib/auth";
import { getAccountById, getAccounts } from "@/lib/accounts";

export const metadata: Metadata = { title: "Admin — Dashboard" };

export default async function AdminHomePage() {
  const [buyRequests, customRequests] = await Promise.all([
    getBuyRequests(),
    getCustomRequests(),
  ]);

  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  const helixId = session?.value && verifySessionToken(session.value)
    ? (getSessionHelixId(session.value) ?? "") : "";
  const account = helixId ? getAccountById(helixId) : null;
  const memberCount = getAccounts().length;

  const tiles = [
    {
      href: "/admin/requests",
      label: "Requests",
      sublabel: "Dashboard",
      description:
        "View all buy and custom print requests submitted through TRIport.",
      stats: [
        { label: "Buy Requests", count: buyRequests.length },
        { label: "Custom Requests", count: customRequests.length },
      ],
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
        </svg>
      ),
    },
    {
      href: "/admin/past-orders",
      label: "Past Orders",
      sublabel: "History",
      description: "View completed and cancelled orders with full status history.",
      stats: [
        { label: "Fulfilled", count: [...buyRequests, ...customRequests].filter((r) => (r as { status?: string }).status === "completed").length },
        { label: "Cancelled", count: [...buyRequests, ...customRequests].filter((r) => (r as { status?: string }).status === "cancelled").length },
      ],
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
    },
    {
      href: "/admin/members",
      label: "Members",
      sublabel: "Team",
      description: "View and manage Helix team members, ranks, and permissions.",
      stats: [{ label: "Members", count: memberCount }],
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      href: "/admin/products",
      label: "Products",
      sublabel: "Catalog",
      description: "Add, edit, and delete products in the TRIport catalog.",
      stats: null,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
      ),
    },
    {
      href: "/admin/account",
      label: "Account",
      sublabel: "Profile",
      description: "View your Helix profile, rank, and manage your password.",
      stats: null,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Manage TRIport requests and product catalog.
        </p>
      </div>

      {/* Stat bar */}
      <div className="flex gap-4 mb-8">
        <div className="px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-sm">
          <div className="text-2xl font-bold text-neutral-900">
            {buyRequests.length + customRequests.length}
          </div>
          <div className="text-xs text-neutral-500 uppercase tracking-wider mt-0.5">
            Total Requests
          </div>
        </div>
        <div className="px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-sm">
          <div className="text-2xl font-bold text-neutral-900">
            {buyRequests.length}
          </div>
          <div className="text-xs text-neutral-500 uppercase tracking-wider mt-0.5">
            Buy Requests
          </div>
        </div>
        <div className="px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-sm">
          <div className="text-2xl font-bold text-neutral-900">
            {customRequests.length}
          </div>
          <div className="text-xs text-neutral-500 uppercase tracking-wider mt-0.5">
            Custom Requests
          </div>
        </div>
      </div>

      {/* Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="group block border border-neutral-100 rounded-sm p-5 hover:border-gold/40 hover:shadow-sm transition-all duration-200 bg-white"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-neutral-50 border border-neutral-100 rounded-sm text-neutral-600 group-hover:bg-amber-50 group-hover:border-gold/20 group-hover:text-gold transition-colors">
                {tile.icon}
              </div>
              <svg className="w-4 h-4 text-neutral-300 group-hover:text-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
            <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium mb-0.5">
              {tile.sublabel}
            </p>
            <h3 className="font-semibold text-neutral-900 mb-2">{tile.label}</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">{tile.description}</p>
            {tile.stats && (
              <div className="flex gap-4 mt-4 pt-4 border-t border-neutral-50">
                {tile.stats.map((s) => (
                  <div key={s.label}>
                    <div className="text-lg font-bold text-neutral-900">{s.count}</div>
                    <div className="text-xs text-neutral-400">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* System info */}
      <div className="mt-8 border border-neutral-100 rounded-sm p-4 bg-neutral-50 flex flex-wrap gap-6 text-sm text-neutral-500">
        <span><span className="font-medium text-neutral-700">Platform:</span> TRIport</span>
        <span><span className="font-medium text-neutral-700">Project:</span> Helix 0002</span>
        <span>
          <span className="font-medium text-neutral-700">Storage:</span>{" "}
          <code className="font-mono text-xs bg-neutral-100 px-1 rounded">data/*.json</code>
        </span>
      </div>
    </div>
  );
}
