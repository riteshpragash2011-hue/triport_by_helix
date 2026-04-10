export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  estimatedPrice: number;
  image: string;
  featured: boolean;
  tags: string[];
}

export interface BuyRequest {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  email: string;
  phone?: string;
  quantity: number;
  notes?: string;
  createdAt: string;
}

export interface CustomRequest {
  id: string;
  customerName: string;
  email: string;
  phone?: string;
  projectTitle: string;
  description: string;
  intendedUse: string;
  size: string;
  material?: string;
  timeline: string;
  budget: string;
  createdAt: string;
}

export interface ProductSubmission {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedPrice: number;
  imageUrl: string;
  featured: boolean;
  submittedAt: string;
}
