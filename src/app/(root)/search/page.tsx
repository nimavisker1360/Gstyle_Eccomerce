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
    <div className="flex justify-center items-center py-12">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-blue-600 text-sm">در حال جستجو...</p>
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
      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResultsContent query={query} />
      </Suspense>
    </>
  );
}
