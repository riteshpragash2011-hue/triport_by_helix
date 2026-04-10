import type { Metadata } from "next";
import ProductsClient from "@/components/ProductsClient";
import { getProducts, getProductCategories } from "@/lib/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse TRIport's catalog of precision 3D-printed products. Desk accessories, mechanical parts, architectural models, and more — all fulfilled via request by Helix members.",
};

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  const products = getProducts();
  const categories = getProductCategories();
  return <ProductsClient products={products} categories={categories} />;
}
