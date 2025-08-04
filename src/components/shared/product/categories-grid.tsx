"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface Category {
  id: string;
  name: string;
  persianName: string;
  image: string;
  searchQuery: string;
}

const categories: Category[] = [
  {
    id: "fashion",
    name: "Fashion & Clothing",
    persianName: "مد و پوشاک",
    image: "/images/fashion.jpg",
    searchQuery:
      "پیراهن تاپ بادی شلوار جین شومیز تی شرت شلوارک اسکورت دامن ست ژاکت پلیور بافت ژیله سویشرت کت جکت کفش کیف مایو اکسسوری لباس زیر پیژاما شلوارک شلوار پیراهن تی شرت پولوشرت جین کت شلوار پلیور مایو هودی لین بلیزر پالتو کاپشن بارانی کفش کیف اکسسوری دختر پسر نوزاد اسباب بازی",
  },
  {
    id: "beauty",
    name: "Beauty & Cosmetics",
    persianName: "آرایش و زیبایی",
    image: "/images/buity.jpg",
    searchQuery:
      "ست مراقبت پوستی محصولات ضد پیری محصولات پوستی محصولات آفتاب محصولات مراقبت از پوست عطر ادکلن بادی اسپلش محصولات مراقبت از بدن محصولات مراقبت مو رنگ مو شانه برس شامپو انواع ویتامین ها انواع مکملهای ورزشی انواع دمنوش ماچا قهوه",
  },
  {
    id: "electronics",
    name: "Electronics",
    persianName: "الکترونیک",
    image: "/images/laptob.jpg",
    searchQuery: "ساعت هوشمند هدفون لوازم جانبی",
  },
  {
    id: "sports",
    name: "Sports Equipment",
    persianName: "لوازم ورزشی",
    image: "/images/sports.png",
    searchQuery: "کفش لباس اکسسوری مایو ساک ورزشی ترموس قمقمه",
  },
  {
    id: "pets",
    name: "Pet Supplies",
    persianName: "حیوانات خانگی",
    image: "/images/pets.jpg",
    searchQuery:
      "غذای سگ گربه تشویقی قلاده لباس لوازم جانبی اسباب بازی ویتامین محصولات بهداشتی",
  },
  {
    id: "health",
    name: "Vitamins & Medicine",
    persianName: "ویتامین و دارو",
    image: "/images/drugs.jpg",
    searchQuery:
      "مولتی ویتامین کلسیم ویتامین D ملاتونین ویتامین C پوست مو ناخن",
  },
];

export default function CategoriesGrid() {
  return (
    <div className="w-full mb-20">
      {/* Gray rounded border container */}
      <div className="border-2 border-gray-300 rounded-xl p-6 bg-white/50 shadow-md hover:shadow-lg transition-shadow duration-300">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl text-green-600 text-right">
            دسته‌بندی‌های محصولات
          </h2>
          {/* <Link href="/search">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-50"
            >
              بیشتر ببینید
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Link> */}
        </div>

        {/* Static Grid (6 categories only) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-24">
          {categories.map((category) => (
            <div key={category.id} className="md:aspect-square">
              <Link
                href={`/search?q=${encodeURIComponent(category.searchQuery)}`}
                className="group block h-full"
              >
                <Card className="w-full h-full hover:shadow-lg transition-shadow duration-200 bg-white border border-blue-300 hover:border-blue-500">
                  <CardContent className="p-4 h-full flex flex-col">
                    {/* Category Image */}
                    <div className="relative mb-3 flex-1">
                      <div className="relative w-full h-32 md:h-36 bg-gray-50 rounded-lg overflow-hidden">
                        <Image
                          src={category.image}
                          alt={category.persianName}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-200"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/placeholder.jpg";
                          }}
                        />
                      </div>
                    </div>

                    {/* Category Name */}
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-800 group-hover:text-green-600 transition-colors">
                        {category.persianName}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
