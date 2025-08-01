import { Suspense } from "react";
import ShoppingProductsGrid from "@/components/shared/product/shopping-products-grid";
import { HomeBanner } from "@/components/shared/home/home-banner";

interface SearchPageProps {
  searchParams: {
    q?: string;
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
