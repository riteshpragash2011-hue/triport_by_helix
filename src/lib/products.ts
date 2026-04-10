import fs from "fs";
import path from "path";
import { Product } from "@/types";

const PRODUCTS_FILE = path.join(process.cwd(), "data", "products.json");

function read(): Product[] {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) return [];
    return JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8")) as Product[];
  } catch {
    return [];
  }
}

function save(products: Product[]) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

export function getProducts(): Product[] {
  return read();
}

export function getProductBySlug(slug: string): Product | undefined {
  return read().find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return read().filter((p) => p.featured);
}

export function getProductCategories(): string[] {
  const cats = Array.from(new Set(read().map((p) => p.category)));
  return ["All", ...cats];
}

export function addProduct(product: Product): void {
  const products = read();
  products.push(product);
  save(products);
}

export function deleteProduct(id: string): boolean {
  const products = read();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  products.splice(idx, 1);
  save(products);
  return true;
}

export function updateProduct(id: string, updates: Partial<Product>): boolean {
  const products = read();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  products[idx] = { ...products[idx], ...updates };
  save(products);
  return true;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function generateUniqueSlug(name: string): string {
  const base = slugify(name);
  const existing = read().map((p) => p.slug);
  if (!existing.includes(base)) return base;
  let i = 2;
  while (existing.includes(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}
