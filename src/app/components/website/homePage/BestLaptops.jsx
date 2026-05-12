"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiHeart } from "react-icons/fi";
import { fetchProduct, fetchCategory } from "@/api/api-call";

const laptopCategories = [
  { name: "Macbook", slug: "macbook" },
  { name: "Gaming PC", slug: "gaming-pc" },
  { name: "Laptop Office", slug: "laptop-office" },
  { name: "Laptop 15”", slug: "laptop-15" },
  { name: "M1 2023", slug: "m1-2023" },
  { name: "Secondhand", slug: "secondhand" },
];

export default function BestLaptops() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLaptopProducts();
    fetchCategoryCounts();
  }, []);

  const fetchLaptopProducts = async () => {
    setLoading(true);
    
    // Fetch products from laptop category
    const res = await fetchProduct({
      status: true,
      stock: true,
      category_slug: "laptop",
      limit: 5,
      sort: "-createdAt"
    });
    
    if (res) {
      console.log("Best Laptops fetched:", res.product?.length);
      setProducts(res.product || []);
      setImageBaseUrl(res.imageBaseUrl || "");
    }
    
    setLoading(false);
  };

  const fetchCategoryCounts = async () => {
    try {
      const res = await fetchCategory({ status: true });
      const categoriesData = res?.category || [];
      
      const counts = {};
      laptopCategories.forEach(cat => {
        const found = categoriesData.find(c => c.slug === cat.slug);
        counts[cat.name] = found?.totalProducts || found?.count || 0;
      });
      setCategoryCounts(counts);
    } catch (error) {
      console.error("Error fetching category counts:", error);
    }
  };

  const handleProductClick = (productSlug) => {
    router.push(`/product/${productSlug}`);
  };

  const handleCategoryClick = (categorySlug) => {
    router.push(`/store?category=${categorySlug}&page=1`);
  };

  const handleViewAll = () => {
    router.push('/store?category=laptop&page=1');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getDiscountPercent = (original, final) => {
    if (!original || !final) return 0;
    return Math.round(((original - final) / original) * 100);
  };

  return (
    <section className="w-full rounded-3xl bg-white border border-[#E5E5E5] shadow-sm">
      {/* Header row */}
      <div className="flex items-center justify-between px-6 pt-5">
        <h2 className="text-[14px] font-semibold uppercase tracking-wide text-[#111827]">
          BEST LAPTOPS &amp; COMPUTERS
        </h2>
        <button 
          onClick={handleViewAll}
          className="text-xs font-medium text-gray-500 hover:text-[#01A49E] transition"
        >
          View All
        </button>
      </div>

      {/* Banner + category pills */}
      <div className="px-6 pt-4">
        <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
          {/* LEFT: big laptop banner */}
          <div className="relative h-50 overflow-hidden rounded-[20px] bg-[#111827] group cursor-pointer" onClick={() => handleCategoryClick("macbook")}>
            <Image
              src="/image/Laptop.png"
              alt="Mobok 2 Superchard By M2"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="relative z-10 flex h-full flex-col justify-center px-6 text-white">
              <h3 className="text-[18px] font-semibold leading-tight">
                Mobok 2
                <br />
                Superchard
              </h3>
              <p className="mt-1 text-[13px] text-white/80">By M2</p>
              <p className="mt-3 text-[11px] text-white/70">
                Start from <span className="underline">$1,199</span>
              </p>
              <button className="mt-4 w-max rounded-full bg-black px-4 py-2 text-[11px] font-semibold tracking-wide text-white hover:bg-black/80 transition">
                SHOP NOW
              </button>
            </div>
          </div>

          {/* RIGHT: categories pills */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {laptopCategories.map((cat) => (
              <div
                key={cat.name}
                onClick={() => handleCategoryClick(cat.slug)}
                className="flex items-center gap-2 text-[12px] text-[#111827] cursor-pointer group hover:bg-gray-50 p-2 rounded-lg transition"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F3F4F6] group-hover:bg-teal-100 transition">
                  <Image
                    src="/image/Best-laptop.png"
                    alt={cat.name}
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-semibold group-hover:text-teal-600 transition">
                    {cat.name}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {categoryCounts[cat.name] || 0} Items
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-5 h-px w-full bg-gray-100" />

      {/* Products row */}
      <div className="grid gap-5 px-4 py-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {loading ? (
          // Loading skeletons
          [...Array(5)].map((_, i) => (
            <div key={i} className="rounded-3xl bg-gray-50 p-4 animate-pulse">
              <div className="bg-gray-200 rounded-2xl h-40"></div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))
        ) : products.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No products found
          </div>
        ) : (
          products.map((product) => (
            <article
              key={product._id}
              onClick={() => handleProductClick(product.slug)}
              className="flex h-full flex-col rounded-3xl bg-[#F8FAFC] p-4 transition hover:shadow-md cursor-pointer group"
            >
              {/* Save badge + image + favorite */}
              <div className="relative flex items-center justify-center rounded-[20px] bg-white py-4">
                {/* favorite icon top-right */}
                <button 
                  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-gray-600 hover:bg-black/10 transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiHeart className="text-[15px]" />
                </button>

                {/* save badge top-left */}
                {product.discount_price > 0 && (
                  <div className="absolute left-3 top-3 z-10 rounded-full bg-[#00BFA5] px-3 py-1 text-[11px] font-semibold text-white">
                    SAVE {formatPrice(product.original_price - product.final_price)}
                  </div>
                )}

                <img
                  src={product.thumbnail?.startsWith('http') ? product.thumbnail : (product.thumbnail ? `${imageBaseUrl}/main/${product.thumbnail}` : "/image/Best-laptop.png")}
                  alt={product.name}
                  className="h-40 w-auto object-contain group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    e.target.src = "/image/Best-laptop.png";
                  }}
                />
              </div>

              {/* Info */}
              <div className="mt-4 flex flex-1 flex-col">
                <h3 className="line-clamp-2 text-[13px] font-semibold text-[#111827] group-hover:text-teal-600 transition">
                  {product.name}
                </h3>

                <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                  <span className="text-[16px] font-semibold text-[#01A49E]">
                    {formatPrice(product.final_price)}
                  </span>
                  {product.discount_price > 0 && (
                    <>
                      <span className="text-[12px] text-gray-400 line-through">
                        {formatPrice(product.original_price)}
                      </span>
                      <span className="text-[11px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                        {getDiscountPercent(product.original_price, product.final_price)}% OFF
                      </span>
                    </>
                  )}
                </div>

                <div className="mt-3 flex flex-col gap-2 text-[11px]">
                  <span className="inline-flex w-fit rounded-full bg-[#E6FFF8] px-4 py-1 font-semibold text-[#00BFA5]">
                    FREE SHIPPING
                  </span>
                  <div className="flex items-center gap-1 text-gray-600">
                    <span className={`h-1.5 w-1.5 rounded-full ${product.stock ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span>{product.stock ? "In stock" : "Out of stock"}</span>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}