import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "./menu";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import data from "@/lib/data";
import Search from "./search";

export default function Header() {
  return (
    <header className="bg-white text-gray-800">
      {/* Top Row - Main Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
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
              />
            </Link>
          </div>

          {/* Search Bar - Centered and wider */}
          <div className="hidden md:block flex-1 max-w-2xl mx-12">
            <Search />
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-6">
            <Menu />
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden block py-2">
          <Search />
        </div>
      </div>

      {/* Category Navigation Row */}
      <div className="bg-gray-50 px-6 py-3">
        <div className="flex items-center justify-center space-x-8 text-sm max-w-7xl mx-auto">
          <Button
            variant="ghost"
            className="dark header-button flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-green-600"
          >
            <MenuIcon className="w-4 h-4" />
            دسته بندی محصولات
          </Button>

          <div className="flex items-center space-x-8 text-sm">
            {data.headerMenus.map((menu) => (
              <Link
                href={menu.href}
                key={menu.href}
                className="header-button text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                {menu.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
