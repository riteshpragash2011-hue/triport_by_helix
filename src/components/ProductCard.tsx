import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group bg-white border border-neutral-100 rounded-sm overflow-hidden hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-neutral-50 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase bg-white/90 backdrop-blur-sm text-gold border border-gold/30 rounded-sm">
            {product.category}
          </span>
        </div>
        {product.featured && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase bg-gold text-white rounded-sm">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-neutral-900 text-base mb-1.5 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-neutral-500 leading-relaxed mb-4 line-clamp-2">
          {product.shortDescription}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 uppercase tracking-wider">
              Est. from
            </span>
            <div className="text-lg font-bold text-neutral-900">
              ${product.estimatedPrice}
            </div>
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-gold hover:bg-gold-dark transition-colors duration-200 rounded-sm tracking-wide"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
