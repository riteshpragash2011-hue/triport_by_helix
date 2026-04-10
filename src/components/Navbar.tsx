"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function useTransparentLogo(src: string) {
  const [dataUrl, setDataUrl] = useState<string>(src);
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
          const avg = (d[i] + d[i + 1] + d[i + 2]) / 3;
          if (avg > 215) {
            d[i + 3] = Math.max(0, Math.round((1 - (avg - 215) / 40) * d[i + 3]));
          }
        }
        ctx.putImageData(imageData, 0, 0);
        setDataUrl(canvas.toDataURL("image/png"));
      } catch { /* keep original */ }
    };
    img.src = src;
  }, [src]);
  return dataUrl;
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Custom Request", href: "/custom-request" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";
  const logoSrc = useTransparentLogo("/logo.png");

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On home: logo-only at top, full navbar once scrolled.
  // On other pages: always white with full nav.
  const headerClass = isHome
    ? scrolled
      ? "bg-neutral-950/95 backdrop-blur-sm border-b border-white/8"
      : "bg-transparent border-b border-transparent"
    : "bg-white/95 backdrop-blur-sm border-b border-neutral-100";

  const linkActive = (href: string) => pathname === href;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${headerClass}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt="TRIport by Helix"
            width={140}
            height={40}
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Nav — hidden on homepage until scrolled */}
        <ul className={`hidden md:flex items-center gap-8 transition-all duration-500 ${isHome && !scrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  linkActive(link.href)
                    ? "text-gold"
                    : isHome
                    ? "text-white/70 hover:text-white"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA — hidden on homepage until scrolled */}
        <div className={`hidden md:flex items-center gap-4 transition-all duration-500 ${isHome && !scrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <Link
            href="/custom-request"
            className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-gold hover:bg-gold-dark transition-colors duration-200 rounded-sm tracking-wide"
          >
            Request Print
          </Link>
        </div>

        {/* Mobile Hamburger — hidden on homepage until scrolled */}
        <button
          className={`md:hidden p-2 rounded-sm transition-all duration-500 ${
            isHome && !scrolled
              ? "opacity-0 pointer-events-none"
              : isHome
              ? "text-white/80 hover:text-white hover:bg-white/10 opacity-100"
              : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 opacity-100"
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={`block h-0.5 bg-current transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block h-0.5 bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 bg-current transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </div>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96" : "max-h-0"}`}>
        <ul className={`px-4 py-4 flex flex-col gap-1 ${isHome ? "bg-neutral-950 border-t border-white/10" : "bg-white border-t border-neutral-100"}`}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block py-2.5 px-3 text-sm font-medium rounded-sm transition-colors duration-200 ${
                  isHome
                    ? linkActive(link.href)
                      ? "text-gold bg-white/5"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                    : linkActive(link.href)
                    ? "text-gold bg-amber-50"
                    : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <Link
              href="/custom-request"
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 px-3 text-sm font-semibold text-white bg-gold hover:bg-gold-dark transition-colors rounded-sm text-center tracking-wide"
            >
              Request Print
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
