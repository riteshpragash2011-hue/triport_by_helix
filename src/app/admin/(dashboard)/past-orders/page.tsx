import type { Metadata } from "next";
import Link from "next/link";
import { getAllRequestsAction, StatusUpdate } from "@/actions/request-management";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin — Past Orders" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default async function PastOrdersPage() {
  const { buy, custom } = await getAllRequestsAction();

  const past = [...buy, ...custom]
    .filter((r) => r.status === "completed" || r.status === "cancelled")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const completed = past.filter((r) => r.status === "completed");
  const cancelled = past.filter((r) => r.status === "cancelled");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-neutral-100 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-1">Past Orders</h1>
              <p className="text-neutral-500 text-sm">Completed and cancelled requests.</p>
            </div>
            <Link
              href="/admin/requests"
              className="flex items-center gap-2 text-sm text-neutral-500 border border-neutral-200 px-3 py-2 rounded-sm hover:border-neutral-300 hover:text-neutral-700 transition-colors whitespace-nowrap"
            >
              ← Active Requests
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-6">
            <div className="px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-sm">
              <div className="text-2xl font-bold text-neutral-900">{past.length}</div>
              <div className="text-xs text-neutral-500 mt-0.5 uppercase tracking-wider">Total Past</div>
            </div>
            <div className="px-5 py-4 bg-green-50 border border-green-100 rounded-sm">
              <div className="text-2xl font-bold text-green-700">{completed.length}</div>
              <div className="text-xs text-green-600 mt-0.5 uppercase tracking-wider">Fulfilled</div>
            </div>
            <div className="px-5 py-4 bg-red-50 border border-red-100 rounded-sm">
              <div className="text-2xl font-bold text-red-700">{cancelled.length}</div>
              <div className="text-xs text-red-600 mt-0.5 uppercase tracking-wider">Cancelled</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {past.length === 0 ? (
          <div className="border border-dashed border-neutral-200 rounded-sm p-16 text-center">
            <p className="text-neutral-400 text-sm">No past orders yet.</p>
            <p className="text-neutral-300 text-xs mt-1">Completed and cancelled orders will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {past.map((req) => {
              const isCompleted = req.status === "completed";
              const isBuy = req.type === "buy";
              const updates = [...((req.statusUpdates as StatusUpdate[]) ?? [])].reverse();
              const title = isBuy
                ? (req as Record<string, string>).productName
                : (req as Record<string, string>).projectTitle;

              return (
                <div
                  key={req.id}
                  className={`rounded-sm overflow-hidden border-l-4 border border-neutral-100 ${
                    isCompleted ? "border-l-green-500" : "border-l-red-500"
                  }`}
                >
                  {/* Top stripe */}
                  <div className={`px-5 py-3 flex items-center justify-between gap-3 ${
                    isCompleted ? "bg-green-50" : "bg-red-50"
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${
                        isCompleted ? "text-green-700" : "text-red-700"
                      }`}>
                        {isCompleted ? (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            Fulfilled
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancelled
                          </>
                        )}
                      </span>
                      <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-sm">
                        {isBuy ? "Buy" : "Custom"}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-400">{formatDate(req.createdAt)}</span>
                  </div>

                  {/* Body */}
                  <div className="p-5 bg-white">
                    <h3 className="font-semibold text-neutral-900 mb-0.5">{title}</h3>
                    <p className="text-xs text-neutral-400 mb-3">
                      {(req as Record<string, string>).customerName} —{" "}
                      <a href={`mailto:${(req as Record<string, string>).email}`} className="hover:text-gold transition-colors">
                        {(req as Record<string, string>).email}
                      </a>
                    </p>

                    {isBuy ? (
                      <p className="text-sm text-neutral-500">Qty: <span className="font-semibold text-neutral-700">{(req as Record<string, number>).quantity}</span></p>
                    ) : (
                      <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2">
                        {(req as Record<string, string>).description}
                      </p>
                    )}

                    {/* Status updates timeline */}
                    {updates.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-neutral-100 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Order History</p>
                        {updates.map((u: StatusUpdate) => (
                          <div key={u.id} className="flex gap-3">
                            <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${isCompleted ? "bg-green-400" : "bg-red-400"}`} />
                            <div>
                              <p className="text-sm text-neutral-700 leading-relaxed">{u.message}</p>
                              <p className="text-xs text-neutral-400 mt-0.5">{u.author} · {formatDate(u.timestamp)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
