"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Interface برای محصول از دیتابیس
interface HomepageProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  listPrice: number;
  image: string;
  brand: string;
  category: string;
  avgRating: number;
  numReviews: number;
  numSales: number;
  googleShopping: {
    originalTitle: string;
    currency: string;
    source: string;
    delivery: string;
    position: number;
  };
}

interface HomepageProductsSliderProps {
  title?: string;
}

export default function HomepageProductsSlider({ 
  title = "محصولات ویژه"
}: HomepageProductsSliderProps) {
  const [products, setProducts] = useState<HomepageProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // تنظیمات نمایش
  const itemsPerView = {
    mobile: 2,
    tablet: 3,
    desktop: 4,
  };

  // خواندن محصولات از دیتابیس
  useEffect(() => {
    const fetchHomepageProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔍 Fetching homepage products from database...");

        const response = await fetch("/api/homepage-products");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.products && Array.isArray(data.products)) {
          // محدود کردن به 20 محصول اول
          const limitedProducts = data.products.slice(0, 20);
          setProducts(limitedProducts);
          console.log(
            `✅ Loaded ${limitedProducts.length} homepage products from database`
          );
        } else {
          console.warn("⚠️ No products found in database response");
          setProducts([]);
        }
      } catch (err) {
        console.error("❌ Error fetching homepage products:", err);
        setError("خطا در بارگذاری محصولات");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageProducts();
  }, []);

  // کنترل اسلایدر
  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev >= products.length - itemsPerView.desktop ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev <= 0 ? Math.max(0, products.length - itemsPerView.desktop) : prev - 1
    );
  };

  // فرمت کردن قیمت
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  // محاسبه تخفیف
  const calculateDiscount = (price: number, listPrice: number) => {
    if (listPrice > price) {
      return Math.round(((listPrice - price) / listPrice) * 100);
    }
    return 0;
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-green-600 text-right">
            {title}
          </h2>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full text-center py-8">
        <div className="text-red-500 mb-4">{error}</div>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="text-green-600 border-green-600 hover:bg-green-50"
        >
          تلاش مجدد
        </Button>
      </div>
    );
  }

  // محصولی وجود ندارد
  if (products.length === 0) {
    return (
      <div className="w-full text-center py-8">
        <div className="text-gray-500 mb-4">محصولی برای نمایش وجود ندارد</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-600 text-right">
          {title}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="w-8 h-8 rounded-full border-green-200 text-green-600 hover:bg-green-50"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="w-8 h-8 rounded-full border-green-200 text-green-600 hover:bg-green-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* محصولات */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out gap-4"
          style={{
            transform: `translateX(${currentIndex * (100 / itemsPerView.desktop)}%)`,
          }}
        >
          {products.map((product) => {
            const discount = calculateDiscount(product.price, product.listPrice);
            
            return (
              <div
                key={product.id}
                className="flex-none w-1/2 md:w-1/3 lg:w-1/4"
              >
                <Card className="group hover:shadow-lg transition-all duration-300 border-green-100 hover:border-green-300">
                  <CardContent className="p-0">
                    {/* تصویر محصول */}
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                      
                      {/* نشان تخفیف */}
                      {discount > 0 && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                          {discount}% تخفیف
                        </Badge>
                      )}

                      {/* برند */}
                      <Badge className="absolute top-2 right-2 bg-green-500 text-white text-xs">
                        {product.brand}
                      </Badge>
                    </div>

                    {/* اطلاعات محصول */}
                    <div className="p-4">
                      {/* نام محصول */}
                      <h3 className="font-medium text-gray-900 text-right text-sm mb-2 line-clamp-2 h-10">
                        {product.name}
                      </h3>

                      {/* امتیاز و نظرات */}
                      <div className="flex items-center justify-end gap-1 mb-2">
                        <span className="text-xs text-gray-500">
                          ({product.numReviews})
                        </span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(product.avgRating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* قیمت */}
                      <div className="flex flex-col items-end mb-3">
                        <div className="text-lg font-bold text-green-600">
                          {formatPrice(product.price)} تومان
                        </div>
                        {discount > 0 && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatPrice(product.listPrice)} تومان
                          </div>
                        )}
                      </div>

                      {/* دکمه خرید */}
                      <Link
                        href={`/product/${product.slug}`}
                        className="w-full"
                      >
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          size="sm"
                        >
                          <ShoppingCart className="w-4 h-4 ml-2" />
                          مشاهده محصول
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* لینک مشاهده همه */}
      <div className="text-center mt-6">
        <Link
          href="/search?view=all"
          className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
        >
          مشاهده همه محصولات
          <ChevronLeft className="w-4 h-4 mr-1" />
        </Link>
      </div>
    </div>
  );
}