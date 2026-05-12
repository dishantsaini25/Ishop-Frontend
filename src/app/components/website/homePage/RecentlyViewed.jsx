"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RecentlyViewed() {
  const router = useRouter();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    try {
      const viewed = JSON.parse(localStorage.getItem("recently_viewed") || "[]");
      // Last 5, most recent first
      setProducts(viewed.slice(0, 5));
    } catch {
      setProducts([]);
    }
  }, []);

  // Don't render if nothing viewed
  if (products.length === 0) return null;

  const getImgSrc = (thumbnail) => {
    if (!thumbnail) return null;
    if (thumbnail.startsWith("http")) return thumbnail;
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
    return `${base}/images/product/main/${thumbnail}`;
  };

  const fmt = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <section className="w-full rounded-3xl border border-[#E5E5E5] bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-[14px] font-semibold uppercase tracking-wide text-[#111827]">
          YOUR RECENTLY VIEWED
        </h2>
        <button
          onClick={() => {
            localStorage.removeItem("recently_viewed");
            setProducts([]);
          }}
          className="text-xs font-medium text-gray-400 hover:text-red-500 transition"
        >
          Clear All
        </button>
      </div>

      <div className="h-px w-full bg-gray-100" />

      {/* Products row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 px-4 py-5">
        {products.map((p) => (
          <Link
            key={p._id}
            href={`/product/${p.slug}`}
            className="group flex flex-col rounded-2xl bg-[#F8FAFC] p-3 hover:shadow-md transition"
          >
            {/* Image */}
            <div className="flex h-28 items-center justify-center rounded-xl bg-white p-2">
              {getImgSrc(p.thumbnail) ? (
                <img
                  src={getImgSrc(p.thumbnail)}
                  alt={p.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No img</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="mt-3 flex flex-col flex-1">
              <h3 className="line-clamp-2 text-[12px] font-semibold text-[#111827] group-hover:text-teal-600 transition leading-tight">
                {p.name}
              </h3>
              <div className="mt-2 flex items-baseline gap-1 flex-wrap">
                <span className="text-[13px] font-bold text-[#01A49E]">
                  {fmt(p.final_price)}
                </span>
                {p.original_price > p.final_price && (
                  <span className="text-[11px] text-gray-400 line-through">
                    {fmt(p.original_price)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
