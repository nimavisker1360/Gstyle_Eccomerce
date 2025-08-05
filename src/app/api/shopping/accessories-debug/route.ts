import { NextRequest, NextResponse } from "next/server";
import { getJson } from "serpapi";

export async function GET(
  request: NextRequest,
  { searchParams }: { searchParams: URLSearchParams }
) {
  try {
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    console.log(`🔍 Debug search for query: "${query}"`);

    // Check if API keys are available
    if (!process.env.SERPAPI_KEY) {
      console.error("❌ SERPAPI_KEY is not configured");
      return NextResponse.json(
        { error: "Search service is not configured" },
        { status: 500 }
      );
    }

    // Simple search without any enhancement or filtering
    const serpApiParams = {
      engine: "google_shopping",
      q: query,
      gl: "tr", // ترکیه
      hl: "tr", // زبان ترکی
      num: 20,
      device: "desktop",
      api_key: process.env.SERPAPI_KEY,
    };

    console.log("🔍 Search parameters:", serpApiParams);

    const shoppingResults = await getJson(serpApiParams);

    console.log("🔍 Raw search results:", {
      hasResults: !!shoppingResults.shopping_results,
      resultCount: shoppingResults.shopping_results?.length || 0,
      searchInfo: shoppingResults.search_information,
      error: shoppingResults.error,
    });

    // Return all results without any processing
    return NextResponse.json({
      products: shoppingResults.shopping_results || [],
      message: `تعداد نتایج خام: ${shoppingResults.shopping_results?.length || 0}`,
      search_query: query,
      raw_results: shoppingResults,
    });
  } catch (error) {
    console.error("❌ Debug search error:", error);
    return NextResponse.json(
      { error: "خطا در جستجو. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}
