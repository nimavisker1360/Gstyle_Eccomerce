import { NextRequest, NextResponse } from "next/server";
import { getJson } from "serpapi";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

// Function to extract and validate product links from SERP API
function extractProductLink(product: any): string | null {
  // List of valid store domains we want to accept
  const validStoreDomains = [
    "hepsiburada.com",
    "trendyol.com",
    "n11.com",
    "gittigidiyor.com",
    "amazon.com.tr",
    "amazon.com",
    "amazon.de",
    "amazon.co.uk",
    "ebay.com",
    "ebay.de",
    "ebay.co.uk",
    "etsy.com",
    "asos.com",
    "zara.com",
    "hm.com",
    "mango.com",
    "pullandbear.com",
    "bershka.com",
    "stradivarius.com",
    "massimodutti.com",
    "oysho.com",
    "zara.com.tr",
    "hm.com.tr",
    "mango.com.tr",
    "sephora.com",
    "sephora.com.tr",
    "douglas.com",
    "douglas.com.tr",
    "flormar.com.tr",
    "goldenrose.com.tr",
    "lorealparis.com.tr",
    "maybelline.com.tr",
    "nyxcosmetics.com.tr",
    "mac.com.tr",
    "benefitcosmetics.com.tr",
    "clinique.com.tr",
    "esteelauder.com.tr",
    "lancome.com.tr",
    "dior.com",
    "chanel.com",
    "ysl.com",
    "gucci.com",
    "prada.com",
    "louisvuitton.com",
    "hermes.com",
    "cartier.com",
    "tiffany.com",
    "swarovski.com",
    "pandora.com",
    "cartier.com.tr",
    "tiffany.com.tr",
    "swarovski.com.tr",
    "pandora.com.tr",
  ];

  // Function to check if URL is from a valid store
  function isValidStoreUrl(url: string): boolean {
    if (!url || typeof url !== "string") return false;

    // Exclude Google Shopping links
    if (
      url.includes("google.com/shopping") ||
      url.includes("google.com.tr/shopping") ||
      url.includes("google.com/search?tbm=shop")
    ) {
      return false;
    }

    // Check if URL contains any valid store domain
    return validStoreDomains.some((domain) => url.includes(domain));
  }

  // Priority order for extracting product links
  const linkSources = [
    product.merchant?.link,
    product.merchant?.url,
    product.source_link,
    product.product_link,
    product.offers?.link,
    product.offers?.url,
    product.link,
  ];

  // Try to find a valid store link
  for (const link of linkSources) {
    if (link && isValidStoreUrl(link)) {
      return link;
    }
  }

  return null;
}

// Simple filter - only remove obvious complete computers
function simpleFilter(product: any): boolean {
  const title = product.title?.toLowerCase() || "";
  const description = product.description?.toLowerCase() || "";

  // Only filter out obvious complete computers
  const completeComputerKeywords = [
    "laptop bilgisayar",
    "dizüstü bilgisayar",
    "masaüstü bilgisayar",
    "desktop computer",
    "bilgisayar sistemi",
    "computer system",
    "tam bilgisayar",
    "complete computer",
    "bilgisayar takımı",
    "computer set",
  ];

  // Check if product is a complete computer
  const isCompleteComputer = completeComputerKeywords.some(
    (keyword) => title.includes(keyword) || description.includes(keyword)
  );

  if (isCompleteComputer) {
    console.log(`🚫 Filtered out complete computer: ${product.title}`);
    return false;
  }

  return true;
}

// Function to enhance search query with OpenAI
async function enhanceSearchQuery(query: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return query;
  }

  try {
    const enhancedQueryPrompt = `
      من یک کوئری جستجو به زبان فارسی دارم که باید آن را برای جستجوی لوازم جانبی کامپیوتر و موبایل در فروشگاه‌های آنلاین ترکیه بهبود دهم.
      
      قوانین مهم:
      1. فقط لوازم جانبی کامپیوتر و موبایل را شامل شود
      2. لپ تاپ و کامپیوتر کامل را حذف کن
      3. به زبان ترکی ترجمه کن
      4. کلمات کلیدی مناسب برای جستجو در ترکیه اضافه کن
      5. کلمات کلیدی لوازم جانبی اضافه کن مثل: klavye, mouse, kulaklık, şarj, kılıf, adaptör
      
      مثال‌های کلمات کلیدی لوازم جانبی:
      - کیبورد: klavye, keyboard
      - موس: mouse, maus
      - هدست: kulaklık, headphone
      - شارژر: şarj, charger
      - قاب: kılıf, case, cover
      - کابل: kablo, cable
      - آداپتور: adaptör, adapter
      
      کوئری اصلی: "${query}"
      
      لطفاً کوئری را بهبود داده و به ترکی ترجمه کن:
    `;

    const { text: enhancedQuery } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: enhancedQueryPrompt,
    });

    console.log(`🔧 Enhanced query: "${query}" -> "${enhancedQuery}"`);
    return enhancedQuery.trim();
  } catch (error) {
    console.error("❌ Error enhancing query with OpenAI:", error);
    return query;
  }
}

