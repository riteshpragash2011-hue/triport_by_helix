"use server";

import fs from "fs";
import path from "path";
import { BuyRequest, CustomRequest, ProductSubmission } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const BUY_REQUESTS_FILE = path.join(DATA_DIR, "buy-requests.json");
const CUSTOM_REQUESTS_FILE = path.join(DATA_DIR, "custom-requests.json");
const PRODUCT_SUBMISSIONS_FILE = path.join(DATA_DIR, "product-submissions.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile<T>(filePath: string): T[] {
  ensureDataDir();
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf-8");
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function writeJsonFile<T>(filePath: string, data: T[]): void {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Buy Requests ────────────────────────────────────────────────

export async function submitBuyRequest(
  data: Omit<BuyRequest, "id" | "createdAt">
): Promise<{ success: boolean; message: string }> {
  try {
    const requests = readJsonFile<BuyRequest>(BUY_REQUESTS_FILE);
    const newRequest: BuyRequest = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      status: "pending",
      statusUpdates: [],
    } as BuyRequest & { status: string; statusUpdates: unknown[] };
    requests.push(newRequest);
    writeJsonFile(BUY_REQUESTS_FILE, requests);
    return { success: true, message: "Your request has been submitted successfully. Helix will be in touch shortly." };
  } catch (error) {
    console.error("Failed to save buy request:", error);
    return { success: false, message: "Failed to submit request. Please try again." };
  }
}

export async function getBuyRequests(): Promise<BuyRequest[]> {
  return readJsonFile<BuyRequest>(BUY_REQUESTS_FILE);
}

// ─── Custom Requests ─────────────────────────────────────────────

export async function submitCustomRequest(
  data: Omit<CustomRequest, "id" | "createdAt">
): Promise<{ success: boolean; message: string }> {
  try {
    const requests = readJsonFile<CustomRequest>(CUSTOM_REQUESTS_FILE);
    const newRequest: CustomRequest = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      status: "pending",
      statusUpdates: [],
    } as CustomRequest & { status: string; statusUpdates: unknown[] };
    requests.push(newRequest);
    writeJsonFile(CUSTOM_REQUESTS_FILE, requests);
    return { success: true, message: "Your custom project request has been received. Helix will review and respond within 2 business days." };
  } catch (error) {
    console.error("Failed to save custom request:", error);
    return { success: false, message: "Failed to submit request. Please try again." };
  }
}

export async function getCustomRequests(): Promise<CustomRequest[]> {
  return readJsonFile<CustomRequest>(CUSTOM_REQUESTS_FILE);
}

// ─── Product Submissions ──────────────────────────────────────────

export async function submitProduct(
  data: Omit<ProductSubmission, "id" | "submittedAt">
): Promise<{ success: boolean; message: string }> {
  try {
    const submissions = readJsonFile<ProductSubmission>(PRODUCT_SUBMISSIONS_FILE);
    const newSubmission: ProductSubmission = {
      ...data,
      id: generateId(),
      submittedAt: new Date().toISOString(),
    };
    submissions.push(newSubmission);
    writeJsonFile(PRODUCT_SUBMISSIONS_FILE, submissions);
    return { success: true, message: "Product submitted successfully. It will be reviewed before going live." };
  } catch (error) {
    console.error("Failed to save product submission:", error);
    return { success: false, message: "Failed to submit product. Please try again." };
  }
}
