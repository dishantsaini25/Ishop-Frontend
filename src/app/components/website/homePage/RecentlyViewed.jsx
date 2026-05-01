// components/RecentlyViewed.jsx
"use client";

import Image from "next/image";
import { FiHeart } from "react-icons/fi";

const baseProduct = {
  name: "Xomie Remid 8 Sport Water Resistance Watch",
  image: "/image/Laptop.png", // tumhara path
  price: 579,
};

const products = Array.from({ length: 5 }).map((_, i) => ({
  ...baseProduct,
  id: i + 1,
}));

export default function RecentlyViewed() {
  return (
    <section className="w-full rounded-3xl border border-[#E5E5E5] bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-[14px] font-semibold uppercase tracking-wide text-[#111827]">
          YOUR RECENTLY VIEWED
        </h2>
        <button className="text-xs font-medium text-gray-500 hover:text-[#01A49E]">
          View All
        </button>
      </div>

      <div className="h-px w-full bg-gray-100" />

      {/* Products row */}
      <div className="flex flex-wrap gap-4 px-4 py-5 lg:flex-nowrap">
        {products.map((p) => (
          <article
            key={p.id}
            className="flex min-w-45 flex-1 items-center gap-3 rounded-[18px] bg-[#F8FAFC] px-3 py-3 hover:shadow-sm"
          >
            {/* image + favorite */}
            <div className="relative flex h-16 w-16 items-center justify-center rounded-[14px] bg-white">
              <Image
                src={p.image}
                alt={p.name}
                width={64}
                height={64}
                className="h-12 w-auto object-contain"
              />
              <button className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/5 text-gray-600 hover:bg-black/10">
                <FiHeart className="text-[12px]" />
              </button>
            </div>

            {/* text */}
            <div className="flex flex-1 flex-col">
              <h3 className="line-clamp-2 text-[12px] font-semibold text-[#111827]">
                {p.name}
              </h3>
              <p className="mt-2 text-[13px] font-semibold text-[#111827]">
                ${p.price.toFixed(2)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
