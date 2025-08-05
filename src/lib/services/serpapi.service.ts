import { getJson } from "serpapi";
import { cacheService } from "./cache.service";

export class SerpAPIService {
  private static instance: SerpAPIService;

  private constructor() {}

  public static getInstance(): SerpAPIService {
    if (!SerpAPIService.instance) {
      SerpAPIService.instance = new SerpAPIService();
    }
    return SerpAPIService.instance;
  }

  /**
   * جستجوی محصولات با کش
   */
  async searchProducts(
    query: string,
    queryType: string = "search",
    maxResults: number = 50,
    forceRefresh: boolean = false
  ): Promise<any[]> {
    const cacheKey = `${query}_${queryType}`;

    // اگر کش فعال است و درخواست اجباری نیست، ابتدا کش را چک کن
    if (!forceRefresh) {
      const cachedResults = await cacheService.getCachedResults(
        query,
        queryType,
        maxResults
      );

      if (cachedResults && cachedResults.length > 0) {
        return cachedResults;
      }
    }

    // اگر کش موجود نبود یا اجباری بود، از SerpAPI استفاده کن
    try {
      console.log(`🔍 Fetching from SerpAPI for query: "${query}"`);

      const serpApiParams = {
        engine: "google_shopping",
        q: query,
        gl: "tr",
        hl: "tr",
        num: Math.min(maxResults, 100), // حداکثر 100 نتیجه از SerpAPI
        device: "desktop",
        api_key: process.env.SERPAPI_KEY,
      };

      const shoppingResults = await getJson(serpApiParams);

      if (
        !shoppingResults.shopping_results ||
        shoppingResults.shopping_results.length === 0
      ) {
        console.log("❌ No results from SerpAPI");
        return [];
      }

      const results = shoppingResults.shopping_results.slice(0, maxResults);

      // ذخیره در کش برای استفاده بعدی
      await cacheService.setCachedResults(
        query,
        queryType,
        results,
        maxResults,
        24 // 24 ساعت TTL
      );

      console.log(`✅ Found ${results.length} products from SerpAPI`);
      return results;
    } catch (error) {
      console.error("❌ SerpAPI error:", error);
      return [];
    }
  }

  /**
   * جستجوی دسته‌بندی‌ها با کش
   */
  async searchCategories(
    category: string,
    maxResults: number = 30
  ): Promise<any[]> {
    return this.searchProducts(category, "category", maxResults);
  }

  /**
   * جستجوی برندها با کش
   */
  async searchBrands(brand: string, maxResults: number = 30): Promise<any[]> {
    return this.searchProducts(brand, "brand", maxResults);
  }

  /**
   * پر کردن کش با کوئری‌های محبوب
   */
  async preloadPopularQueries(): Promise<void> {
    try {
      const popularQueries = [
        "لباس زنانه",
        "کفش ورزشی",
        "ساعت مچی",
        "کیف دستی",
        "لوازم آرایشی",
        "لوازم الکترونیکی",
        "اسباب بازی",
        "LC Waikiki",
        "Koton",
        "Mavi",
      ];

      console.log("🔄 Preloading popular queries...");

      for (const query of popularQueries) {
        await this.searchProducts(query, "search", 50);
        // تاخیر کوتاه بین درخواست‌ها
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      console.log("✅ Popular queries preloaded successfully");
    } catch (error) {
      console.error("❌ Preload error:", error);
    }
  }
}

export const serpAPIService = SerpAPIService.getInstance();
