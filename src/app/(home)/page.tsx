import { HomeCard } from "@/components/shared/home/home-card";
import { HomeBanner } from "@/components/shared/home/home-banner";
import { Card, CardContent } from "@/components/ui/card";
import {
  getAllCategories,
  getProductsByTag,
  getProductsForCard,
} from "@/lib/actions/product.actions";
import { toSlug } from "@/lib/utils";
import data from "@/lib/data";
import ProductSlider from "@/components/shared/product/product-slider";
import BrowsingHistoryList from "@/components/shared/browsing-history-list";

export default async function HomePage() {
  const todaysDeals = await getProductsByTag({ tag: "todays-deal" });
  const bestSellingProducts = await getProductsByTag({ tag: "best-seller" });
  const categories = (await getAllCategories()).slice(0, 4);
  const newArrivals = await getProductsForCard({
    tag: "new-arrival",
    limit: 4,
  });
  const featureds = await getProductsForCard({
    tag: "featured",
    limit: 4,
  });
  const bestSellers = await getProductsForCard({
    tag: "best-seller",
    limit: 4,
  });

  // const carousels = data.carousels.filter((carousel) => carousel.isPublished);

  const cards = [
    {
      title: "دسته‌بندی‌ها برای کاوش",
      link: {
        text: "بیشتر ببینید",
        href: "/search",
      },
      items: categories.map((category) => ({
        name: category,
        image: `/images/${toSlug(category)}.jpg`,
        href: `/search?category=${category}`,
      })),
    },
    {
      title: "جدیدترین محصولات را کاوش کنید",
      items: newArrivals,
      link: {
        text: "مشاهده همه",
        href: "/search?tag=new-arrival",
      },
    },
    {
      title: "پرفروش‌ترین‌ها را کشف کنید",
      items: bestSellers,
      link: {
        text: "مشاهده همه",
        href: "/search?tag=new-arrival",
      },
    },
    {
      title: "محصولات ویژه",
      items: featureds,
      link: {
        text: "خرید کنید",
        href: "/search?tag=new-arrival",
      },
    },
  ];

  return (
    <>
      <HomeBanner />
      <div className="max-w-7xl mx-auto px-6">
        <div className="md:p-4 md:space-y-4 bg-border">
          <HomeCard cards={cards} />
          <Card className="w-full rounded-none">
            <CardContent className="p-4 items-center gap-3">
              <ProductSlider title={"پیشنهادات امروز"} products={todaysDeals} />
            </CardContent>
          </Card>

          <Card className="w-full rounded-none">
            <CardContent className="p-4 items-center gap-3">
              <ProductSlider
                title="پرفروش‌ترین محصولات"
                products={bestSellingProducts}
                hideDetails
              />
            </CardContent>
          </Card>
        </div>
        <div className="p-4 bg-background">
          <BrowsingHistoryList />
        </div>
      </div>
    </>
  );
}
