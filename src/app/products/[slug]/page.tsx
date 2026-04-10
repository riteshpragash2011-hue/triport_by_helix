import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import ProductDetailClient from "@/components/ProductDetailClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.shortDescription} — Request this precision 3D-printed part from Helix via TRIport.`,
    openGraph: {
      title: `${product.name} | TRIport by Helix`,
      description: product.shortDescription,
      images: product.image ? [{ url: product.image }] : [],
    },
  };
}

export default function ProductDetailPage({ params }: PageProps) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();
  return <ProductDetailClient product={product!} />;
}
