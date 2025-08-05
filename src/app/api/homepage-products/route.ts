import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import HomepageProducts from "@/lib/db/models/homepage-products.model";

export async function GET() {
  try {
    await connectToDatabase();
    
    // خواندن آخرین سند از کالکشن homepageproducts
    const homepageData = await HomepageProducts.findOne()
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    
    if (!homepageData) {
      return NextResponse.json({
        success: false,
        message: "هیچ محصولی در کالکشن homepageproducts پیدا نشد",
        products: [],
        total: 0
      });
    }

    // تبدیل محصولات Google Shopping به فرمت مناسب برای نمایش
    const formattedProducts = homepageData.products.map((product, index) => ({
      id: product.id,
      name: product.title,
      slug: `product-${product.id}`,
      price: product.price,
      listPrice: product.originalPrice || product.price,
      image: product.image,
      images: [product.image],
      brand: product.source,
      category: "محصولات عمومی",
      description: product.description,
      avgRating: product.rating,
      numReviews: product.reviews > 1000000 ? Math.floor(product.reviews / 1000000) : product.reviews,
      numSales: product.position * 10, // تخمینی بر اساس موقعیت
      tags: ["new arrival", "google shopping"],
      colors: ["White", "Black"],
      sizes: ["S", "M", "L"],
      countInStock: 100,
      isPublished: true,
      createdAt: homepageData.createdAt,
      updatedAt: homepageData.updatedAt,
      // اضافه کردن فیلدهای مفید برای Google Shopping
      googleShopping: {
        originalTitle: product.originalTitle,
        currency: product.currency,
        source: product.source,
        delivery: product.delivery,
        googleShoppingLink: product.googleShoppingLink,
        position: product.position
      }
    }));

    return NextResponse.json({
      success: true,
      products: formattedProducts,
      total: homepageData.total,
      lastRefresh: homepageData.lastRefresh,
      nextRefresh: homepageData.nextRefresh,
      message: `بارگذاری ${formattedProducts.length} محصول از Google Shopping موفقیت‌آمیز بود`
    });
    
  } catch (error) {
    console.error("خطا در خواندن محصولات homepage:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "خطای ناشناخته",
      products: [],
      total: 0
    });
  }
}