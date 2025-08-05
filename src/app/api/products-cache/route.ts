import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/lib/db/models/product.model";
import { fastProductCache } from "@/lib/services/fast-product-cache.service";

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    
    // پارامترهای درخواست
    const type = searchParams.get("type") || "featured"; // featured, latest, discounted, popular
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");

    // ساخت کلید کش
    const cacheKey = fastProductCache.generateProductKey({
      category,
      tag: type,
      page,
      limit
    });

    // بررسی کش
    const cachedResult = fastProductCache.get(cacheKey);
    if (cachedResult) {
      console.log(`⚡ Cache hit for products: ${type}`);
      return NextResponse.json({
        ...cachedResult,
        cached: true,
        responseTime: `${Date.now() - startTime}ms`
      });
    }

    await connectToDatabase();

    let products = [];
    let total = 0;

    // انتخاب فیلدهای ضروری
    const projection = {
      name: 1,
      slug: 1,
      price: 1,
      listPrice: 1,
      images: { $slice: 1 },
      brand: 1,
      category: 1,
      avgRating: 1,
      numReviews: 1,
      numSales: 1,
      createdAt: 1
    };

    const skip = (page - 1) * limit;
    let conditions: any = { isPublished: true };
    
    if (category && category !== "all") {
      conditions.category = category;
    }

    switch (type) {
      case "featured":
        // محصولات ویژه (بالاترین امتیاز)
        [products, total] = await Promise.all([
          Product.find(conditions, projection)
            .sort({ avgRating: -1, numReviews: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec(),
          Product.countDocuments(conditions).exec()
        ]);
        break;

      case "latest":
        // جدیدترین محصولات
        [products, total] = await Promise.all([
          Product.find(conditions, projection)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec(),
          Product.countDocuments(conditions).exec()
        ]);
        break;

      case "discounted":
        // محصولات تخفیف‌دار
        conditions.$expr = { $lt: ["$price", "$listPrice"] };
        [products, total] = await Promise.all([
          Product.find(conditions, projection)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec(),
          Product.countDocuments(conditions).exec()
        ]);
        break;

      case "popular":
        // محصولات پرفروش
        [products, total] = await Promise.all([
          Product.find(conditions, projection)
            .sort({ numSales: -1, avgRating: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec(),
          Product.countDocuments(conditions).exec()
        ]);
        break;

      case "top-rated":
        // بالاترین امتیاز
        conditions.avgRating = { $gte: 4 };
        conditions.numReviews = { $gte: 10 };
        [products, total] = await Promise.all([
          Product.find(conditions, projection)
            .sort({ avgRating: -1, numReviews: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec(),
          Product.countDocuments(conditions).exec()
        ]);
        break;

      default:
        // پیش‌فرض: جدیدترین محصولات
        [products, total] = await Promise.all([
          Product.find(conditions, projection)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec(),
          Product.countDocuments(conditions).exec()
        ]);
    }

    // پردازش داده‌ها
    const processedProducts = products.map(product => ({
      ...product,
      image: product.images?.[0] || "",
      discount: product.listPrice > product.price 
        ? Math.round(((product.listPrice - product.price) / product.listPrice) * 100) 
        : 0,
      isNew: new Date(product.createdAt).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000), // آیا 7 روز گذشته اضافه شده
    }));

    const result = {
      products: processedProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      type,
      category: category || "all"
    };

    // ذخیره در کش (3 دقیقه TTL)
    fastProductCache.set(cacheKey, result, 3 * 60 * 1000);

    const responseTime = Date.now() - startTime;
    console.log(`📦 Products ${type} fetched in ${responseTime}ms`);

    return NextResponse.json({
      ...result,
      cached: false,
      responseTime: `${responseTime}ms`
    });

  } catch (error) {
    console.error("❌ Products cache API error:", error);
    return NextResponse.json(
      { 
        error: "خطا در دریافت محصولات", 
        products: [],
        pagination: { total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false }
      },
      { status: 500 }
    );
  }
}

// پاکسازی کش
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key) {
      fastProductCache.delete(key);
      return NextResponse.json({ message: `Cache key "${key}" deleted` });
    } else {
      fastProductCache.clear();
      return NextResponse.json({ message: "All cache cleared" });
    }
  } catch (error) {
    console.error("❌ Cache clear error:", error);
    return NextResponse.json({ error: "خطا در پاکسازی کش" }, { status: 500 });
  }
}

// آمار کش
export async function POST(request: NextRequest) {
  try {
    const stats = fastProductCache.getStats();
    return NextResponse.json({
      ...stats,
      message: "Cache statistics retrieved successfully"
    });
  } catch (error) {
    console.error("❌ Cache stats error:", error);
    return NextResponse.json({ error: "خطا در دریافت آمار کش" }, { status: 500 });
  }
}