import { HomeBanner } from "@/components/shared/home/home-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ShoppingProductsGrid from "@/components/shared/product/shopping-products-grid";
import LatestDiscountsSlider from "@/components/shared/product/latest-discounts-slider";
import CategoriesGrid from "@/components/shared/product/categories-grid";

export default async function HomePage() {
  const telegramSupport = process.env.TELEGRAM_SUPPORT || "@gstyle_support";

  return (
    <>
      <HomeBanner />

      {/* Latest Discounts Section - Now fetches from Google Shopping */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8">
        <LatestDiscountsSlider />
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl text-green-600 text-left">
            دسته‌بندی‌های محصولات
          </h2>
        </div>
        <CategoriesGrid />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="md:p-4 md:space-y-4 bg-border">
          {/* <Card className="w-full rounded-none">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-center">
                کاوش محصولات از ترکیه
              </CardTitle>
              <p className="text-sm text-gray-600 text-center">
                جستجو و خرید محصولات اصل از فروشگاه‌های معتبر ترکیه
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <ShoppingProductsGrid telegramSupport={telegramSupport} />
            </CardContent>
          </Card> */}
        </div>
      </div>
    </>
  );
}
