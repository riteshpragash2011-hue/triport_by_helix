"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateRequestStatusAction, addStatusUpdateAction, RequestStatus, StatusUpdate } from "@/actions/request-management";

/* ── Types ─────────────────────────────────────────────────────── */
interface BuyRequest {
  id: string; type: "buy"; createdAt: string; status: RequestStatus;
  statusUpdates: StatusUpdate[]; customerName: string; email: string;
  phone?: string; productName: string; quantity: number; notes?: string;
}
interface CustomRequest {
  id: string; type: "custom"; createdAt: string; status: RequestStatus;
  statusUpdates: StatusUpdate[]; customerName: string; email: string;
  phone?: string; projectTitle: string; description: string;
  intendedUse: string; size: string; material?: string; timeline: string; budget: string;
}
type AnyRequest = BuyRequest | CustomRequest;

/* ── Helpers ────────────────────────────────────────────────────── */
const STATUS_CONFIG: Record<RequestStatus, { label: string; color: string; bg: string; dot: string }> = {
  pending:     { label: "Pending",     color: "text-amber-700",  bg: "bg-amber-50 border-amber-200",   dot: "bg-amber-400" },
  in_progress: { label: "In Progress", color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",     dot: "bg-blue-500" },
  completed:   { label: "Completed",   color: "text-green-700",  bg: "bg-green-50 border-green-200",   dot: "bg-green-500" },
  cancelled:   { label: "Cancelled",   color: "text-red-700",    bg: "bg-red-50 border-red-200",       dot: "bg-red-500" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: RequestStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border text-xs font-semibold ${cfg.color} ${cfg.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

/* ── Single Request Card ────────────────────────────────────────── */
function RequestCard({ req }: { req: AnyRequest }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [updateText, setUpdateText] = useState("");
  const [showUpdates, setShowUpdates] = useState(false);
  const [postingUpdate, setPostingUpdate] = useState(false);
  const [error, setError] = useState("");

  const isBuy = req.type === "buy";
  const updates = [...(req.statusUpdates ?? [])].reverse();

  async function changeStatus(status: RequestStatus) {
    startTransition(async () => {
      await updateRequestStatusAction(req.type, req.id, status);
      router.refresh();
    });
  }

  async function submitUpdate() {
    if (!updateText.trim()) return;
    setPostingUpdate(true); setError("");
    const res = await addStatusUpdateAction(req.type, req.id, updateText);
    if (res.success) { setUpdateText(""); router.refresh(); }
    else setError(res.error ?? "Failed");
    setPostingUpdate(false);
  }

  const statusOptions: RequestStatus[] = ["pending", "in_progress", "completed", "cancelled"];

  return (
    <div className="border border-neutral-100 rounded-sm bg-white overflow-hidden">
      {/* Card header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-5 border-b border-neutral-50">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-sm">
              {isBuy ? "Buy" : "Custom"}
            </span>
            <StatusBadge status={req.status ?? "pending"} />
          </div>
          <h3 className="font-semibold text-neutral-900 truncate">
            {isBuy ? (req as BuyRequest).productName : (req as CustomRequest).projectTitle}
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            {req.customerName} —{" "}
            <a href={`mailto:${req.email}`} className="hover:text-gold transition-colors">{req.email}</a>
            {req.phone && ` — ${req.phone}`}
          </p>
        </div>
        <span className="text-xs text-neutral-400 whitespace-nowrap shrink-0">{formatDate(req.createdAt)}</span>
      </div>

      {/* Details */}
      <div className="p-5 border-b border-neutral-50 text-sm text-neutral-600 space-y-2">
        {isBuy ? (
          <>
            <div className="flex gap-6">
              <div><span className="text-xs text-neutral-400 uppercase tracking-wider">Qty</span><div className="font-semibold text-neutral-800">{(req as BuyRequest).quantity}</div></div>
            </div>
            {(req as BuyRequest).notes && <p className="text-neutral-500 text-xs">{(req as BuyRequest).notes}</p>}
          </>
        ) : (
          <>
            <p className="text-neutral-600 leading-relaxed">{(req as CustomRequest).description}</p>
            <div className="flex flex-wrap gap-2 text-xs pt-1">
              <span className="px-2 py-1 bg-neutral-100 text-neutral-500 rounded-sm">Use: {(req as CustomRequest).intendedUse}</span>
              <span className="px-2 py-1 bg-neutral-100 text-neutral-500 rounded-sm">Size: {(req as CustomRequest).size}</span>
              {(req as CustomRequest).material && <span className="px-2 py-1 bg-neutral-100 text-neutral-500 rounded-sm">Material: {(req as CustomRequest).material}</span>}
              <span className="px-2 py-1 bg-gold/10 text-gold rounded-sm font-medium">{(req as CustomRequest).timeline}</span>
              <span className="px-2 py-1 bg-gold/10 text-gold rounded-sm font-medium">Budget: {(req as CustomRequest).budget}</span>
            </div>
          </>
        )}
      </div>

      {/* Status controls */}
      <div className="p-5 border-b border-neutral-50 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Set Status</p>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((s) => {
              const cfg = STATUS_CONFIG[s];
              const active = (req.status ?? "pending") === s;
              return (
                <button
                  key={s}
                  onClick={() => !active && changeStatus(s)}
                  disabled={isPending || active}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-sm border transition-all ${
                    active
                      ? `${cfg.color} ${cfg.bg} cursor-default`
                      : "text-neutral-500 border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-50"
                  }`}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Add update */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Add Status Update</p>
          <div className="flex gap-2">
            <textarea
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              placeholder="Write an update for this order…"
              rows={2}
              className="flex-1 text-sm border border-neutral-200 rounded-sm px-3 py-2 resize-none focus:outline-none focus:border-gold transition-colors placeholder:text-neutral-300"
            />
            <button
              onClick={submitUpdate}
              disabled={postingUpdate || !updateText.trim()}
              className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-sm hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors self-end"
            >
              {postingUpdate ? "…" : "Post"}
            </button>
          </div>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      </div>

      {/* Status update history */}
      {updates.length > 0 && (
        <div className="p-5">
          <button
            onClick={() => setShowUpdates((v) => !v)}
            className="text-xs font-semibold text-neutral-400 hover:text-neutral-600 transition-colors flex items-center gap-1"
          >
            <svg className={`w-3.5 h-3.5 transition-transform ${showUpdates ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            {updates.length} update{updates.length !== 1 ? "s" : ""}
          </button>
          {showUpdates && (
            <div className="mt-3 space-y-3">
              {updates.map((u) => (
                <div key={u.id} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-2 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-700 leading-relaxed">{u.message}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{u.author} · {formatDate(u.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Main export ────────────────────────────────────────────────── */
export default function RequestsClient({
  buyRequests,
  customRequests,
}: {
  buyRequests: BuyRequest[];
  customRequests: CustomRequest[];
}) {
  const active = [...buyRequests, ...customRequests]
    .filter((r) => r.status !== "completed" && r.status !== "cancelled")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-4">
      {active.length === 0 ? (
        <div className="border border-dashed border-neutral-200 rounded-sm p-12 text-center text-neutral-400 text-sm">
          No active requests.
        </div>
      ) : (
        active.map((req) => <RequestCard key={req.id} req={req as AnyRequest} />)
      )}
    </div>
  );
}
