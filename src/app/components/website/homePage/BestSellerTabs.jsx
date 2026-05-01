"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiHeart } from "react-icons/fi";
import { fetchProduct } from "@/api/api-call";
import Image from "next/image";

const TABS = [
  { id: "best_seller", label: "Best Seller", filter: { is_best_seller: true } },
  { id: "new_in", label: "New In", filter: { sort: "-createdAt" } },
  { id: "popular", label: "Popular", filter: { is_hot: true } }
];

export default function BestSellerTabs() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("best_seller");
  const [products, setProducts] = useState([]);
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTabProducts();
  }, [activeTab]);

  const fetchTabProducts = async () => {
    setLoading(true);
    
    // Get current tab filter
    const currentTab = TABS.find(tab => tab.id === activeTab);
    const filterParams = currentTab?.filter || {};
    
    console.log("Fetching products for tab:", activeTab, filterParams);
    
    const res = await fetchProduct({
      status: true,
      stock: true,
      limit: 10,
      ...filterParams
    });
    
    if (res) {
      console.log("Products fetched:", res.product?.length);
      setProducts(res.product || []);
      setImageBaseUrl(res.imageBaseUrl || "");
    }
    
    setLoading(false);
  };

  const handleProductClick = (productSlug) => {
    router.push(`/product/${productSlug}`);
  };

  const handleViewAll = () => {
    const currentTab = TABS.find(tab => tab.id === activeTab);
    let url = '/store?';
    
    if (currentTab?.id === 'best_seller') {
      url += 'best_seller=true';
    } else if (currentTab?.id === 'popular') {
      url += 'hot=true';
    } else if (currentTab?.id === 'new_in') {
      url += 'sort=-createdAt';
    }
    
    router.push(url);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <section className="w-full rounded-3xl bg-white shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-4 flex-wrap gap-3">
        <div className="flex gap-6 text-sm font-semibold">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-3 uppercase tracking-wide transition ${
                activeTab === tab.id
                  ? "text-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-[#01A49E]" />
              )}
            </button>
          ))}
        </div>

        <button 
          onClick={handleViewAll}
          className="text-xs text-gray-500 hover:text-[#01A49E] transition"
        >
          View All →
        </button>
      </div>

      <div className="h-px w-full bg-gray-100 mt-2" />

      {/* Products Grid */}
      <div className="grid gap-6 px-6 py-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        
        {loading ? (
          // Loading skeletons
          [...Array(5)].map((_, i) => (
            <div key={i} className="rounded-3xl bg-white p-4 animate-pulse">
              <div className="bg-gray-200 rounded-2xl h-40 flex items-center justify-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))
        ) : products.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No products found
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductClick(product.slug)}
              className="group relative rounded-3xl bg-white p-4 transition hover:shadow-lg cursor-pointer"
            >
              {/* Wishlist Button */}
              <button 
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow hover:bg-gray-100 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add to wishlist logic here
                }}
              >
                <FiHeart className="text-gray-600 text-[16px]" />
              </button>

              {/* Product Image */}
              <div className="flex items-center justify-center bg-[#F8FAFC] rounded-2xl p-6 h-48">
                {product.thumbnail ? (
                  <img
                    src={`${imageBaseUrl}/main/${product.thumbnail}`}
                    alt={product.name}
                    className="max-h-32 w-auto object-contain group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No Image</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-10">
                  {product.name}
                </h3>

                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-lg font-bold text-red-600">
                    {formatPrice(product.final_price)}
                  </span>

                  {product.discount_price > 0 && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.original_price)}
                    </span>
                  )}
                  
                  {product.discount_price > 0 && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      {Math.round(((product.original_price - product.final_price) / product.original_price) * 100)}% OFF
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-block rounded-full bg-[#E6FFF8] px-3 py-1 text-xs font-semibold text-[#00BFA5]">
                    FREE SHIPPING
                  </span>

                  <div className="flex items-center gap-2 text-gray-600">
                    <span className={`h-2 w-2 rounded-full ${product.stock ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-xs">
                      {product.stock ? "In stock" : "Out of stock"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}