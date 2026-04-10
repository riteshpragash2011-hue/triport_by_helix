import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import ProductsManager from "./ProductsManager";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin — Manage Products" };

export default function ManageProductsPage() {
  const products = getProducts();
  return <ProductsManager initialProducts={products} />;
}
