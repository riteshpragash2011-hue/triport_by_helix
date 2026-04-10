import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-100 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-3">
            <div>
              <Image
                src="/logo.png"
                alt="TRIport by Helix"
                width={140}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
              A request-based distributed manufacturing platform. 3D printing on demand, reviewed and fulfilled by Helix members.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Browse Products", href: "/products" },
                { label: "Custom Request", href: "/custom-request" },
                { label: "About TRIport", href: "/about" },
                { label: "FAQ", href: "/faq" },
                { label: "Admin Portal", href: "/admin" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Process */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
              How It Works
            </h4>
            <ol className="space-y-2.5">
              {[
                "Browse or describe your item",
                "Submit a print request",
                "Helix reviews and confirms",
                "Your part is manufactured",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-500">
                  <span className="text-gold font-bold shrink-0">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-neutral-400">
          <span>
            &copy; {new Date().getFullYear()} Helix Manufacturing. All rights reserved.
          </span>
          <span className="tracking-wide uppercase">
            TRIport — Request-Based 3D Print Platform
          </span>
        </div>
      </div>
    </footer>
  );
}
