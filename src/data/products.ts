import { Product } from "@/types";

export const products: Product[] = [];

export const categories = [
  "All",
  "Desk Accessories",
  "Mechanical Parts",
  "Models & Decor",
  "Workshop Tools",
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "All") return products;
  return products.filter((p) => p.category === category);
}
