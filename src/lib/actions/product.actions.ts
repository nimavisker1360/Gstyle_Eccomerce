"use server";

import { connectToDatabase } from "@/lib/db";
import Product, { IProduct } from "@/lib/db/models/product.model";
import { PAGE_SIZE } from "../constants";
import data from "@/lib/data";
import { toSlug } from "@/lib/utils";

// GET ONE PRODUCT BY SLUG
export async function getProductBySlug(slug: string) {
  const db = await connectToDatabase();
  
  if (!db) {
    // Fallback to static data
    const product = data.products.find(p => p.slug === slug && p.isPublished);
    if (!product) throw new Error("Product not found");
    return product as IProduct;
  }
  
  const product = await Product.findOne({ slug, isPublished: true });
  if (!product) throw new Error("Product not found");
  return JSON.parse(JSON.stringify(product)) as IProduct;
}

// GET RELATED PRODUCTS: PRODUCTS WITH SAME CATEGORY
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
  await connectToDatabase();
  const skipAmount = (Number(page) - 1) * limit;
  const conditions = {
    isPublished: true,
    category,
    _id: { $ne: productId },
  };
  const products = await Product.find(conditions)
    .sort({ numSales: "desc" })
    .skip(skipAmount)
    .limit(limit);
  const productsCount = await Product.countDocuments(conditions);
  return {
    data: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(productsCount / limit),
  };
}

export async function getAllCategories() {
  const db = await connectToDatabase();
  
  if (!db) {
    // Fallback to static data
    const categories = [...new Set(data.products.filter(p => p.isPublished).map(p => p.category))];
    return categories;
  }
  
  const categories = await Product.find({ isPublished: true }).distinct(
    "category"
  );
  return categories;
}
export async function getProductsForCard({
  tag,
  limit = 4,
}: {
  tag: string;
  limit?: number;
}) {
  const db = await connectToDatabase();
  
  if (!db) {
    // Fallback to static data
    const products = data.products
      .filter(p => p.tags.includes(tag) && p.isPublished)
      .slice(0, limit)
      .map(p => ({
        name: p.name,
        href: `/product/${p.slug}`,
        image: p.images[0],
      }));
    return products;
  }
  
  const products = await Product.find(
    { tags: { $in: [tag] }, isPublished: true },
    {
      name: 1,
      href: { $concat: ["/product/", "$slug"] },
      image: { $arrayElemAt: ["$images", 0] },
    }
  )
    .sort({ createdAt: "desc" })
    .limit(limit);
  return JSON.parse(JSON.stringify(products)) as {
    name: string;
    href: string;
    image: string;
  }[];
}

// GET PRODUCTS BY TAG
export async function getProductsByTag({
  tag,
  limit = 10,
}: {
  tag: string;
  limit?: number;
}) {
  const db = await connectToDatabase();
  
  if (!db) {
    // Fallback to static data
    const products = data.products
      .filter(p => p.tags.includes(tag) && p.isPublished)
      .slice(0, limit);
    return products as IProduct[];
  }
  
  const products = await Product.find({
    tags: { $in: [tag] },
    isPublished: true,
  })
    .sort({ createdAt: "desc" })
    .limit(limit);
  return JSON.parse(JSON.stringify(products)) as IProduct[];
}
