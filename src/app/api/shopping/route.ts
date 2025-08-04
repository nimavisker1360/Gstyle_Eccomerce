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

  // Debug: Log all available links for this product
  console.log(`🔍 Debugging product: ${product.title}`);
  console.log(`  Available links:`);
  linkSources.forEach((link, index) => {
    if (link) {
      console.log(`    ${index + 1}. ${link}`);
    }
  });

  // Find the first valid store link
  for (const link of linkSources) {
    if (link && isValidStoreUrl(link)) {
      console.log(`✅ Found valid store link: ${link}`);
      return link;
    }
  }

  // If no valid store link found, try to construct one from merchant domain
  if (product.merchant?.domain) {
    const domain = product.merchant.domain;
    console.log(`  Checking merchant domain: ${domain}`);
    if (
      domain &&
      !domain.includes("google.com") &&
      validStoreDomains.some((validDomain) => domain.includes(validDomain))
    ) {
      const constructedLink = `https://${domain}`;
      console.log(`✅ Constructed store link from domain: ${constructedLink}`);
      return constructedLink;
    }
  }

  // RELAXED FILTERING: Accept any non-Google link for better results
  console.log(
    `⚠️ No valid store link found, accepting any non-Google link for better results`
  );
  for (const link of linkSources) {
    if (link && !link.includes("google.com")) {
      console.log(`🔧 RELAXED: Accepting link: ${link}`);
      return link;
    }
  }

  // FINAL FALLBACK: Return Google Shopping link if nothing else works
  if (product.product_link) {
    console.log(
      `🔧 FINAL FALLBACK: Using Google Shopping link: ${product.product_link}`
    );
    return product.product_link;
  }

  console.log(`❌ No valid store link found for product: ${product.title}`);
  return null;
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

    console.log(`🔍 Starting search for query: "${query}"`);

    // Check if API keys are available
    if (!process.env.SERPAPI_KEY) {
      console.error("❌ SERPAPI_KEY is not configured");
      return NextResponse.json(
        { error: "Search service is not configured" },
        { status: 500 }
      );
    }

    // ترجمه و بهبود کوئری جستجو با OpenAI - فقط اگر API key موجود باشد
    let enhancedQuery = query;
    if (process.env.OPENAI_API_KEY) {
      try {
        const enhancedQueryPrompt = `
          من یک کوئری جستجو به زبان فارسی دارم که باید آن را برای جستجو در فروشگاه‌های آنلاین ترکیه بهبود دهم.

          کوئری اصلی: "${query}"

          لطفاً:
          1. این کوئری را به ترکی ترجمه کنید
          2. آن را دقیق‌تر کنید (مثلاً اگر "لباس زارا" است، فقط لباس‌های برند زارا را در نظر بگیرید)
          3. کلمات کلیدی مناسب برای جستجو در Google Shopping اضافه کنید
          4. اگر کوئری خیلی عمومی است، آن را گسترش دهید

          فقط کوئری بهبود یافته را به زبان ترکی برگردانید، بدون توضیح اضافی:
        `;

        const { text } = await generateText({
          model: openai("gpt-3.5-turbo"),
          prompt: enhancedQueryPrompt,
          maxOutputTokens: 100,
          temperature: 0.3,
        });

        enhancedQuery = text.trim() || query;

        console.log(`✅ Query enhanced: "${query}" → "${enhancedQuery}"`);
      } catch (error) {
        console.error("❌ Error enhancing query:", error);
        // اگر OpenAI کار نکرد، از کوئری اصلی استفاده کن
        enhancedQuery = query;
      }
    } else {
      console.log("⚠️ OpenAI API key not configured, using original query");
    }

    // جستجو در Google Shopping برای محصولات از ترکیه
    console.log(`🔍 Searching with query: "${enhancedQuery}"`);

    const serpApiParams = {
      engine: "google_shopping",
      q: enhancedQuery,
      gl: "tr", // ترکیه
      hl: "tr", // زبان ترکی
      num: 50, // افزایش تعداد نتایج برای انتخاب بهتر
      device: "desktop", // اجباری برای دسکتاپ
      api_key: process.env.SERPAPI_KEY,
    };

    console.log("🔍 Search parameters:", serpApiParams);

    const shoppingResults = await getJson(serpApiParams);

    console.log("🔍 Raw search results:", {
      hasResults: !!shoppingResults.shopping_results,
      resultCount: shoppingResults.shopping_results?.length || 0,
      searchInfo: shoppingResults.search_information,
    });

    // Debug: log کردن ساختار داده برای بهبود
    if (
      shoppingResults.shopping_results &&
      shoppingResults.shopping_results.length > 0
    ) {
      const sampleProduct = shoppingResults.shopping_results[0];
      console.log("📋 Sample product structure:");
      console.log("- product.link:", sampleProduct.link);
      console.log("- product.source_link:", sampleProduct.source_link);
      console.log("- product.merchant:", sampleProduct.merchant);
      console.log("- product.product_id:", sampleProduct.product_id);
      console.log("- product.title:", sampleProduct.title);
      console.log("- product.price:", sampleProduct.price);
    }

    if (
      !shoppingResults.shopping_results ||
      shoppingResults.shopping_results.length === 0
    ) {
      console.log("❌ No search results found");
      return NextResponse.json({
        products: [],
        message: "هیچ محصولی یافت نشد. لطفاً کلمات کلیدی دیگری امتحان کنید.",
        search_query: query,
        enhanced_query: enhancedQuery,
      });
    }

    // نمایش همه محصولات (بدون فیلتر اولیه)
    console.log(
      `🔍 Total products from SerpAPI: ${shoppingResults.shopping_results.length}`
    );

    // محدود کردن نتایج به 50 محصول
    const limitedResults = shoppingResults.shopping_results.slice(0, 50);

    console.log(`📊 Processing ${limitedResults.length} products`);

    // ترجمه عنوان و توضیحات محصولات با OpenAI
    const enhancedProductsPromises = limitedResults.map(
      async (product: any, index: number) => {
        console.log(`🔄 Processing product ${index + 1}: ${product.title}`);

        try {
          let persianTitle = product.title;
          let persianDescription =
            product.snippet || "توضیحات این محصول در دسترس نیست.";

          // Only translate if OpenAI is available
          if (process.env.OPENAI_API_KEY) {
            try {
              const translationPrompt = `
                لطفاً عنوان و توضیحات این محصول را به فارسی ترجمه کنید:

                عنوان: ${product.title}
                توضیحات: ${product.snippet || "بدون توضیحات"}

                پاسخ را در این فرمت JSON بدهید:
                {
                  "title": "عنوان فارسی",
                  "description": "توضیحات فارسی (حداکثر 100 کلمه، جذاب و مناسب فروش)"
                }
              `;

              const { text: response } = await generateText({
                model: openai("gpt-3.5-turbo"),
                prompt: translationPrompt,
                maxOutputTokens: 200,
                temperature: 0.5,
              });

              try {
                if (response) {
                  // تلاش برای پارس JSON
                  const parsed = JSON.parse(response);
                  persianTitle = parsed.title || product.title;
                  persianDescription = parsed.description || persianDescription;
                }
              } catch (parseError) {
                // اگر JSON پارس نشد، از متن خام استفاده کن
                if (response && response.length > 20) {
                  persianDescription = response;
                }
              }
            } catch (translationError) {
              console.error(
                `❌ Translation error for product ${index + 1}:`,
                translationError
              );
              // Continue with original title/description
            }
          }

          // ساخت لینک Google Shopping از product_id یا link
          let googleShoppingLink = "";
          if (product.product_id) {
            // استفاده از product_id برای لینک دقیق Google Shopping
            googleShoppingLink = `https://www.google.com.tr/shopping/product/${product.product_id}?gl=tr`;
          } else if (product.product_link) {
            // اگر product_link موجود است
            googleShoppingLink = product.product_link;
          } else {
            // fallback برای جستجوی عمومی
            googleShoppingLink = `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(product.title)}`;
          }

          // استخراج قیمت دقیق از فیلدهای مختلف SerpAPI
          let finalPrice = 0;
          let finalOriginalPrice = null;
          let currency = "TRY";

          // تلاش برای یافتن قیمت از فیلدهای مختلف
          if (product.extracted_price) {
            finalPrice = product.extracted_price;
          } else if (product.price) {
            const priceStr =
              typeof product.price === "string"
                ? product.price
                : product.price.toString();
            finalPrice =
              parseFloat(priceStr.replace(/[^\d.,]/g, "").replace(",", ".")) ||
              0;
          }

          // قیمت اصلی (قبل از تخفیف)
          if (product.original_price) {
            const originalPriceStr =
              typeof product.original_price === "string"
                ? product.original_price
                : product.original_price.toString();
            finalOriginalPrice =
              parseFloat(
                originalPriceStr.replace(/[^\d.,]/g, "").replace(",", ".")
              ) || null;
          }

          // واحد پول
          if (product.currency) {
            currency = product.currency;
          } else if (product.price && typeof product.price === "string") {
            if (product.price.includes("₺")) currency = "TRY";
            else if (product.price.includes("€")) currency = "EUR";
            else if (product.price.includes("$")) currency = "USD";
          }

          // Extract product link using the new filtering function
          const storeLink = extractProductLink(product);

          // If no valid store link found, skip this product
          if (!storeLink) {
            console.log(
              `❌ Skipping product "${product.title}" - no valid store link`
            );
            return null;
          }

          console.log(`✅ Successfully processed product: ${persianTitle}`);

          return {
            id: product.product_id || Math.random().toString(36).substr(2, 9),
            title: persianTitle,
            originalTitle: product.title,
            price: finalPrice,
            originalPrice: finalOriginalPrice,
            currency: currency,
            image: product.thumbnail,
            description: persianDescription,
            originalDescription: product.snippet,
            link: storeLink, // لینک فروشگاه اصلی (hepsiburada, sephora, etc.)
            googleShoppingLink: googleShoppingLink, // لینک Google Shopping
            source: product.source || "فروشگاه آنلاین",
            rating: product.rating || 0,
            reviews: product.reviews || 0,
            delivery: product.delivery || "اطلاعات ارسال نامشخص",
            position: product.position,
            product_id: product.product_id,
          };
        } catch (error) {
          console.error(`❌ Error processing product ${index + 1}:`, error);

          // در صورت خطا، از مقادیر پیش‌فرض استفاده کن
          let googleShoppingLink = "";
          if (product.product_id) {
            googleShoppingLink = `https://www.google.com.tr/shopping/product/${product.product_id}?gl=tr`;
          } else if (product.product_link) {
            googleShoppingLink = product.product_link;
          } else {
            googleShoppingLink = `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(product.title)}`;
          }

          // استخراج قیمت برای fallback case
          let finalPrice = 0;
          let finalOriginalPrice = null;
          let currency = "TRY";

          if (product.extracted_price) {
            finalPrice = product.extracted_price;
          } else if (product.price) {
            const priceStr =
              typeof product.price === "string"
                ? product.price
                : product.price.toString();
            finalPrice =
              parseFloat(priceStr.replace(/[^\d.,]/g, "").replace(",", ".")) ||
              0;
          }

          if (product.original_price) {
            const originalPriceStr =
              typeof product.original_price === "string"
                ? product.original_price
                : product.original_price.toString();
            finalOriginalPrice =
              parseFloat(
                originalPriceStr.replace(/[^\d.,]/g, "").replace(",", ".")
              ) || null;
          }

          if (product.currency) {
            currency = product.currency;
          } else if (product.price && typeof product.price === "string") {
            if (product.price.includes("₺")) currency = "TRY";
            else if (product.price.includes("€")) currency = "EUR";
            else if (product.price.includes("$")) currency = "USD";
          }

          // Extract product link using the new filtering function for fallback
          const storeLink = extractProductLink(product);

          // If no valid store link found in fallback, skip this product
          if (!storeLink) {
            console.log(
              `❌ Skipping product "${product.title}" (fallback) - no valid store link`
            );
            return null;
          }

          return {
            id: product.product_id || Math.random().toString(36).substr(2, 9),
            title: product.title,
            originalTitle: product.title,
            price: finalPrice,
            originalPrice: finalOriginalPrice,
            currency: currency,
            image: product.thumbnail,
            description: product.snippet || "توضیحات این محصول در دسترس نیست.",
            originalDescription: product.snippet,
            link: storeLink, // لینک فروشگاه اصلی
            googleShoppingLink: googleShoppingLink,
            source: product.source || "فروشگاه آنلاین",
            rating: product.rating || 0,
            reviews: product.reviews || 0,
            delivery: product.delivery || "اطلاعات ارسال نامشخص",
            position: product.position,
            product_id: product.product_id,
          };
        }
      }
    );

    // فیلتر کردن null values و اجرای Promise.all
    const enhancedProducts = (
      await Promise.all(enhancedProductsPromises)
    ).filter(Boolean);

    console.log(`✅ Final processed products: ${enhancedProducts.length}`);

    return NextResponse.json({
      products: enhancedProducts,
      total: shoppingResults.search_information?.total_results || 0,
      search_query: query,
      enhanced_query: enhancedQuery,
      message:
        enhancedProducts.length === 0
          ? "هیچ محصولی یافت نشد. لطفاً کلمات کلیدی دیگری امتحان کنید."
          : "",
    });
  } catch (error) {
    console.error("❌ Shopping API Error:", error);
    return NextResponse.json(
      {
        error: "خطا در جستجوی محصولات. لطفاً دوباره تلاش کنید.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
