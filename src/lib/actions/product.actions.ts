"use server";

import { connectToDatabase } from "@/lib/db";
import Product, { IProduct } from "@/lib/db/models/product.model";
import { PAGE_SIZE } from "../constants";

// GET ONE PRODUCT BY SLUG
export async function getProductBySlug(slug: string) {
  await connectToDatabase();
  const product = await Product.findOne({ slug, isPublished: true })
    .lean() // بهینه‌سازی: استفاده از lean برای سرعت بیشتر
    .exec(); // بهینه‌سازی: استفاده از exec
  if (!product) throw new Error("Product not found");
  return product as IProduct;
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
  
  // بهینه‌سازی: اجرای موازی count و find
  const [products, productsCount] = await Promise.all([
    Product.find(conditions)
      .sort({ numSales: -1 }) // استفاده از -1 بهجای "desc"
      .skip(skipAmount)
      .limit(limit)
      .lean() // استفاده از lean
      .exec(),
    Product.countDocuments(conditions).exec()
  ]);
  
  return {
    data: products as IProduct[],
    totalPages: Math.ceil(productsCount / limit),
  };
}

export async function getAllCategories() {
  await connectToDatabase();
  const categories = await Product.distinct("category", { isPublished: true }).exec();
  return categories;
}
export async function getProductsForCard({
  tag,
  limit = 4,
}: {
  tag: string;
  limit?: number;
}) {
  await connectToDatabase();
  const products = await Product.find(
    { tags: { $in: [tag] }, isPublished: true },
    {
      name: 1,
      slug: 1,
      images: { $slice: 1 }, // فقط اولین تصویر
    }
  )
    .sort({ createdAt: -1 }) // استفاده از -1
    .limit(limit)
    .lean()
    .exec();
    
  // پردازش در JavaScript بهجای MongoDB aggregation
  return products.map(product => ({
    name: product.name,
    href: `/product/${product.slug}`,
    image: product.images?.[0] || '',
  }));
}

// GET PRODUCTS BY TAG
export async function getProductsByTag({
  tag,
  limit = 10,
}: {
  tag: string;
  limit?: number;
}) {
  await connectToDatabase();
  const products = await Product.find({
    tags: { $in: [tag] },
    isPublished: true,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()
    .exec();
  return products as IProduct[];
}

// GET LATEST DISCOUNTED PRODUCTS FROM EACH BRAND - بهینه شده
export async function getLatestDiscountedProducts(limit = 50) {
  await connectToDatabase();

  // استفاده از aggregation برای سرعت بیشتر
  const products = await Product.aggregate([
    {
      $match: {
        isPublished: true,
        $expr: { $lt: ["$price", "$listPrice"] } // محصولات تخفیف‌دار
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $group: {
        _id: "$brand",
        products: { $push: "$$ROOT" },
        count: { $sum: 1 }
      }
    },
    {
      $unwind: {
        path: "$products",
        includeArrayIndex: "index"
      }
    },
    {
      $match: {
        index: { $lt: Math.ceil(limit / 10) } // حداکثر محصولات در هر برند
      }
    },
    {
      $replaceRoot: { newRoot: "$products" }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $limit: limit
    }
  ]).exec();

  return products as IProduct[];
}
