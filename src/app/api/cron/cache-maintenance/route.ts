import { NextRequest, NextResponse } from "next/server";
import { cacheService } from "@/lib/services/cache.service";
import { serpAPIService } from "@/lib/services/serpapi.service";

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🔄 Starting cache maintenance...");

    // 1. Clean up expired cache
    await cacheService.cleanupExpiredCache();

    // 2. Preload popular queries (every 6 hours)
    const now = new Date();
    const hour = now.getHours();

    if (hour % 6 === 0) {
      await serpAPIService.preloadPopularQueries();
    }

    // 3. Get cache statistics
    const stats = cacheService.getCacheStats();
    const popularQueries = await cacheService.getPopularQueries(10);

    console.log("✅ Cache maintenance completed");

    return NextResponse.json({
      success: true,
      message: "Cache maintenance completed",
      stats,
      popularQueries,
    });
  } catch (error) {
    console.error("❌ Cache maintenance error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
