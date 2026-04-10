import type { Metadata } from "next";
import Link from "next/link";
import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import HomeBackground from "@/components/HomeBackground";
import HeroContent from "@/components/HeroContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "TRIport by Helix — Manufacturing. On Request.",
  description:
    "Browse precision 3D-printed products and submit print requests. Reviewed and fulfilled by Helix members. Not an e-commerce checkout — a manufacturing request platform.",
};

const steps = [
  {
    number: "01",
    title: "Browse or Describe",
    description:
      "Explore our catalog of 3D-printable products, or describe a custom part you need from scratch.",
  },
  {
    number: "02",
    title: "Submit a Request",
    description:
      "Fill out a short form with your specifications — quantity, material preferences, and any special requirements.",
  },
  {
    number: "03",
    title: "Helix Manufactures",
    description:
      "A Helix member reviews your request, confirms feasibility, and prints your part to specification.",
  },
];

const stats = [
  { label: "100% Request-Based", sub: "No instant checkout" },
  { label: "3D Printed On Demand", sub: "No inventory held" },
  { label: "Helix Manufactured", sub: "Reviewed by members" },
];

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative bg-neutral-950 overflow-hidden">
        {/* Animated particle background */}
        <HomeBackground />

        {/* Subtle gold grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
          aria-hidden="true"
        />

        <div className="relative flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
          <HeroContent />
        </div>

        {/* Gold accent bar */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" aria-hidden="true" />
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────── */}
      <section className="bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0 sm:divide-x sm:divide-neutral-800">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center sm:px-8">
                <div className="text-white font-bold text-sm tracking-wider uppercase">
                  {stat.label}
                </div>
                <div className="text-neutral-500 text-xs mt-1 tracking-wide">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────── */}
      <section className="bg-neutral-900 py-20 sm:py-28 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-label mb-3">Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">How TRIport Works</h2>
            <p className="mt-4 text-neutral-400 max-w-xl mx-auto text-base">
              Three simple steps from idea to finished part.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {index < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-6 left-[calc(100%-0px)] w-full h-px bg-gradient-to-r from-gold/25 to-transparent z-0"
                    aria-hidden="true"
                  />
                )}
                <div className="relative bg-neutral-800/60 border border-neutral-700 rounded-sm p-7 hover:border-gold/40 hover:bg-neutral-800 transition-all duration-300">
                  <div className="text-gold font-bold text-3xl mb-4 font-mono">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-white text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────── */}
      <section className="bg-neutral-50 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="section-label mb-3">Catalog</p>
              <h2 className="section-heading">Featured Products</h2>
            </div>
            <Link
              href="/products"
              className="text-sm font-medium text-gold hover:text-gold-dark transition-colors flex items-center gap-1.5 group"
            >
              View all products
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/custom-request" className="btn-outline">
              Need something not listed? Request a custom print
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="bg-neutral-950 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-label mb-4">
            Start Your Request
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-5">
            Have something specific in mind?
          </h2>
          <p className="text-neutral-400 text-base mb-8 max-w-lg mx-auto">
            Tell us about your project. Helix will review your requirements and come back with timeline and pricing.
          </p>
          <Link
            href="/custom-request"
            className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-neutral-950 bg-gold hover:bg-gold-light transition-colors duration-200 rounded-sm tracking-wide"
          >
            Submit Custom Request
          </Link>
        </div>
      </section>
    </div>
  );
}
