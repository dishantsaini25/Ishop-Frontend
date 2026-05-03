
import Image from "next/image";
import CategorySidebar from "../components/website/homePage/CategorySidebar";
import FeaturedBrands from "../components/website/homePage/FeaturedBrands";
import TopCategories from "../components/website/homePage/TopCategories";
import DealsOfTheDay from "../components/website/homePage/DealsOfTheDay";
import PreOrderBanner from "../components/website/homePage/PreOrderBanner";
import BestSellerTabs from "../components/website/homePage/BestSellerTabs";
import TopCellphones from "../components/website/homePage/TopCellphones";
import BestLaptops from "../components/website/homePage/BestLaptops";
import MiniCategorySection from "../components/website/homePage/MiniCategorySection";
import RecentlyViewed from "../components/website/homePage/RecentlyViewed";
import { fetchBrand, fetchCategory } from "@/api/api-call";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Swoo Tech Mart - Best Electronics & Gadgets Online",
  description:
    "Shop the latest electronics, mobiles, laptops, tablets and gadgets at the best prices. Free shipping on orders over ₹199.",
  openGraph: {
    title: "Swoo Tech Mart - Best Electronics & Gadgets Online",
    description: "Shop the latest electronics, mobiles, laptops, tablets and gadgets at the best prices.",
    url: "/",
  },
};

export default async function Home() {
  const { category = [], imageBaseUrl = "" } = await fetchCategory({
    status: true,
    limit: 20
  });

  const { category: topCategoriesList = [] } = await fetchCategory({
    status: true,
    is_home: true,
    limit: 10
  });

  const brandsData = await fetchBrand({ status: true, limit: 10 });
  const brands = brandsData?.brand || [];
  const brandImageBaseUrl = brandsData?.imageBaseUrl || "";


  return (
    <main className="min-h-screen bg-[#F4F6F7]">
      {/* HERO ROW: Category + Banner */}
      <section className="w-full">
        <div className="mx-auto mt-8 flex w-full max-w-7xl flex-col gap-6 px-1 lg:flex-row lg:px-10">
          {/* LEFT: Category sidebar - with categories data */}
          <CategorySidebar categories={category} imageBaseUrl={imageBaseUrl}
          />

          {/* RIGHT: Hero banner */}
          <div className="relative flex-1">
            <div className="relative h-114 w-full overflow-hidden rounded-4xl border border-[#E5E5E5] shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              {/* Background image */}
              <Image
                src="/image/1.png"
                alt="Grocery deals background"
                fill
                priority
                className="object-cover"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/20" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-center px-8 py-8 md:px-12 lg:px-16">
                {/* Heading */}
                <h1 className="max-w-155 text-[40px] font-bold leading-tight text-white md:text-[56px] lg:text-[65px]">
                  Don't miss amazing
                  <br />
                  grocery deals
                </h1>

                {/* Subtext */}
                <p className="mt-5 text-[18px] text-white/95 md:text-[24px] lg:text-[30px]">
                  Sign up for the daily newsletter
                </p>

                {/* Email form */}
                <form className="mt-8">
                  <div className="flex h-16 w-94.75 items-center rounded-full border border-white/80 bg-transparent px-6">
                    <span className="text-[15px] text-white/90">
                      Your email address
                    </span>

                    <button
                      type="button"
                      className="ml-auto flex h-12 items-center justify-center rounded-full bg-[#01A49E] px-6 text-[15px] font-semibold text-white shadow-md hover:bg-[#019089]"
                    >
                      Subscribe
                    </button>
                  </div>
                </form>

                {/* Dots */}
                <div className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#01A49E]" />
                  <span className="h-2 w-2 rounded-full bg-white/70" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED BRANDS + TOP CATEGORIES ROW */}
      <section className="w-full mt-8 pb-12">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-1 lg:flex-row lg:px-10">
          <div className="flex w-full justify-center lg:justify-start">
            <FeaturedBrands brands={brands} imageBaseUrl={brandImageBaseUrl} />
          </div>
          <div className="flex w-full justify-center lg:justify-start">
            <TopCategories categories={topCategoriesList} imageBaseUrl={imageBaseUrl} />
          </div>
        </div>
      </section>

      <section className="w-full mt-8 ">
        <div className="mx-auto w-full max-w-7xl px-1 lg:px-10">
          <DealsOfTheDay />
        </div>
      </section>

      <section className="w-full ">
        <div className="mx-auto w-full max-w-7xl px-1 lg:px-10">
          <PreOrderBanner />
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto w-full max-w-7xl px-1 lg:px-10">
          <BestSellerTabs />
        </div>
      </section>

      <section className="w-full mt-8">
        <div className="mx-auto w-full max-w-7xl px-1 lg:px-10">
          <TopCellphones />
        </div>
      </section>

      <section className="w-full mt-8">
        <div className="mx-auto w-full max-w-7xl px-1 lg:px-10">
          <BestLaptops />
        </div>
      </section>

      <MiniCategorySection />

      {/* Massage chair + phones banner row */}
      <section className="w-full mt-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-1 lg:flex-row lg:px-10">
          {/* LEFT: Massage chair */}
          <div className="w-full lg:w-1/2">
            <div className="flex h-37.5 items-center justify-between overflow-hidden rounded-3xl bg-[#01A49E] px-6 sm:px-8">
              <div className="text-white">
                <p className="text-[13px] font-semibold uppercase tracking-wide">
                  MASSAGE CHAIR
                </p>
                <p className="mt-1 text-[13px] font-semibold uppercase tracking-wide">
                  LUXURY
                </p>
                <p className="mt-2 text-[11px] text-white/85">
                  Fuka Relax Full Body
                  <br />
                  Massage Chair
                </p>
                <button className="mt-4 rounded-full bg-white px-5 py-2 text-[12px] font-semibold text-[#111827] shadow-sm hover:bg-gray-100">
                  Shop Now
                </button>
              </div>

              <div className="flex h-full items-center justify-center">
                <Image
                  src="/image/Chair.png"
                  alt="Massage chair"
                  width={160}
                  height={140}
                  className="h-32.5 w-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: phones promo image */}
          <div className="w-full lg:w-1/2">
            <div className="relative h-37.5 overflow-hidden rounded-3xl bg-[#111827]">
              <Image
                src="/image/2-phone.png"
                alt="Phone promo"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full mt-8 mb-10 py-10">
        <div className="mx-auto w-full max-w-7xl px-1 lg:px-10">
          <RecentlyViewed />
        </div>
      </section>
    </main>
  );
}