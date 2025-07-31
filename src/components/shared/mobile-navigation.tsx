"use client";

import { Home, Search } from "lucide-react";

export function MobileNavigation() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around py-3 px-4">
        {/* Home */}
        <div className="flex flex-col items-center space-y-1 px-2 py-1 text-gray-600 hover:text-green-600 transition-colors">
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">Anasayfa</span>
        </div>

        {/* Categories */}
        <div className="flex flex-col items-center space-y-1 px-2 py-1 text-gray-600 hover:text-green-600 transition-colors">
          <Search className="w-6 h-6" />
          <span className="text-xs font-medium">Kategoriler</span>
        </div>
      </div>
    </div>
  );
}
