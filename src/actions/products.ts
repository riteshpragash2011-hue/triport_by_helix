"use server";

import { cookies } from "next/headers";
import { verifySessionToken, getSessionHelixId, SESSION_COOKIE } from "@/lib/auth";
import { getAccountById } from "@/lib/accounts";
import { addProduct, deleteProduct, updateProduct, generateUniqueSlug } from "@/lib/products";
import { Product } from "@/types";

async function getActor() {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session?.value || !verifySessionToken(session.value)) return null;
  const id = getSessionHelixId(session.value);
  return id ? getAccountById(id) : null;
}

export async function addProductAction(data: {
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  estimatedPrice: number;
  image: string;
  featured: boolean;
  tags: string[];
}): Promise<{ success: true; product: Product } | { success: false; error: string }> {
  const actor = await getActor();
  if (!actor) return { success: false, error: "Not authenticated." };
  if (!actor.permissions.canAddProducts) return { success: false, error: "You don't have permission to add products." };

  const slug = generateUniqueSlug(data.name);
  const product: Product = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    slug,
    name: data.name,
    shortDescription: data.shortDescription,
    fullDescription: data.fullDescription || data.shortDescription,
    category: data.category,
    estimatedPrice: data.estimatedPrice,
    image: data.image || "",
    featured: data.featured,
    tags: data.tags,
  };

  addProduct(product);
  return { success: true, product };
}

export async function deleteProductAction(
  id: string
): Promise<{ success: true } | { error: string }> {
  const actor = await getActor();
  if (!actor) return { error: "Not authenticated." };
  if (!actor.permissions.canDeleteProducts) return { error: "You don't have permission to delete products." };
  const ok = deleteProduct(id);
  if (!ok) return { error: "Product not found." };
  return { success: true };
}

export async function updateProductAction(
  id: string,
  updates: Partial<Omit<Product, "id" | "slug">>
): Promise<{ success: true } | { error: string }> {
  const actor = await getActor();
  if (!actor) return { error: "Not authenticated." };
  if (!actor.permissions.canManageProducts) return { error: "You don't have permission to edit products." };
  const ok = updateProduct(id, updates);
  if (!ok) return { error: "Product not found." };
  return { success: true };
}
