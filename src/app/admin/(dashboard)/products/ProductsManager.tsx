"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addProductAction, deleteProductAction, updateProductAction } from "@/actions/products";

interface Product {
  id: string; slug: string; name: string; shortDescription: string;
  fullDescription: string; category: string; estimatedPrice: number;
  image: string; featured: boolean; tags: string[];
}

interface FormState {
  name: string; shortDescription: string; fullDescription: string;
  category: string; estimatedPrice: string; image: string;
  featured: boolean; tags: string;
}

const BLANK: FormState = {
  name: "", shortDescription: "", fullDescription: "",
  category: "", estimatedPrice: "", image: "", featured: false, tags: "",
};

const CATEGORIES = [
  "Desk Accessories", "Mechanical Parts", "Models & Decor",
  "Workshop Tools", "Electronics", "Outdoor & Garden", "Other",
];

function productToForm(p: Product): FormState {
  return {
    name: p.name, shortDescription: p.shortDescription,
    fullDescription: p.fullDescription, category: p.category,
    estimatedPrice: String(p.estimatedPrice), image: p.image,
    featured: p.featured, tags: p.tags.join(", "),
  };
}

function validate(f: FormState): string | null {
  if (!f.name.trim()) return "Product name is required.";
  if (!f.shortDescription.trim()) return "Short description is required.";
  if (!f.category) return "Category is required.";
  const price = parseFloat(f.estimatedPrice);
  if (isNaN(price) || price <= 0) return "Enter a valid price.";
  return null;
}

