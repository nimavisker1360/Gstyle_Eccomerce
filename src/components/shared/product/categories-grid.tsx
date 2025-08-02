"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
  persianName: string;
  icon: React.ReactNode;
  searchQuery: string;
  color: string;
  bgColor: string;
  gradient: string;
}

const categories: Category[] = [
  {
    id: "fashion",
    name: "Fashion & Clothing",
    persianName: "مد و پوشاک",
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
    searchQuery: "مد و پوشاک",
    color: "text-white",
    bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    id: "beauty",
    name: "Beauty & Cosmetics",
    persianName: "آرایش و زیبایی",
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
        />
      </svg>
    ),
    searchQuery: "آرایش و زیبایی",
    color: "text-white",
    bgColor: "bg-gradient-to-br from-pink-500 to-pink-600",
    gradient: "from-pink-500 to-pink-600",
  },
  {
    id: "electronics",
    name: "Mobile & Computer",
    persianName: "موبایل و کامپیوتر",
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    searchQuery: "موبایل و کامپیوتر",
    color: "text-white",
    bgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    id: "toys",
    name: "Toys & Gadgets",
    persianName: "اسباب بازی و گجت",
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    searchQuery: "اسباب بازی و گجت",
    color: "text-white",
    bgColor: "bg-gradient-to-br from-yellow-500 to-yellow-600",
    gradient: "from-yellow-500 to-yellow-600",
  },
  {
    id: "pets",
    name: "Pet Supplies",
    persianName: "حیوانات خانگی",
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    searchQuery: "حیوانات خانگی",
    color: "text-white",
    bgColor: "bg-gradient-to-br from-red-500 to-red-600",
    gradient: "from-red-500 to-red-600",
  },
  {
    id: "health",
    name: "Vitamins & Medicine",
    persianName: "ویتامین و دارو",
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    searchQuery: "ویتامین و دارو",
    color: "text-white",
    bgColor: "bg-gradient-to-br from-green-500 to-green-600",
    gradient: "from-green-500 to-green-600",
  },
  {
    id: "shoes",
    name: "Shoes & Footwear",
    persianName: "کفش و پاپوش",
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    searchQuery: "کفش",
    color: "text-white",
    bgColor: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    id: "watches",
    name: "Watches & Jewelry",
    persianName: "ساعت و جواهرات",
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
    ),
    searchQuery: "ساعت",
    color: "text-white",
    bgColor: "bg-gradient-to-br from-orange-500 to-orange-600",
    gradient: "from-orange-500 to-orange-600",
  },
  {
    id: "jeans",
    name: "Jeans & Denim",
    persianName: "شلوار جین",
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
    searchQuery: "شلوار جین",
    color: "text-white",
    bgColor: "bg-gradient-to-br from-teal-500 to-teal-600",
    gradient: "from-teal-500 to-teal-600",
  },
  {
    id: "tshirts",
    name: "T-Shirts & Tops",
    persianName: "تی‌شرت و تاپ",
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
    searchQuery: "تی‌شرت",
    color: "text-white",
    bgColor: "bg-gradient-to-br from-cyan-500 to-cyan-600",
    gradient: "from-cyan-500 to-cyan-600",
  },
];

export default function CategoriesGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/search?q=${encodeURIComponent(category.searchQuery)}`}
          className="group"
        >
          <Card
            className={`h-full transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden ${category.bgColor} border-0`}
          >
            <CardContent className="p-6 text-center relative">
              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-90`}
              ></div>

              {/* Content */}
              <div className="relative z-10">
                <div className={`mb-4 flex justify-center ${category.color}`}>
                  {category.icon}
                </div>
                <h3
                  className={`text-sm font-semibold ${category.color} group-hover:text-white transition-colors`}
                >
                  {category.persianName}
                </h3>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
