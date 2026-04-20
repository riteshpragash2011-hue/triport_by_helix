import type { Metadata } from "next";
import Link from "next/link";
import { getAllRequestsAction } from "@/actions/request-management";
import RequestsClient from "./RequestsClient"; 

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin — Requests",
  description: "Manage all buy and custom requests submitted through TRIport.",
};

export default async function AdminRequestsPage() {
  const { buy, custom } = await getAllRequestsAction();

  const active = [...buy, ...custom].filter(
    (r) => r.status !== "completed" && r.status !== "cancelled"
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-neutral-100 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-1">Active Requests</h1>
              <p className="text-neutral-500 text-sm">Update status and post updates on each order.</p>
            </div>
            <Link
              href="/admin/past-orders"
              className="flex items-center gap-2 text-sm text-neutral-500 border border-neutral-200 px-3 py-2 rounded-sm hover:border-neutral-300 hover:text-neutral-700 transition-colors whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              Past Orders
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-6">
            <div className="px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-sm">
              <div className="text-2xl font-bold text-neutral-900">{active.length}</div>
              <div className="text-xs text-neutral-500 mt-0.5 uppercase tracking-wider">Active</div>
            </div>
            <div className="px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-sm">
              <div className="text-2xl font-bold text-neutral-900">{buy.filter((r) => r.status !== "completed" && r.status !== "cancelled").length}</div>
              <div className="text-xs text-neutral-500 mt-0.5 uppercase tracking-wider">Buy</div>
            </div>
            <div className="px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-sm">
              <div className="text-2xl font-bold text-neutral-900">{custom.filter((r) => r.status !== "completed" && r.status !== "cancelled").length}</div>
              <div className="text-xs text-neutral-500 mt-0.5 uppercase tracking-wider">Custom</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RequestsClient buyRequests={buy} customRequests={custom} />
      </div>
    </div>
  );
}
