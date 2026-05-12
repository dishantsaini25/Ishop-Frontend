"use client";

import { useRouter } from "next/navigation";

export default function TopCategories({ categories = [], imageBaseUrl = "" }) {
  const router = useRouter();

  const handleCategoryClick = (categorySlug) => {
    if (categorySlug) {
      router.push(`/store?category=${categorySlug}&page=1`);
    } else {
      router.push('/store');
    }
  };

  // Agar categories nahi hain toh kuch mat dikhao
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-160.5 min-h-56.5 rounded-3xl bg-white px-8 py-5 shadow-sm border border-[#ECECEC]">
      <div className="mb-10 flex items-center justify-between">
        <h2 className="text-[14px] font-semibold tracking-wide text-[#111827]">TOP CATEGORIES</h2>
        <button 
          onClick={() => router.push('/store')}
          className="text-[12px] font-medium text-gray-500 hover:text-[#01A49E]"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-3 gap-x-6 gap-y-8 sm:grid-cols-4 lg:grid-cols-5">
        {categories.slice(0, 10).map((category) => (
          <div 
            key={category._id}
            onClick={() => handleCategoryClick(category.slug)}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden group-hover:bg-teal-50 transition">
              {category.image && (
                <img
                  src={category.image?.startsWith('http') ? category.image : `${imageBaseUrl}${category.image}`}
                  alt={category.name}
                  className="w-10 h-10 object-contain"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/40?text=No+Image"; }}
                />
              )}
            </div>
            <span className="text-xs text-gray-600 group-hover:text-teal-600 transition text-center">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}