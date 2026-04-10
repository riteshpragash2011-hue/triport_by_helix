"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { submitBuyRequest } from "@/actions/requests";
import Toast from "@/components/Toast";

interface Props {
  product: Product;
}

interface FormState {
  customerName: string;
  email: string;
  phone: string;
  quantity: string;
  notes: string;
}

const initialForm: FormState = {
  customerName: "",
  email: "",
  phone: "",
  quantity: "1",
  notes: "",
};

export default function ProductDetailClient({ product }: Props) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.customerName.trim() || !form.email.trim()) {
      setToast({ message: "Name and email are required.", type: "error" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setToast({
        message: "Please enter a valid email address.",
        type: "error",
      });
      return;
    }

    const qty = parseInt(form.quantity, 10);
    if (isNaN(qty) || qty < 1) {
      setToast({ message: "Quantity must be at least 1.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const result = await submitBuyRequest({
        productId: product.id,
        productName: product.name,
        customerName: form.customerName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        quantity: qty,
        notes: form.notes.trim() || undefined,
      });

      setToast({
        message: result.message,
        type: result.success ? "success" : "error",
      });
      if (result.success) {
        setForm(initialForm);
      }
    } catch {
      setToast({
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-neutral-400">
          <Link href="/" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/products"
            className="hover:text-neutral-900 transition-colors"
          >
            Products
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-neutral-600 truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left – Image & Details */}
          <div>
            <div className="relative aspect-[4/3] bg-neutral-50 rounded-sm overflow-hidden mb-6">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase bg-white/90 text-gold border border-gold/30 rounded-sm">
                  {product.category}
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-5">
              <div>
                <span className="text-xs text-neutral-400 uppercase tracking-wider">
                  Estimated price from
                </span>
                <div className="text-2xl font-bold text-neutral-900">
                  ${product.estimatedPrice}
                </div>
              </div>
            </div>

            {/* Request notice */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-gold/20 rounded-sm mb-6">
              <svg
                className="w-5 h-5 text-gold shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-amber-800 leading-relaxed">
                <strong>This product is fulfilled via request</strong> — not
                instant checkout. After you submit, Helix will review your
                request and confirm timeline and final pricing.
              </p>
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed mb-5">
              {product.fullDescription}
            </p>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs bg-neutral-100 text-neutral-500 rounded-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right – Request Form */}
          <div>
            <div className="border border-neutral-100 rounded-sm p-7 sticky top-24">
              <h2 className="font-bold text-xl text-neutral-900 mb-1">
                Request This Print
              </h2>
              <p className="text-sm text-neutral-500 mb-6">
                Fill in the form below and Helix will review your request.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="customerName" className="form-label">
                      Your Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="customerName"
                      name="customerName"
                      type="text"
                      value={form.customerName}
                      onChange={handleChange}
                      placeholder="Jane Smith"
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="form-label">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="form-label">
                      Phone (optional)
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 555 000 0000"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="quantity" className="form-label">
                      Quantity <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      max="1000"
                      value={form.quantity}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="form-label">
                    Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Color preferences, dimensions, intended use, deadline, etc."
                    className="form-textarea"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-gold py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="w-4 h-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Print Request"
                  )}
                </button>

                <p className="text-xs text-neutral-400 text-center">
                  No payment required now. Helix will confirm before any
                  commitment.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