// Function to translate product information to Persian
async function translateToPersian(text: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return text;
  }

  try {
    const translationPrompt = `
      این متن را از ترکی یا انگلیسی به فارسی ترجمه کن:
      
      متن: "${text}"
      
      ترجمه فارسی:
    `;

    const { text: translatedText } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: translationPrompt,
    });

    return translatedText.trim();
  } catch (error) {
    console.error("❌ Error translating text:", error);
    return text;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    console.log(`🔍 Starting simple accessories search for query: "${query}"`);

    // Check if API keys are available
    if (!process.env.SERPAPI_KEY) {
      console.error("❌ SERPAPI_KEY is not configured");
      return NextResponse.json(
        { error: "Search service is not configured" },
        { status: 500 }
      );
    }

    // Enhance search query with OpenAI
    let enhancedQuery = await enhanceSearchQuery(query);

    console.log(`🔍 Searching with enhanced query: "${enhancedQuery}"`);

    const serpApiParams = {
      engine: "google_shopping",
      q: enhancedQuery,
      gl: "tr", // ترکیه
      hl: "tr", // زبان ترکی
      num: 50, // افزایش تعداد نتایج
      device: "desktop",
      api_key: process.env.SERPAPI_KEY,
    };

    console.log("🔍 Search parameters:", serpApiParams);

    const shoppingResults = await getJson(serpApiParams);

    console.log("🔍 Raw search results:", {
      hasResults: !!shoppingResults.shopping_results,
      resultCount: shoppingResults.shopping_results?.length || 0,
      searchInfo: shoppingResults.search_information,
    });

    if (
      !shoppingResults.shopping_results ||
      shoppingResults.shopping_results.length === 0
    ) {
      console.log("❌ No search results found");
      return NextResponse.json({
        products: [],
        message:
          "هیچ لوازم جانبی یافت نشد. لطفاً کلمات کلیدی دیگری امتحان کنید.",
        search_query: query,
        enhanced_query: enhancedQuery,
      });
    }

    // Simple filter - only remove obvious complete computers
    const filteredResults =
      shoppingResults.shopping_results.filter(simpleFilter);

    console.log(
      `🔍 Filtered results: ${filteredResults.length} out of ${shoppingResults.shopping_results.length}`
    );

    if (filteredResults.length === 0) {
      return NextResponse.json({
        products: [],
        message:
          "هیچ لوازم جانبی مناسب یافت نشد. لطفاً کلمات کلیدی دیگری امتحان کنید.",
        search_query: query,
        enhanced_query: enhancedQuery,
      });
    }

    // Process and translate products
    const processedProducts = await Promise.all(
      filteredResults.slice(0, 20).map(async (product: any) => {
        const productLink = extractProductLink(product);

        // Translate title and description to Persian
        const translatedTitle = await translateToPersian(product.title || "");
        const translatedDescription = await translateToPersian(
          product.description || ""
        );

        return {
          id: product.product_id || `product-${Date.now()}-${Math.random()}`,
          title: translatedTitle,
          originalTitle: product.title,
          price:
            parseFloat(
              product.price?.replace(/[^\d.,]/g, "").replace(",", ".")
            ) || 0,
          originalPrice: product.original_price
            ? parseFloat(
                product.original_price.replace(/[^\d.,]/g, "").replace(",", ".")
              )
            : null,
          currency: product.price?.replace(/[\d.,]/g, "").trim() || "TL",
          image: product.thumbnail || "",
          description: translatedDescription,
          originalDescription: product.description,
          link: productLink,
          googleShoppingLink: product.link,
          source: product.merchant?.name || "Unknown",
          rating: parseFloat(product.rating) || 0,
          reviews: parseInt(product.reviews) || 0,
          delivery: product.delivery || "اطلاعات ارسال موجود نیست",
        };
      })
    );

    console.log(
      `✅ Processed ${processedProducts.length} accessories products`
    );

    return NextResponse.json({
      products: processedProducts,
      message: `${processedProducts.length} لوازم جانبی یافت شد`,
      search_query: query,
      enhanced_query: enhancedQuery,
    });
  } catch (error) {
    console.error("❌ Simple accessories search error:", error);
    return NextResponse.json(
      { error: "خطا در جستجوی لوازم جانبی. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}
