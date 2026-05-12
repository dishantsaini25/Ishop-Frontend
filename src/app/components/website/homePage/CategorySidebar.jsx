"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiChevronRight } from "react-icons/fi";

export default function CategorySidebar({ categories = [], imageBaseUrl = "" }) {
  const router = useRouter();
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const handleCategoryClick = (categorySlug) => {
    if (categorySlug) {
      router.push(`/store?category=${categorySlug}&page=1`);
    } else {
      router.push('/store');
    }
  };

  const totalProducts = categories.reduce(
    (sum, cat) => sum + (cat.totalProducts || cat.count || 0), 
    0
  );

  return (
    <div className="w-full lg:w-80 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-linear-to-r from-teal-50 to-white">
        <h3 className="text-lg font-bold text-gray-900">Shop by Category</h3>
        <p className="text-xs text-gray-500 mt-0.5">Browse our collection</p>
      </div>
      
      <div className="p-2 max-h-125 overflow-y-auto custom-scrollbar">
        {/* All Categories Option */}
        <button
          onClick={() => handleCategoryClick(null)}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition group mb-1"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <div className="text-left">
              <span className="font-semibold text-gray-800">All Categories</span>
              <p className="text-xs text-gray-400">{totalProducts} products</p>
            </div>
          </div>
          <FiChevronRight className="text-gray-400 group-hover:text-teal-600 transition" />
        </button>

        {/* Category List */}
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => handleCategoryClick(category.slug)}
              onMouseEnter={() => setHoveredCategory(category._id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                  {category.image && (
                    <img
                      src={category.image?.startsWith('http') ? category.image : `${imageBaseUrl}${category.image}`}
                      alt={category.name}
                      className="w-8 h-8 object-contain"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/32?text=No+Image"; }}
                    />
                  )}
                </div>
                <div className="text-left">
                  <span className="font-medium text-gray-800 text-sm">
                    {category.name}
                  </span>
                  <p className="text-xs text-gray-400">
                    {category.totalProducts || category.count || 0} products
                  </p>
                </div>
              </div>
              <FiChevronRight className="text-gray-400 group-hover:text-teal-600 transition" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}