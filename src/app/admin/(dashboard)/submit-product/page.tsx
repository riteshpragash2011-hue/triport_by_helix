"use client";

import { useState } from "react";
import { addProductAction } from "@/actions/products";
import Toast from "@/components/Toast";

interface FormState {
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  estimatedPrice: string;
  image: string;
  featured: boolean;
  tags: string;
}

const initialForm: FormState = {
  name: "",
  shortDescription: "",
  fullDescription: "",
  category: "",
  estimatedPrice: "",
  image: "",
  featured: false,
  tags: "",
};

const categoryOptions = [
  "Desk Accessories",
  "Mechanical Parts",
  "Models & Decor",
  "Workshop Tools",
  "Electronics",
  "Outdoor & Garden",
  "Other",
];

export default function AddProductPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [addedCount, setAddedCount] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((p) => ({ ...p, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  }

  function validate(): string | null {
    if (!form.name.trim()) return "Product name is required.";
    if (!form.shortDescription.trim()) return "Short description is required.";
    if (!form.category) return "Category is required.";
    const price = parseFloat(form.estimatedPrice);
    if (isNaN(price) || price <= 0) return "Enter a valid estimated price.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { setToast({ message: err, type: "error" }); return; }
    setLoading(true);
    try {
      const result = await addProductAction({
        name: form.name.trim(),
        shortDescription: form.shortDescription.trim(),
        fullDescription: form.fullDescription.trim() || form.shortDescription.trim(),
        category: form.category,
        estimatedPrice: parseFloat(form.estimatedPrice),
        image: form.image.trim(),
        featured: form.featured,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      if (result.success) {
        setToast({ message: `"${form.name}" added to the catalog and is live now.`, type: "success" });
        setForm(initialForm);
        setAddedCount((c) => c + 1);
      } else {
        setToast({ message: result.error ?? "Failed to add product.", type: "error" });
      }
    } catch {
      setToast({ message: "Something went wrong. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-neutral-100 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">Add Product</h1>
          <p className="text-neutral-500 text-sm">
            Products are added directly to the live catalog and visible to the public immediately.
          </p>
          {addedCount > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-sm text-sm text-green-700">
              {addedCount} product{addedCount !== 1 ? "s" : ""} added this session — live on the public catalog.
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>

          {/* Product Info */}
          <fieldset>
            <legend className="text-base font-semibold text-neutral-900 mb-4 pb-2 border-b border-neutral-100 w-full">
              Product Information
            </legend>
            <div className="space-y-4">

              <div>
                <label htmlFor="name" className="form-label">
                  Product Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="name" name="name" type="text"
                  value={form.name} onChange={handleChange}
                  placeholder="e.g. Adjustable Monitor Stand"
                  className="form-input" required
                />
              </div>

              <div>
                <label htmlFor="shortDescription" className="form-label">
                  Short Description <span className="text-red-400">*</span>
                </label>
                <input
                  id="shortDescription" name="shortDescription" type="text"
                  value={form.shortDescription} onChange={handleChange}
                  placeholder="One sentence shown on product cards"
                  className="form-input" required
                />
              </div>

              <div>
                <label htmlFor="fullDescription" className="form-label">
                  Full Description
                </label>
                <textarea
                  id="fullDescription" name="fullDescription"
                  value={form.fullDescription} onChange={handleChange}
                  rows={4}
                  placeholder="Full description shown on the product detail page — materials, dimensions, use case, etc. (defaults to short description if left blank)"
                  className="form-textarea"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="form-label">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="category" name="category"
                    value={form.category} onChange={handleChange}
                    className="form-select" required
                  >
                    <option value="">Select category…</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="estimatedPrice" className="form-label">
                    Estimated Price ($) <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="estimatedPrice" name="estimatedPrice" type="number"
                    min="0.01" step="0.01"
                    value={form.estimatedPrice} onChange={handleChange}
                    placeholder="25.00"
                    className="form-input" required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="image" className="form-label">Image URL</label>
                <input
                  id="image" name="image" type="url"
                  value={form.image} onChange={handleChange}
                  placeholder="https://example.com/product-image.jpg"
                  className="form-input"
                />
              </div>

              <div>
                <label htmlFor="tags" className="form-label">Tags</label>
                <input
                  id="tags" name="tags" type="text"
                  value={form.tags} onChange={handleChange}
                  placeholder="e.g. desk, organizer, cable management (comma-separated)"
                  className="form-input"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-neutral-50 border border-neutral-100 rounded-sm">
                <input
                  id="featured" name="featured" type="checkbox"
                  checked={form.featured} onChange={handleChange}
                  className="w-4 h-4 accent-gold"
                />
                <div>
                  <label htmlFor="featured" className="text-sm font-medium text-neutral-700 cursor-pointer">
                    Mark as Featured
                  </label>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Featured products appear on the homepage and at the top of the catalog.
                  </p>
                </div>
              </div>
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Adding…
              </span>
            ) : "Add to Catalog"}
          </button>
        </form>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
