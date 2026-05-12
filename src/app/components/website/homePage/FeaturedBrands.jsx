"use client";

import { useRouter } from "next/navigation";

export default function FeaturedBrands({ brands = [], imageBaseUrl = "" }) {
  const router = useRouter();

  const handleBrandClick = (brandSlug) => {
    if (brandSlug) {
      router.push(`/store?brand=${brandSlug}&page=1`);
    } else {
      router.push('/store');
    }
  };

  const handleViewAll = () => {
    router.push('/store');
  };

  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <section className="w-full rounded-2xl bg-white px-6 py-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Featured Brands</h2>
        <button 
          onClick={handleViewAll}
          className="text-sm text-teal-600 hover:text-teal-700 font-medium"
        >
          View All →
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {brands.map((brand) => (
          <div
            key={brand._id}
            onClick={() => handleBrandClick(brand.slug)}
            className="flex flex-col items-center p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-teal-50 transition group"
          >
            <div className="w-20 h-20 flex items-center justify-center">
              {brand.image ? (
                <img
                  src={brand.image?.startsWith('http') ? brand.image : `${imageBaseUrl}${brand.image}`}
                  alt={brand.name}
                  className="max-w-full max-h-16 object-contain group-hover:scale-110 transition"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/64?text=Logo"; }}
                />
              ) : (
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-teal-600">
                    {brand.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <span className="mt-3 text-sm font-medium text-gray-700 group-hover:text-teal-600 text-center">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}