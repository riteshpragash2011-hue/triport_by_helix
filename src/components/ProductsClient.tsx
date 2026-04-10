"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

interface Props {
  products: Product[];
  categories: string[];
}

export default function ProductsClient({ products, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="border-b border-neutral-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <p className="section-label mb-3">Catalog</p>
          <h1 className="section-heading mb-3">Products</h1>
          <p className="text-neutral-500 max-w-xl text-base">
            All items are fulfilled via request — not instant checkout. Browse,
            choose, and submit a print request.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 text-sm font-medium rounded-sm border transition-colors duration-200 ${
                  activeCategory === cat
                    ? "bg-gold text-white border-gold"
                    : "bg-white text-neutral-600 border-neutral-200 hover:border-gold/50 hover:text-gold"
                }`}
              >
                {cat}
              </button>
            ))}
            {activeCategory !== "All" && (
              <span className="ml-2 text-sm text-neutral-400 self-center">
                {filtered.length} product{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-neutral-400 text-base">
              {products.length === 0
                ? "No products in the catalog yet."
                : "No products in this category yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Custom Request CTA */}
        <div className="mt-16 border border-neutral-100 rounded-sm p-8 bg-neutral-50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-semibold text-neutral-900 text-lg mb-1">
              Don&apos;t see what you need?
            </h3>
            <p className="text-sm text-neutral-500">
              Submit a custom request and describe exactly what you want. Helix
              will evaluate and get back to you.
            </p>
          </div>
          <Link href="/custom-request" className="btn-gold shrink-0">
            Custom Request
          </Link>
        </div>
      </div>
    </div>
  );
}
