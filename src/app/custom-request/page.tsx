"use client";

import { useState } from "react";
import { submitCustomRequest } from "@/actions/requests";
import Toast from "@/components/Toast";

interface FormState {
  customerName: string;
  email: string;
  phone: string;
  projectTitle: string;
  description: string;
  intendedUse: string;
  size: string;
  material: string;
  timeline: string;
  budget: string;
}

const initialForm: FormState = {
  customerName: "",
  email: "",
  phone: "",
  projectTitle: "",
  description: "",
  intendedUse: "",
  size: "",
  material: "",
  timeline: "",
  budget: "",
};

const timelineOptions = [
  "No rush — 4+ weeks",
  "Standard — 2–4 weeks",
  "Expedited — 1–2 weeks",
  "Urgent — under 1 week",
];

const budgetOptions = [
  "Under $50",
  "$50 – $150",
  "$150 – $500",
  "$500 – $1,500",
  "$1,500+",
  "Not sure yet",
];

const materialOptions = [
  "Not sure — advise me",
  "PLA",
  "ABS",
  "PETG",
  "TPU",
  "PA",
  "PA-CF",
  "PLA-CF",
  "PET",
  "ASA",
  "PPA-CF",
  "HIPS",
];

export default function CustomRequestPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

  function validate(): string | null {
    if (!form.customerName.trim()) return "Name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Enter a valid email.";
    if (!form.projectTitle.trim()) return "Project title is required.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.intendedUse.trim()) return "Intended use is required.";
    if (!form.size.trim()) return "Approximate size is required.";
    const dims = form.size.match(/\d+(?:\.\d+)?/g);
    if (dims && dims.some((d) => parseFloat(d) > 350))
      return "Part dimensions cannot exceed 350mm × 350mm × 350mm — our maximum build volume.";
    if (!form.timeline) return "Please select a timeline.";
    if (!form.budget) return "Please select a budget range.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const error = validate();
    if (error) {
      setToast({ message: error, type: "error" });
      return;
    }

    setLoading(true);
    try {
      const result = await submitCustomRequest({
        customerName: form.customerName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        projectTitle: form.projectTitle.trim(),
        description: form.description.trim(),
        intendedUse: form.intendedUse.trim(),
        size: form.size.trim(),
        material: form.material || undefined,
        timeline: form.timeline,
        budget: form.budget,
      });

      if (result.success) {
        setSubmitted(true);
        setToast({ message: result.message, type: "success" });
      } else {
        setToast({ message: result.message, type: "error" });
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-lg mx-auto py-20">
          <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-gold"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-3">
            Request Received
          </h1>
          <p className="text-neutral-500 text-base leading-relaxed mb-8">
            Thank you — your custom project request has been submitted. A Helix member will review your requirements and respond within 2 business days.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setSubmitted(false);
                setForm(initialForm);
              }}
              className="btn-outline"
            >
              Submit Another Request
            </button>
            <a href="/products" className="btn-gold">
              Browse Products
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="border-b border-neutral-100 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <p className="section-label mb-3">Custom Manufacturing</p>
          <h1 className="section-heading mb-3">Request a Custom Print</h1>
          <p className="text-neutral-500 max-w-xl text-base leading-relaxed">
            Describe your project in detail. Helix will review your request, assess feasibility, and respond with a timeline and pricing estimate — no commitment until you confirm.
          </p>
        </div>
      </div>

      {/* Process note */}
      <div className="bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row gap-6 text-sm text-neutral-500">
            {[
              { num: "1", text: "Submit this form" },
              { num: "2", text: "Helix reviews (within 2 business days)" },
              { num: "3", text: "You receive a quote & timeline" },
              { num: "4", text: "Confirm to proceed" },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gold text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  {s.num}
                </span>
                <span>{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Contact */}
          <fieldset>
            <legend className="text-base font-semibold text-neutral-900 mb-4 pb-2 border-b border-neutral-100 w-full">
              Contact Information
            </legend>
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
            </div>
          </fieldset>

          {/* Project */}
          <fieldset>
            <legend className="text-base font-semibold text-neutral-900 mb-4 pb-2 border-b border-neutral-100 w-full">
              Project Details
            </legend>
            <div className="space-y-4">
              <div>
                <label htmlFor="projectTitle" className="form-label">
                  Project Title <span className="text-red-400">*</span>
                </label>
                <input
                  id="projectTitle"
                  name="projectTitle"
                  type="text"
                  value={form.projectTitle}
                  onChange={handleChange}
                  placeholder="e.g. Custom enclosure for Raspberry Pi 5 with ventilation"
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="form-label">
                  Full Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe the part or object in detail. Include functional requirements, mating parts, tolerances, aesthetic preferences, or anything else that matters."
                  className="form-textarea"
                  required
                />
              </div>
              <div>
                <label htmlFor="intendedUse" className="form-label">
                  Intended Use <span className="text-red-400">*</span>
                </label>
                <input
                  id="intendedUse"
                  name="intendedUse"
                  type="text"
                  value={form.intendedUse}
                  onChange={handleChange}
                  placeholder="e.g. Structural bracket in outdoor environment, decorative display, mechanical prototype"
                  className="form-input"
                  required
                />
              </div>
            </div>
          </fieldset>

          {/* Specs */}
          <fieldset>
            <legend className="text-base font-semibold text-neutral-900 mb-4 pb-2 border-b border-neutral-100 w-full">
              Specifications
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="size" className="form-label">
                  Approximate Size <span className="text-red-400">*</span>
                </label>
                <input
                  id="size"
                  name="size"
                  type="text"
                  value={form.size}
                  onChange={handleChange}
                  placeholder="e.g. 150mm × 80mm × 40mm (max 350mm per dimension)"
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label htmlFor="material" className="form-label">
                  Preferred Material
                </label>
                <select
                  id="material"
                  name="material"
                  value={form.material}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select material...</option>
                  {materialOptions.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="timeline" className="form-label">
                  Timeline <span className="text-red-400">*</span>
                </label>
                <select
                  id="timeline"
                  name="timeline"
                  value={form.timeline}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select timeline...</option>
                  {timelineOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="budget" className="form-label">
                  Budget Range <span className="text-red-400">*</span>
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select budget...</option>
                  {budgetOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed"
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
                  Submitting Request...
                </span>
              ) : (
                "Submit Custom Request"
              )}
            </button>
            <p className="text-xs text-neutral-400 text-center mt-3">
              No payment or commitment required. Helix will review and respond with a quote.
            </p>
          </div>
        </form>
      </div>

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
