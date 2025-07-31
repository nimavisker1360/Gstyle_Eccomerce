import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "./menu";
import { MenuIcon } from "lucide-react";
import data from "@/lib/data";
import Search from "./search";
import CartButton from "./cart-button";
import UserButton from "./user-button";
import FashionDropdown from "./fashion-dropdown";

export default function Header() {
  return (
    <header className="bg-white text-gray-800 safe-area-inset-top">
      {/* Top Row - Main Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo - Left side */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center header-button font-extrabold text-2xl"
            >
              <Image
                src="/icons/logo01.png"
                width={120}
                height={40}
                alt="Logo"
                className="w-[100px] h-auto sm:w-[120px] object-contain"
                priority
              />
            </Link>
          </div>

          {/* Search Bar - Centered on desktop */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <Search />
          </div>

          {/* Right Side Icons - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <UserButton />
            <CartButton />
          </div>

          {/* Mobile Right Side - Cart and User */}
          <div className="md:hidden flex items-center gap-3">
            <CartButton />
            <UserButton />
          </div>
        </div>

        {/* Mobile Search - Below logo */}
        <div className="md:hidden block py-3">
          <Search />
        </div>
      </div>

      {/* Category Navigation Row */}
      <div className="bg-gray-50 px-4 sm:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-center space-x-6 sm:space-x-8 text-sm max-w-7xl mx-auto">
          <div className="dark header-button flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-green-600">
            <MenuIcon className="w-4 h-4" />
            <span className="hidden sm:inline">دسته بندی محصولات</span>
            <span className="sm:hidden">دسته‌بندی</span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm">
            {data.headerMenus.map((menu) =>
              menu.name === "مد و پوشاک" ? (
                <FashionDropdown key={menu.href} />
              ) : (
                <div
                  key={menu.href}
                  className="header-button text-blue-700 hover:text-green-600 font-medium transition-colors"
                >
                  {menu.name}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
