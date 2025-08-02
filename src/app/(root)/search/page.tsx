import { Suspense } from "react";
import ShoppingProductsGrid from "@/components/shared/product/shopping-products-grid";
import { HomeBanner } from "@/components/shared/home/home-banner";
import DiscountProductsGrid from "@/components/shared/product/discount-products-grid";

interface SearchPageProps {
  searchParams: {
    q?: string;
    discount?: string;
  };
}

function SearchResultsContent({ query }: { query: string }) {
  const telegramSupport = process.env.TELEGRAM_SUPPORT || "@gstyle_support";

  return (
    <div className="max-w-7xl mx-auto px-6">
      <ShoppingProductsGrid
        telegramSupport={telegramSupport}
        initialQuery={query}
        hideSearchBar={true}
      />
    </div>
  );
}

function DiscountProductsContent({ searchQuery }: { searchQuery?: string }) {
  const telegramSupport = process.env.TELEGRAM_SUPPORT || "@gstyle_support";

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Discounts Section - Always visible and fixed */}
      <div className="mb-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 text-right mb-2">
            آخرین تخفیف‌ها
          </h1>
          <p className="text-gray-600 text-right">
            تمامی محصولات با تخفیف ویژه از گوگل شاپینگ
          </p>
        </div>

        {/* Use the separate client component for full page grid */}
        <DiscountProductsGrid />
      </div>

      {/* Product Search Section - Below discounts */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 text-right mb-2">
              جستجوی محصولات
            </h2>
            <p className="text-gray-600 text-right">
              جستجو و کاوش هزاران محصول از فروشگاه‌های معتبر ترکیه
            </p>
          </div>
          <ShoppingProductsGrid
            telegramSupport={telegramSupport}
            allowEmpty={true}
            hideSearchBar={false}
            initialQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="w-full bg-white">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-green-600 text-left hidden">
          نتایج جستجو
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
            جستجوی بهترین محصولات...
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
          <p className="text-xs text-gray-500 mt-2">
            از گوگل شاپینگ در حال پیدا کردن محصولات...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q;
  const showDiscounts = searchParams.discount === "true";

  // Show discount products if discount parameter is true (even if query exists)
  if (showDiscounts) {
    return (
      <>
        <HomeBanner />
        <div className="py-8">
          <Suspense fallback={<SearchResultsSkeleton />}>
            <DiscountProductsContent searchQuery={query} />
          </Suspense>
        </div>
      </>
    );
  }

  // Show regular search results if query exists
  if (!query) {
    return null;
  }

  return (
    <>
      <HomeBanner />
      <div className="py-8">
        <Suspense fallback={<SearchResultsSkeleton />}>
          <SearchResultsContent query={query} />
        </Suspense>
      </div>
    </>
  );
}