/* ── Inline product form (add or edit) ─────────────────────────── */
function ProductForm({
  initial, onSave, onCancel, saving, error, title,
}: {
  initial: FormState; onSave: (f: FormState) => void; onCancel: () => void;
  saving: boolean; error: string; title: string;
}) {
  const [f, setF] = useState(initial);

  function set(key: keyof FormState, val: string | boolean) {
    setF((p) => ({ ...p, [key]: val }));
  }

  return (
    <div className="border border-gold/30 rounded-sm bg-amber-50/30 p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-neutral-900">{title}</h3>
        <button onClick={onCancel} className="text-neutral-400 hover:text-neutral-600 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-sm">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="form-label">Product Name <span className="text-red-400">*</span></label>
          <input className="form-input" value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Adjustable Monitor Stand" />
        </div>
        <div className="sm:col-span-2">
          <label className="form-label">Short Description <span className="text-red-400">*</span></label>
          <input className="form-input" value={f.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} placeholder="One sentence shown on product cards" />
        </div>
        <div className="sm:col-span-2">
          <label className="form-label">Full Description</label>
          <textarea className="form-textarea" rows={3} value={f.fullDescription} onChange={(e) => set("fullDescription", e.target.value)} placeholder="Detailed description for the product page (optional)" />
        </div>
        <div>
          <label className="form-label">Category <span className="text-red-400">*</span></label>
          <select className="form-select" value={f.category} onChange={(e) => set("category", e.target.value)}>
            <option value="">Select…</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Estimated Price ($) <span className="text-red-400">*</span></label>
          <input className="form-input" type="number" min="0.01" step="0.01" value={f.estimatedPrice} onChange={(e) => set("estimatedPrice", e.target.value)} placeholder="25.00" />
        </div>
        <div className="sm:col-span-2">
          <label className="form-label">Image URL</label>
          <input className="form-input" type="url" value={f.image} onChange={(e) => set("image", e.target.value)} placeholder="https://example.com/image.jpg" />
        </div>
        <div className="sm:col-span-2">
          <label className="form-label">Tags <span className="text-xs font-normal text-neutral-400">(comma-separated)</span></label>
          <input className="form-input" value={f.tags} onChange={(e) => set("tags", e.target.value)} placeholder="desk, organizer, cable management" />
        </div>
        <div className="sm:col-span-2">
          <label className="flex items-center gap-3 p-3 bg-white border border-neutral-200 rounded-sm cursor-pointer hover:border-gold/40 transition-colors">
            <input type="checkbox" checked={f.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-gold" />
            <div>
              <span className="text-sm font-medium text-neutral-700">Mark as Featured</span>
              <p className="text-xs text-neutral-400 mt-0.5">Appears on homepage and top of catalog</p>
            </div>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          onClick={() => onSave(f)}
          disabled={saving}
          className="btn-gold px-6 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving && (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          )}
          {saving ? "Saving…" : "Save Product"}
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 text-sm text-neutral-500 border border-neutral-200 rounded-sm hover:bg-neutral-50 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */
export default function ProductsManager({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<"list" | "add" | { editId: string }>("list");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const products = initialProducts;

  async function handleAdd(f: FormState) {
    const err = validate(f);
    if (err) { setFormError(err); return; }
    setSaving(true); setFormError("");
    const res = await addProductAction({
      name: f.name.trim(), shortDescription: f.shortDescription.trim(),
      fullDescription: f.fullDescription.trim() || f.shortDescription.trim(),
      category: f.category, estimatedPrice: parseFloat(f.estimatedPrice),
      image: f.image.trim(), featured: f.featured,
      tags: f.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    setSaving(false);
    if (res.success) { setMode("list"); startTransition(() => router.refresh()); }
    else setFormError("error" in res ? res.error : "Failed.");
  }

  async function handleEdit(id: string, f: FormState) {
    const err = validate(f);
    if (err) { setFormError(err); return; }
    setSaving(true); setFormError("");
    const res = await updateProductAction(id, {
      name: f.name.trim(), shortDescription: f.shortDescription.trim(),
      fullDescription: f.fullDescription.trim() || f.shortDescription.trim(),
      category: f.category, estimatedPrice: parseFloat(f.estimatedPrice),
      image: f.image.trim(), featured: f.featured,
      tags: f.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    setSaving(false);
    if ("success" in res && res.success) { setMode("list"); startTransition(() => router.refresh()); }
    else setFormError("error" in res ? res.error : "Failed.");
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    await deleteProductAction(id);
    setDeletingId(null);
    setConfirmDelete(null);
    startTransition(() => router.refresh());
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-neutral-100 bg-white sticky top-14 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Manage Products</h1>
            <p className="text-neutral-500 text-sm mt-0.5">
              {products.length} product{products.length !== 1 ? "s" : ""} in catalog
            </p>
          </div>
          {mode === "list" && (
            <button
              onClick={() => { setMode("add"); setFormError(""); }}
              className="btn-gold px-4 py-2.5 text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Product
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">

        {/* Add form */}
        {mode === "add" && (
          <ProductForm
            title="Add New Product"
            initial={BLANK}
            onSave={handleAdd}
            onCancel={() => { setMode("list"); setFormError(""); }}
            saving={saving}
            error={formError}
          />
        )}

        {/* Products list */}
        {products.length === 0 && mode !== "add" ? (
          <div className="border border-dashed border-neutral-200 rounded-sm p-16 text-center">
            <p className="text-neutral-400 text-sm">No products in the catalog yet.</p>
            <button onClick={() => setMode("add")} className="mt-3 text-sm text-gold hover:underline">
              Add your first product →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id}>
                {/* Edit form inline */}
                {typeof mode === "object" && mode.editId === p.id ? (
                  <ProductForm
                    title={`Editing: ${p.name}`}
                    initial={productToForm(p)}
                    onSave={(f) => handleEdit(p.id, f)}
                    onCancel={() => { setMode("list"); setFormError(""); }}
                    saving={saving}
                    error={formError}
                  />
                ) : (
                  /* Product row */
                  <div className="border border-neutral-100 rounded-sm bg-white hover:border-neutral-200 transition-colors">
                    <div className="flex items-center gap-4 p-4">
                      {/* Image thumb */}
                      <div className="w-12 h-12 rounded-sm bg-neutral-100 border border-neutral-200 shrink-0 overflow-hidden flex items-center justify-center">
                        {p.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-5 h-5 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-neutral-900 truncate">{p.name}</span>
                          {p.featured && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gold bg-amber-50 border border-gold/20 px-1.5 py-0.5 rounded-sm">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-sm">{p.category}</span>
                          <span className="text-xs text-neutral-500">{p.shortDescription}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-sm font-semibold text-neutral-800 shrink-0">
                        ${p.estimatedPrice.toFixed(2)}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => { setMode({ editId: p.id }); setFormError(""); }}
                          className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-sm transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setConfirmDelete(p.id)}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Delete confirmation bar */}
                    {confirmDelete === p.id && (
                      <div className="border-t border-red-100 bg-red-50 px-4 py-3 flex items-center justify-between gap-3">
                        <p className="text-sm text-red-700">
                          Delete <strong>{p.name}</strong>? This cannot be undone.
                        </p>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleDelete(p.id)}
                            disabled={deletingId === p.id}
                            className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
                          >
                            {deletingId === p.id ? "Deleting…" : "Delete"}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-3 py-1.5 text-xs text-neutral-600 border border-neutral-200 rounded-sm hover:bg-white transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
