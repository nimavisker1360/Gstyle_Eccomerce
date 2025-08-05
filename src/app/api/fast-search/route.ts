import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/lib/db/models/product.model";
import { fastProductCache } from "@/lib/services/fast-product-cache.service";

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    
    // پارامترهای جستجو
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // ساخت کلید کش
    const cacheKey = fastProductCache.generateSearchKey(query, {
      category, brand, minPrice, maxPrice, sort, page, limit
    });

    // بررسی کش
    const cachedResult = fastProductCache.get(cacheKey);
    if (cachedResult) {
      console.log(`⚡ Cache hit for search: ${query}`);
      return NextResponse.json({
        ...cachedResult,
        cached: true,
        responseTime: `${Date.now() - startTime}ms`
      });
    }

    // اتصال به دیتابیس
    await connectToDatabase();

    // ساخت شرایط جستجو
    const conditions: any = { isPublished: true };

    // جستجوی متنی
    if (query) {
      conditions.$text = { $search: query };
    }

    // فیلترها
    if (category && category !== "all") {
      conditions.category = category;
    }
    if (brand && brand !== "all") {
      conditions.brand = brand;
    }
    if (minPrice || maxPrice) {
      conditions.price = {};
      if (minPrice) conditions.price.$gte = parseFloat(minPrice);
      if (maxPrice) conditions.price.$lte = parseFloat(maxPrice);
    }

    // مرتب‌سازی
    let sortOption: any = {};
    switch (sort) {
      case "price-asc":
        sortOption = { price: 1 };
        break;
      case "price-desc":
        sortOption = { price: -1 };
        break;
      case "rating":
        sortOption = { avgRating: -1 };
        break;
      case "popular":
        sortOption = { numSales: -1 };
        break;
      case "newest":
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    // اگر جستجوی متنی است، امتیاز متن را اضافه کن
    if (query) {
      sortOption = { score: { $meta: "textScore" }, ...sortOption };
    }

    // محاسبه skip
    const skip = (page - 1) * limit;

    // انتخاب فیلدهای ضروری برای سرعت بیشتر
    const projection = {
      name: 1,
      slug: 1,
      price: 1,
      listPrice: 1,
      images: { $slice: 1 }, // فقط اولین تصویر
      brand: 1,
      category: 1,
      avgRating: 1,
      numReviews: 1,
      numSales: 1,
    };

    // اجرای موازی برای سرعت بیشتر
    const [products, total] = await Promise.all([
      Product.find(conditions, projection)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      Product.countDocuments(conditions).exec()
    ]);

    // آماده‌سازی نتیجه
    const result = {
      products: products.map(product => ({
        ...product,
        image: product.images?.[0] || "",
        discount: product.listPrice > product.price 
          ? Math.round(((product.listPrice - product.price) / product.listPrice) * 100) 
          : 0
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      filters: {
        categories: [], // می‌توان بعداً اضافه کرد
        brands: [],     // می‌توان بعداً اضافه کرد
        priceRange: {
          min: 0,
          max: 0
        }
      }
    };

    // ذخیره در کش (2 دقیقه TTL)
    fastProductCache.set(cacheKey, result, 2 * 60 * 1000);

    const responseTime = Date.now() - startTime;
    console.log(`🔍 Search completed in ${responseTime}ms for query: "${query}"`);

    return NextResponse.json({
      ...result,
      cached: false,
      responseTime: `${responseTime}ms`
    });

  } catch (error) {
    console.error("❌ Fast search API error:", error);
    return NextResponse.json(
      { 
        error: "خطا در جستجوی محصولات", 
        products: [], 
        pagination: { total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false }
      },
      { status: 500 }
    );
  }
}

// API برای دریافت فیلترهای موجود
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const cacheKey = "search:filters";
    const cachedFilters = fastProductCache.get(cacheKey);
    
    if (cachedFilters) {
      return NextResponse.json(cachedFilters);
    }

    // دریافت موازی فیلترها
    const [categories, brands, priceRange] = await Promise.all([
      Product.distinct("category", { isPublished: true }).exec(),
      Product.distinct("brand", { isPublished: true }).exec(),
      Product.aggregate([
        { $match: { isPublished: true } },
        { 
          $group: { 
            _id: null, 
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" }
          } 
        }
      ]).exec()
    ]);

    const filters = {
      categories: categories.sort(),
      brands: brands.sort(),
      priceRange: priceRange[0] || { minPrice: 0, maxPrice: 1000 }
    };

    // کش برای 10 دقیقه
    fastProductCache.set(cacheKey, filters, 10 * 60 * 1000);

    return NextResponse.json(filters);

  } catch (error) {
    console.error("❌ Filters API error:", error);
    return NextResponse.json(
      { categories: [], brands: [], priceRange: { minPrice: 0, maxPrice: 1000 } },
      { status: 500 }
    );
  }
}