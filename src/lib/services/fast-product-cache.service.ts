/**
 * سرویس کش سریع محصولات برای بهبود سرعت جستجو
 */

interface CacheItem {
  data: any;
  timestamp: number;
  ttl: number;
}

class FastProductCacheService {
  private static instance: FastProductCacheService;
  private cache: Map<string, CacheItem> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 دقیقه

  private constructor() {
    // پاکسازی خودکار کش هر 2 دقیقه
    setInterval(
      () => {
        this.cleanup();
      },
      2 * 60 * 1000
    );
  }

  public static getInstance(): FastProductCacheService {
    if (!FastProductCacheService.instance) {
      FastProductCacheService.instance = new FastProductCacheService();
    }
    return FastProductCacheService.instance;
  }

  /**
   * ذخیره در کش
   */
  set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * دریافت از کش
   */
  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * حذف از کش
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * پاکسازی کش منقضی شده
   */
  private cleanup(): void {
    const now = Date.now();
    this.cache.forEach((item, key) => {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    });
  }

  /**
   * پاکسازی کامل کش
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * آمار کش
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * کلید کش برای محصولات
   */
  generateProductKey(params: {
    category?: string;
    brand?: string;
    tag?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }): string {
    return `products:${JSON.stringify(params)}`;
  }

  /**
   * کلید کش برای جستجو
   */
  generateSearchKey(query: string, filters?: any): string {
    return `search:${query}:${JSON.stringify(filters || {})}`;
  }
}

export const fastProductCache = FastProductCacheService.getInstance();
