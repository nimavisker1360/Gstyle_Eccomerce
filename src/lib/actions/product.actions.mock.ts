"use server";

import data from "@/lib/data";
import { IProduct } from "@/lib/db/models/product.model";
import { PAGE_SIZE } from "../constants";

// Mock functions that use sample data instead of database

export async function getProductBySlug(slug: string) {
  const product = data.products.find((p: any) => p.slug === slug && p.isPublished);
  if (!product) throw new Error("Product not found");
  return product as IProduct;
}

export async function getRelatedProductsByCategory({
  category,
  productId,
  limit = PAGE_SIZE,
  page = 1,
}: {
  category: string;
  productId: string;
  limit?: number;
  page: number;
}) {
  const skipAmount = (Number(page) - 1) * limit;
  const filteredProducts = data.products.filter((p: any) => 
    p.isPublished && p.category === category && p._id !== productId
  );
  
  const products = filteredProducts
    .sort((a: any, b: any) => (b.numSales || 0) - (a.numSales || 0))
    .slice(skipAmount, skipAmount + limit);
    
  return {
    data: products as IProduct[],
    totalPages: Math.ceil(filteredProducts.length / limit),
  };
}

export async function getAllCategories() {
  const categories = [...new Set(data.products
    .filter((p: any) => p.isPublished)
    .map((p: any) => p.category))];
  return categories;
}

export async function getProductsForCard({
  tag,
  limit = 4,
}: {
  tag: string;
  limit?: number;
}) {
  const products = data.products
    .filter((p: any) => p.isPublished && p.tags?.includes(tag))
    .slice(0, limit);
  return products as IProduct[];
}

export async function getProductsByTag({ tag }: { tag: string }) {
  const products = data.products.filter((p: any) => 
    p.isPublished && p.tags?.includes(tag)
  );
  return products as IProduct[];
}

export async function getLatestProducts() {
  const products = data.products
    .filter((p: any) => p.isPublished)
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);
  return products as IProduct[];
}

export async function getFeaturedProducts() {
  const products = data.products
    .filter((p: any) => p.isPublished && p.isFeatured)
    .slice(0, 4);
  return products as IProduct[];
}