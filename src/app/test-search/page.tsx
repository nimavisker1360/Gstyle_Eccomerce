"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

export default function TestSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const testSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResults(null);

    try {
      console.log(`🧪 Testing search for: "${query}"`);

      const response = await fetch(
        `/api/shopping?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      console.log("🧪 Test response:", data);

      if (!response.ok) {
        throw new Error(data.error || "خطا در جستجو");
      }

      setResults(data);
    } catch (err) {
      console.error("🧪 Test error:", err);
      setError(err instanceof Error ? err.message : "خطا در جستجو");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    testSearch();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">تست جستجوی محصولات</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="محصول مورد نظر خود را جستجو کنید..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
            dir="rtl"
          />
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <h3 className="font-semibold">خطا:</h3>
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="mr-2">در حال جستجو...</span>
        </div>
      )}

      {results && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800">اطلاعات جستجو:</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                <strong>کوئری اصلی:</strong> {results.search_query}
              </p>
              <p>
                <strong>کوئری بهبود یافته:</strong> {results.enhanced_query}
              </p>
              <p>
                <strong>تعداد کل نتایج:</strong> {results.total}
              </p>
              <p>
                <strong>تعداد محصولات پردازش شده:</strong>{" "}
                {results.products?.length || 0}
              </p>
              <p>
                <strong>پیام:</strong> {results.message}
              </p>
            </div>
          </div>

          {results.products && results.products.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">نتایج جستجو:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.products.map((product: any, index: number) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">
                          {product.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {product.originalTitle}
                        </p>
                        <p className="text-sm font-medium mt-2">
                          {product.price} {product.currency}
                        </p>
                        {product.originalPrice && (
                          <p className="text-xs text-gray-500 line-through">
                            {product.originalPrice} {product.currency}
                          </p>
                        )}
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-gray-600">
                            <strong>منبع:</strong> {product.source}
                          </p>
                          {product.link && (
                            <a
                              href={product.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline block"
                            >
                              مشاهده در فروشگاه
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">هیچ محصولی یافت نشد.</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">پیشنهادات جستجو:</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "لباس زنانه",
            "کفش ورزشی",
            "لوازم آرایشی",
            "ساعت مچی",
            "کیف دستی",
            "عینک آفتابی",
            "جواهرات",
            "عطر",
          ].map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery(suggestion);
                setTimeout(() => testSearch(), 100);
              }}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
