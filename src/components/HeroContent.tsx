"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HeroContent() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    function onScroll() {
      if (window.scrollY > 60) setRevealed(true);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="max-w-3xl text-center">
      <p className="section-label mb-5">Helix Manufacturing Platform</p>

      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-6">
        Manufacturing.
        <br />
        <span className="text-gold">On Request.</span>
      </h1>

      {/* Description, buttons, trust signal — hidden until scroll */}
      <div
        className="transition-all duration-700 ease-out"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(20px)",
          pointerEvents: revealed ? "auto" : "none",
        }}
      >
        <p className="text-lg sm:text-xl text-neutral-400 leading-relaxed mb-10 max-w-2xl mx-auto">
          TRIport connects you with Helix — a distributed network of 3D printing specialists. Browse our catalog or describe exactly what you need. We review, manufacture, and deliver.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" className="btn-gold text-base px-8 py-3.5">
            Browse Products
          </Link>
          <Link
            href="/custom-request"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white border border-white/20 hover:border-gold hover:text-gold transition-colors duration-200 rounded-sm tracking-wide"
          >
            Request Custom Print
          </Link>
        </div>

        <p className="mt-8 text-sm text-neutral-500 flex items-center justify-center gap-2">
          <span className="w-4 h-0.5 bg-gold inline-block" aria-hidden="true" />
          This is not an e-commerce checkout — all items are fulfilled via request
        </p>
      </div>
    </div>
  );
}
