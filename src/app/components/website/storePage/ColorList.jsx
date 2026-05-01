"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ByColor({ colors = [] }) {

  const router = useRouter();
  const searchParams = useSearchParams();
  const selColor = searchParams.get("color_slug");
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

    if (slug === selColor) {
      query.delete("color_slug");
    } else {
      query.set("color_slug", slug);
    }

    query.set("page", 1);

    router.push(`?${query.toString()}`, { scroll: false });

    scrollToProducts(); 
  }
  function clearFilter() {
    const query = new URLSearchParams(searchParams.toString());

    query.delete("color_slug");
    query.set("page", 1);

    router.push(`?${query.toString()}`, { scroll: false });

    scrollToProducts();
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">
          By Color
        </h3>

        {selColor && (
          <button
            onClick={clearFilter}
            className="text-sm text-red-500 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-6">
        {colors.map((color) => (

          <div
            key={color._id}
            onClick={() => filterHandler(color.slug)}
            className="cursor-pointer group relative"
          >

            {/* Color Box */}
            <div
              className={`w-8 h-8 rounded-md border-2 transition relative
                ${selColor === color.slug
                  ? "ring-2 ring-green-500"
                  : "border-gray-300"
                }`}
              style={{ backgroundColor: color.color_code }}
            >

              {/* Count Badge */}
              <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {color.productCount || 0}
              </span>

            </div>

            {/* Tooltip */}
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
              {color.name}
            </span>

          </div>

        ))}
      </div>
    </div>
  );
}
