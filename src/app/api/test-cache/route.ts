import { NextRequest, NextResponse } from "next/server";
import { cacheService } from "@/lib/services/cache.service";
import { serpAPIService } from "@/lib/services/serpapi.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const query = searchParams.get("q");

    switch (action) {
      case "test-search":
        if (!query) {
          return NextResponse.json(
            { error: "Query parameter is required" },
            { status: 400 }
          );
        }

        console.log(`🧪 Testing search for query: "${query}"`);

        // Test with cache
        const cachedResults = await serpAPIService.searchProducts(
          query,
          "search",
          10,
          false
        );

        // Test without cache (force refresh)
        const freshResults = await serpAPIService.searchProducts(
          query,
          "search",
          10,
          true
        );

        const stats = cacheService.getCacheStats();

        return NextResponse.json({
          success: true,
          query,
          cachedResults: {
            count: cachedResults.length,
            products: cachedResults.slice(0, 3), // Show first 3 products
          },
          freshResults: {
            count: freshResults.length,
            products: freshResults.slice(0, 3), // Show first 3 products
          },
          cacheStats: stats,
        });

      case "test-preload":
        console.log("🧪 Testing preload functionality");
        await serpAPIService.preloadPopularQueries();

        const popularQueries = await cacheService.getPopularQueries(5);

        return NextResponse.json({
          success: true,
          message: "Preload test completed",
          popularQueries,
        });

      case "test-cleanup":
        console.log("🧪 Testing cleanup functionality");
        await cacheService.cleanupExpiredCache();

        return NextResponse.json({
          success: true,
          message: "Cleanup test completed",
        });

      default:
        return NextResponse.json({
          success: true,
          message: "Cache test endpoints available:",
          endpoints: [
            "/api/test-cache?action=test-search&q=لباس",
            "/api/test-cache?action=test-preload",
            "/api/test-cache?action=test-cleanup",
          ],
        });
    }
  } catch (error) {
    console.error("❌ Cache test error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
