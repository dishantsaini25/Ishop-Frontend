'use client'
import { useRouter, useSearchParams } from "next/navigation";

export default function BrandFilter({ brands }) {

  const router = useRouter();
  const searchParams = useSearchParams();
  const selBrand = searchParams.get("brand_slug");


  const scrollToProducts = () => {
    setTimeout(() => {
      const el = document.getElementById("category");
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }, 150); 
  };

  
  function filterHandler(slug) {
    const query = new URLSearchParams(searchParams.toString());

    if (slug === selBrand) {
      query.delete("brand_slug");
    } else {
      query.set("brand_slug", slug);
    }

    query.set("page", 1);

    router.push(`?${query.toString()}`, { scroll: false });

    scrollToProducts(); 
  }

  
  function clearFilter() {
    const query = new URLSearchParams(searchParams.toString());

    query.delete("brand_slug");
    query.set("page", 1);

    router.push(`?${query.toString()}`, { scroll: false });

    scrollToProducts(); 
  }

  return (
    <div className='bg-[#EEEFF6] rounded-2xl shadow-sm p-5'>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-gray-800">Brands</h4>

        {selBrand && (
          <button
            onClick={clearFilter}
            className="text-sm text-red-500 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {/* ALL BRANDS */}
      <button
        onClick={clearFilter}
        className={`w-full mb-3 py-2 rounded-lg border transition
          ${selBrand === null
            ? 'bg-teal-500 text-white'
            : 'bg-gray-50 hover:bg-gray-100'
          }`}
      >
        All Brands
      </button>

      {/* BRAND LIST */}
      <ul className="space-y-2">
        {brands.map((brand) => (
          <li
            key={brand._id}
            onClick={() => filterHandler(brand.slug)}
            className={`flex justify-between px-3 py-2 rounded-lg cursor-pointer transition
              ${selBrand === brand.slug
                ? 'bg-teal-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            <span>{brand.name}</span>
            <span>({brand.productCount || 0})</span>
          </li>
        ))}
      </ul>

    </div>
  );
}
