import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink, MessageCircle, ShoppingCart } from "lucide-react";

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

interface ShoppingProductCardProps {
  product: ShoppingProduct;
  telegramSupport?: string;
}

export default function ShoppingProductCard({
  product,
  telegramSupport,
}: ShoppingProductCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star
            key={i}
            className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50"
          />
        );
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  const formatPrice = (price: number, currency: string) => {
    if (currency === "TRY") {
      return `₺${price.toFixed(2)}`;
    }
    return `${price.toFixed(2)} ${currency}`;
  };

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100
      )
    : 0;

  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        {/* تصویر محصول */}
        <div className="relative mb-4">
          <Image
            src={product.image || "/images/placeholder.jpg"}
            alt={product.title}
            width={300}
            height={300}
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/placeholder.jpg";
            }}
          />
          {hasDiscount && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white">
              {discountPercentage}% تخفیف
            </Badge>
          )}
        </div>

        {/* نام فروشگاه */}
        <p className="text-xs text-gray-600 mb-2 font-medium">
          {product.source}
        </p>

        {/* عنوان محصول */}
        <h3 className="font-semibold text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.title}
        </h3>

        {/* امتیاز و تعداد نظرات */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex">{renderStars(product.rating)}</div>
          <span className="text-sm text-gray-600">({product.reviews})</span>
        </div>

        {/* قیمت */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-green-700">
              {formatPrice(product.price, product.currency)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice!, product.currency)}
              </span>
            )}
          </div>
          {/* نام فروشگاه در کنار قیمت */}
          <p className="text-xs text-blue-600 font-medium">
            📍 {product.source}
          </p>
        </div>

        {/* توضیحات */}
        <p className="text-xs text-gray-700 mb-4 line-clamp-3 min-h-[3rem]">
          {product.description}
        </p>

        {/* ارسال */}
        <p className="text-xs text-green-600 mb-4">📦 {product.delivery}</p>

        {/* دکمه‌ها */}
        <div className="flex flex-col gap-2">
          {/* دکمه اصلی - همیشه به فروشگاه اصلی */}
          {product.link ? (
            <Button
              asChild
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              <Link
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                {`خرید از ${product.source}`}
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              className="w-full bg-gray-500 hover:bg-gray-600 text-white"
              size="sm"
              disabled
            >
              <span className="flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                لینک فروشگاه موجود نیست
              </span>
            </Button>
          )}

          {/* دکمه‌های ثانویه */}
          <div className="grid grid-cols-2 gap-2">
            {/* دکمه مقایسه قیمت - فقط اگر لینک گوگل موجود باشد */}
            {product.googleShoppingLink && (
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link
                  href={product.googleShoppingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  مقایسه قیمت
                </Link>
              </Button>
            )}

            {/* دکمه تلگرام */}
            {telegramSupport && (
              <Button
                asChild
                variant="secondary"
                className={`w-full ${
                  product.googleShoppingLink ? "" : "col-span-2"
                }`}
                size="sm"
              >
                <Link
                  href={`https://t.me/${telegramSupport.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1"
                >
                  <MessageCircle className="w-3 h-3" />
                  پشتیبانی
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
