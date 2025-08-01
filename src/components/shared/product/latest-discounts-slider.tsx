"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

// Carousel imports removed - now using static grid
import { Button } from "@/components/ui/button";
import DiscountProductCard from "./discount-product-card";

interface ShoppingProduct {
  id: string;
  title: string;
  originalTitle?: string;
  price: number;
  originalPrice?: number | null;
  currency: string;
  image: string;
  description: string;
  originalDescription?: string;
  link?: string;
  googleShoppingLink?: string;
  source: string;
  rating: number;
  reviews: number;
  delivery: string;
}

interface LatestDiscountsSliderProps {
  // No props needed - will fetch data internally
}

export default function LatestDiscountsSlider({}: LatestDiscountsSliderProps) {
  const [products, setProducts] = useState<ShoppingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch discount products from Google Shopping
  useEffect(() => {
    const fetchDiscountProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔍 Fetching discount products from Google Shopping...");

        const response = await fetch("/api/shopping/discounts");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
          console.log(`✅ Loaded ${data.products.length} discount products`);
        } else {
          console.warn("⚠️ No products found in response");
          setProducts([]);
        }
      } catch (err) {
        console.error("❌ Error fetching discount products:", err);
        setError("خطا در بارگذاری محصولات تخفیف‌دار");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountProducts();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="w-full bg-white">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl text-green-600 text-left hidden">
            آخرین تخفیف‌ها
          </h2>
        </div>

        {/* Beautiful Loading Animation */}
        <div className="flex flex-col items-center justify-center py-8 mb-6">
          <div className="relative">
            {/* Main loading spinner */}
            <div className="w-12 h-12 border-4 border-green-100 border-t-4 border-t-green-500 rounded-full animate-spin"></div>

            {/* Inner spinner */}
            <div
              className="absolute top-1.5 left-1.5 w-9 h-9 border-4 border-blue-100 border-t-4 border-t-blue-500 rounded-full animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>

          {/* Loading text with typewriter effect */}
          <div className="mt-4 text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              جستجوی بهترین تخفیف‌ها...
            </h3>
            <div className="flex justify-center items-center space-x-1 rtl:space-x-reverse">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></div>
              <div
                className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            {/* <p className="text-xs text-gray-500 mt-2">
              از گوگل شاپینگ در حال پیدا کردن قیمت‌های عالی...
            </p> */}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full bg-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 text-right">
            آخرین تخفیف‌ها
          </h2>
        </div>
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            تلاش مجدد
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="w-full bg-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 text-right">
            آخرین تخفیف‌ها
          </h2>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">هیچ محصول تخفیف‌داری یافت نشد</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-green-600 text-right">آخرین تخفیف‌ها</h2>
        <Link href="/search?discount=true">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-50"
          >
            بیشتر ببینید
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Static Grid (6 products only) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {products.slice(0, 6).map((product, index) => (
          <div key={`${product.id}-${index}`}>
            <DiscountProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Products count indicator */}
      <div className="mt-4 text-center">
        <span className="text-xs text-gray-500">
          {Math.min(6, products.length)} محصول از {products.length} محصول
          تخفیف‌دار
        </span>
      </div>
    </div>
  );
}
