import { connectToDatabase } from "@/lib/db";
import Cache, { ICache } from "@/lib/db/models/cache.model";

export class CacheService {
  private static instance: CacheService;
  private cacheStats = {
    hits: 0,
    misses: 0,
    saves: 0,
  };

  private constructor() {}

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * جستجوی کش برای کوئری
   */
  async getCachedResults(
    query: string,
    queryType: string,
    maxResults: number = 50
  ): Promise<any[] | null> {
    try {
      await connectToDatabase();

      const cacheEntry = await Cache.findOne({
        query: query.toLowerCase().trim(),
        queryType,
        expiresAt: { $gt: new Date() },
      });

      if (cacheEntry) {
        // Update hit count and last accessed
        await Cache.updateOne(
          { _id: cacheEntry._id },
          {
            $inc: { hitCount: 1 },
            lastAccessed: new Date(),
          }
        );

        this.cacheStats.hits++;
        console.log(`✅ Cache HIT for query: "${query}" (${queryType})`);

        // Return limited results based on maxResults
        return cacheEntry.results.slice(0, maxResults);
      }

      this.cacheStats.misses++;
      console.log(`❌ Cache MISS for query: "${query}" (${queryType})`);
      return null;
    } catch (error) {
      console.error("❌ Cache get error:", error);
      return null;
    }
  }

  /**
   * ذخیره نتایج در کش
   */
  async setCachedResults(
    query: string,
    queryType: string,
    results: any[],
    maxResults: number = 50,
    ttlHours: number = 24
  ): Promise<void> {
    try {
      await connectToDatabase();

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + ttlHours);

      await Cache.findOneAndUpdate(
        {
          query: query.toLowerCase().trim(),
          queryType,
        },
        {
          results: results.slice(0, maxResults),
          maxResults,
          expiresAt,
          lastAccessed: new Date(),
        },
        {
          upsert: true,
          new: true,
        }
      );

      this.cacheStats.saves++;
      console.log(
        `💾 Cache SAVED for query: "${query}" (${queryType}) - ${results.length} results`
      );
    } catch (error) {
      console.error("❌ Cache set error:", error);
    }
  }

  /**
   * پاک کردن کش منقضی شده
   */
  async cleanupExpiredCache(): Promise<void> {
    try {
      await connectToDatabase();

      const result = await Cache.deleteMany({
        expiresAt: { $lt: new Date() },
      });

      console.log(`🧹 Cleaned up ${result.deletedCount} expired cache entries`);
    } catch (error) {
      console.error("❌ Cache cleanup error:", error);
    }
  }

  /**
   * دریافت آمار کش
   */
  getCacheStats() {
    const hitRate =
      this.cacheStats.hits + this.cacheStats.misses > 0
        ? (
            (this.cacheStats.hits /
              (this.cacheStats.hits + this.cacheStats.misses)) *
            100
          ).toFixed(2)
        : 0;

    return {
      ...this.cacheStats,
      hitRate: `${hitRate}%`,
    };
  }

  /**
   * دریافت محبوب‌ترین کوئری‌ها
   */
  async getPopularQueries(limit: number = 10): Promise<ICache[]> {
    try {
      await connectToDatabase();

      return await Cache.find({
        expiresAt: { $gt: new Date() },
      })
        .sort({ hitCount: -1, lastAccessed: -1 })
        .limit(limit)
        .select("query queryType hitCount lastAccessed");
    } catch (error) {
      console.error("❌ Get popular queries error:", error);
      return [];
    }
  }
}

export const cacheService = CacheService.getInstance();
