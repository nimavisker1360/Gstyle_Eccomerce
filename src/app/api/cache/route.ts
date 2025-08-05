import { NextRequest, NextResponse } from "next/server";
import { cacheService } from "@/lib/services/cache.service";
import { serpAPIService } from "@/lib/services/serpapi.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    switch (action) {
      case "stats":
        const stats = cacheService.getCacheStats();
        return NextResponse.json({
          success: true,
          stats,
        });

      case "popular":
        const popularQueries = await cacheService.getPopularQueries(20);
        return NextResponse.json({
          success: true,
          popularQueries,
        });

      case "cleanup":
        await cacheService.cleanupExpiredCache();
        return NextResponse.json({
          success: true,
          message: "Cache cleaned up successfully",
        });

      case "preload":
        await serpAPIService.preloadPopularQueries();
        return NextResponse.json({
          success: true,
          message: "Popular queries preloaded successfully",
        });

      default:
        return NextResponse.json(
          { error: "Invalid action parameter" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("❌ Cache API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
