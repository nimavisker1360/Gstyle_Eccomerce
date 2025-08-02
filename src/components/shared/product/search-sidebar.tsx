"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Search } from "lucide-react";
import Link from "next/link";

interface SearchSidebarProps {
  currentQuery?: string;
  totalProducts?: number;
  onFilterChange?: (filters: any) => void;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

interface Brand {
  id: string;
  name: string;
  count: number;
}

interface OnlineMarket {
  id: string;
  name: string;
  count: number;
}

export default function SearchSidebar({
  currentQuery,
  totalProducts = 0,
  onFilterChange,
}: SearchSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);
  const [brandSearch, setBrandSearch] = useState("");
  const [marketSearch, setMarketSearch] = useState("");

  // Sample data - in real app this would come from API
  const categories: Category[] = [
    { id: "1", name: "لباس زنانه", count: 245 },
    { id: "2", name: "لباس مردانه", count: 189 },
    { id: "3", name: "کفش", count: 156 },
    { id: "4", name: "لوازم آرایشی", count: 134 },
    { id: "5", name: "ساعت مچی", count: 98 },
    { id: "6", name: "کیف دستی", count: 87 },
    { id: "7", name: "لوازم الکترونیکی", count: 76 },
    { id: "8", name: "اسباب بازی", count: 65 },
  ];

  const brands: Brand[] = [
    { id: "1", name: "Komili", count: 63 },
    { id: "2", name: "Wooden", count: 45 },
    { id: "3", name: "Sip", count: 35 },
    { id: "4", name: "Datca", count: 34 },
    { id: "5", name: "Tarish", count: 32 },
    { id: "6", name: "Oscar", count: 30 },
    { id: "7", name: "Nike", count: 28 },
    { id: "8", name: "Adidas", count: 25 },
    { id: "9", name: "Apple", count: 22 },
    { id: "10", name: "Samsung", count: 20 },
  ];

  const onlineMarkets: OnlineMarket[] = [
    { id: "1", name: "Pazarama", count: 559 },
    { id: "2", name: "Amazon", count: 429 },
    { id: "3", name: "DttAVM", count: 241 },
    { id: "4", name: "Hepsiburada", count: 239 },
    { id: "5", name: "Trendyol", count: 198 },
    { id: "6", name: "N11", count: 156 },
    { id: "7", name: "GittiGidiyor", count: 134 },
    { id: "8", name: "eBay", count: 98 },
  ];

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((id) => id !== categoryId);
    setSelectedCategories(newCategories);
    onFilterChange?.({
      categories: newCategories,
      brands: selectedBrands,
      markets: selectedMarkets,
    });
  };

  const handleBrandChange = (brandId: string, checked: boolean) => {
    const newBrands = checked
      ? [...selectedBrands, brandId]
      : selectedBrands.filter((id) => id !== brandId);
    setSelectedBrands(newBrands);
    onFilterChange?.({
      categories: selectedCategories,
      brands: newBrands,
      markets: selectedMarkets,
    });
  };

  const handleMarketChange = (marketId: string, checked: boolean) => {
    const newMarkets = checked
      ? [...selectedMarkets, marketId]
      : selectedMarkets.filter((id) => id !== marketId);
    setSelectedMarkets(newMarkets);
    onFilterChange?.({
      categories: selectedCategories,
      brands: selectedBrands,
      markets: newMarkets,
    });
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const filteredMarkets = onlineMarkets.filter((market) =>
    market.name.toLowerCase().includes(marketSearch.toLowerCase())
  );

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 h-screen overflow-y-auto">
      {/* Header with context info */}
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2">
          {currentQuery && (
            <div className="mb-2">
              <p className="text-gray-600 text-right">
                جستجو برای: {currentQuery}
              </p>
              <p className="text-gray-500 text-right">
                {totalProducts} محصول یافت شد
              </p>
            </div>
          )}
        </div>

        {/* Breadcrumb */}
        <Link
          href="/"
          className="flex items-center text-sm text-gray-600 hover:text-gray-800 mb-4"
        >
          <ChevronLeft className="w-4 h-4 ml-1" />
          <span>بازگشت به صفحه اصلی</span>
        </Link>
      </div>

      <Separator className="mb-6" />

      {/* Categories Section */}
      <div className="mb-8">
        <h3 className="font-bold text-gray-900 mb-4 text-right">
          دسته‌بندی‌ها
        </h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category.id, checked as boolean)
                  }
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="text-sm text-gray-700 cursor-pointer flex-1 text-right"
                >
                  {category.name}
                </label>
              </div>
              <span className="text-xs text-gray-500">({category.count})</span>
            </div>
          ))}
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Brands Section */}
      <div className="mb-8">
        <h3 className="font-bold text-gray-900 mb-4 text-right">برندها</h3>

        {/* Brand Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="جستجوی برند"
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="pl-10 text-right"
              dir="rtl"
            />
          </div>
        </div>

        <ScrollArea className="h-48">
          <div className="space-y-3 pr-2">
            {filteredBrands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox
                    id={`brand-${brand.id}`}
                    checked={selectedBrands.includes(brand.id)}
                    onCheckedChange={(checked) =>
                      handleBrandChange(brand.id, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`brand-${brand.id}`}
                    className="text-sm text-gray-700 cursor-pointer flex-1 text-right"
                  >
                    {brand.name}
                  </label>
                </div>
                <span className="text-xs text-gray-500">({brand.count})</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Separator className="mb-6" />

      {/* Online Markets Section */}
      <div className="mb-8">
        <h3 className="font-bold text-gray-900 mb-4 text-right">
          فروشگاه‌های آنلاین
        </h3>

        {/* Market Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="جستجوی فروشگاه"
              value={marketSearch}
              onChange={(e) => setMarketSearch(e.target.value)}
              className="pl-10 text-right"
              dir="rtl"
            />
          </div>
        </div>

        <ScrollArea className="h-48">
          <div className="space-y-3 pr-2">
            {filteredMarkets.map((market) => (
              <div
                key={market.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox
                    id={`market-${market.id}`}
                    checked={selectedMarkets.includes(market.id)}
                    onCheckedChange={(checked) =>
                      handleMarketChange(market.id, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`market-${market.id}`}
                    className="text-sm text-gray-700 cursor-pointer flex-1 text-right"
                  >
                    {market.name}
                  </label>
                </div>
                <span className="text-xs text-gray-500">({market.count})</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Clear Filters Button */}
      {(selectedCategories.length > 0 ||
        selectedBrands.length > 0 ||
        selectedMarkets.length > 0) && (
        <div className="mt-6">
          <button
            onClick={() => {
              setSelectedCategories([]);
              setSelectedBrands([]);
              setSelectedMarkets([]);
              onFilterChange?.({ categories: [], brands: [], markets: [] });
            }}
            className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            پاک کردن فیلترها
          </button>
        </div>
      )}
    </div>
  );
}
