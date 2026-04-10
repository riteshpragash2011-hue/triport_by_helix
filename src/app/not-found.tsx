import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="text-gold text-7xl font-bold mb-4 opacity-30">404</div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-3">
          Page not found
        </h1>
        <p className="text-neutral-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-gold">
            Back to Home
          </Link>
          <Link href="/products" className="btn-outline">
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
