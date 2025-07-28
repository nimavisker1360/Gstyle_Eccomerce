'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Grid, List, Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface Product {
  id: string;
  title: string;
  titlePersian: string;
  price: string;
  rating: number;
  image: string;
  link: string;
  shop: string;
  description?: string;
  descriptionPersian?: string;
}

interface SearchFilters {
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'price_low' | 'price_high' | 'rating' | 'popularity';
  limit?: number;
}

const categories = [
  {
    name: 'لوازم خانگی',
    nameEn: 'Home Appliances',
    icon: '🏠',
    keywords: ['televizyon', 'buzdolabı', 'çamaşır makinesi']
  },
  {
    name: 'الکترونیک',
    nameEn: 'Electronics', 
    icon: '📱',
    keywords: ['telefon', 'laptop', 'tablet', 'elektronik']
  },
  {
    name: 'مد و پوشاک',
    nameEn: 'Fashion',
    icon: '👕',
    keywords: ['giyim', 'ayakkabı', 'çanta', 'moda']
  },
  {
    name: 'کتاب و نوشت‌افزار',
    nameEn: 'Books & Stationery',
    icon: '📚',
    keywords: ['kitap', 'kırtasiye', 'okul']
  },
  {
    name: 'زیبایی و سلامت',
    nameEn: 'Beauty & Health',
    icon: '💄',
    keywords: ['kozmetik', 'sağlık', 'bakım']
  },
  {
    name: 'ورزش و تفریح',
    nameEn: 'Sports & Recreation',
    icon: '⚽',
    keywords: ['spor', 'oyun', 'fitness']
  }
];

// Demo products for testing
const demoProducts: Product[] = [
  {
    id: '1',
    title: 'Samsung Galaxy S24',
    titlePersian: 'گوشی سامسونگ گلکسی اس ۲۴',
    price: '25,000 TL',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
    link: 'https://example.com',
    shop: 'TechStore',
    description: 'Latest Samsung flagship smartphone',
    descriptionPersian: 'جدیدترین گوشی پرچمدار سامسونگ'
  },
  {
    id: '2',
    title: 'Apple iPhone 15 Pro',
    titlePersian: 'آیفون ۱۵ پرو اپل',
    price: '35,000 TL',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
    link: 'https://example.com',
    shop: 'AppleStore',
    description: 'Premium iPhone with advanced features',
    descriptionPersian: 'آیفون پریمیوم با ویژگی‌های پیشرفته'
  }
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'popularity',
    limit: 20
  });

  const searchProducts = useCallback(async (query?: string, category?: string) => {
    setLoading(true);
    try {
      // For demo purposes, show demo products
      // In production, this would call the API
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, category, filters })
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        // Fallback to demo data
        setProducts(demoProducts);
      }
    } catch (error) {
      console.error('Search failed:', error);
      // Fallback to demo data
      setProducts(demoProducts);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // Load popular products on initial load
    searchProducts(undefined, 'elektronik');
  }, [searchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchProducts(searchQuery);
    }
  };

  const handleCategoryClick = (category: any) => {
    const keyword = category.keywords[0];
    searchProducts(undefined, keyword);
  };

  const toggleWishlist = (productId: string) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlist(newWishlist);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('wishlist', JSON.stringify(Array.from(newWishlist)));
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price_low':
        return parseFloat(a.price.replace(/[^\d]/g, '')) - parseFloat(b.price.replace(/[^\d]/g, ''));
      case 'price_high':
        return parseFloat(b.price.replace(/[^\d]/g, '')) - parseFloat(a.price.replace(/[^\d]/g, ''));
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-blue-600">IranShop</h1>
            <div className="flex items-center space-x-reverse space-x-4">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4" />
                علاقه‌مندی‌ها
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="جستجوی محصولات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 text-right"
            />
            <Button 
              type="submit" 
              size="sm" 
              className="absolute left-2 top-1/2 transform -translate-y-1/2"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Categories */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">دسته‌بندی‌ها</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card
                key={category.nameEn}
                className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-medium text-sm">{category.name}</h3>
              </Card>
            ))}
          </div>
        </section>

        {/* Filters and View Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-reverse space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 ml-2" />
              فیلترها
            </Button>
            
            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value as any})}
            >
              <option value="popularity">محبوبیت</option>
              <option value="price_low">قیمت: کم به زیاد</option>
              <option value="price_high">قیمت: زیاد به کم</option>
              <option value="rating">امتیاز</option>
            </select>
          </div>

          <div className="flex items-center space-x-reverse space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">در حال جستجو...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className={viewMode === 'grid' ? 
            'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 
            'space-y-4'
          }>
            {sortedProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {viewMode === 'grid' ? (
                  <div>
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.titlePersian}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 left-2 p-2"
                        onClick={() => toggleWishlist(product.id)}
                      >
                        <Heart 
                          className={`h-4 w-4 ${wishlist.has(product.id) ? 'fill-red-500 text-red-500' : ''}`} 
                        />
                      </Button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                        {product.titlePersian}
                      </h3>
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600 mr-1">
                          ({product.rating})
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-blue-600">{product.price}</span>
                        <Badge variant="secondary" className="text-xs">
                          {product.shop}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex p-4 space-x-reverse space-x-4">
                    <Image
                      src={product.image}
                      alt={product.titlePersian}
                      width={96}
                      height={96}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{product.titlePersian}</h3>
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 mr-2">({product.rating})</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-blue-600">{product.price}</span>
                        <div className="flex items-center space-x-reverse space-x-2">
                          <Badge variant="secondary">{product.shop}</Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleWishlist(product.id)}
                          >
                            <Heart 
                              className={`h-4 w-4 ${wishlist.has(product.id) ? 'fill-red-500 text-red-500' : ''}`} 
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">محصولی یافت نشد</h3>
            <p className="text-gray-600">لطفاً کلمات کلیدی دیگری امتحان کنید</p>
          </div>
        )}
      </div>
    </div>
  );
}