"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomeBanner } from "@/components/shared/home/home-banner";
import CategoriesGrid from "@/components/shared/product/categories-grid";

export default function CategoriesPage() {
  return (
    <>
      <HomeBanner />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Categories Section - Aligned with discount products layout */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl text-green-600 text-right">
                دسته‌بندی‌های محصولات
              </h1>
              <Link href="/search">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-50"
                >
                  بیشتر ببینید
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Categories Grid */}
            <CategoriesGrid />
          </div>
        </div>
      </div>
    </>
  );
}
