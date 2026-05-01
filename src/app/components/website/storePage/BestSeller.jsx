"use client";

import { useState } from "react";
import FiltersSidebar from "./FiltersSidebar";

export default function BestSeller() {
  const [showFilter, setShowFilter] = useState(false);

  const baseProducts = [
    {
      name: "Oppo Watch Series 8 GPS",
      price: "$979.00",
      oldPrice: "$1,259.00",
      image: "/image/storeTop2.png",
    },
    {
      name: "iSmart 24V Charger",
      price: "$9.00",
      oldPrice: "$12.00",
      image: "/image/storeTop2.png",
    },
    {
      name: "OPod Pro 12.9 Inch M1 2023",
      price: "$569.00",
      oldPrice: "$750.00",
      image: "/image/storeTop2.png",
    },
    {
      name: "uLosk Mini case 2.0",
      price: "$1,729.00",
      oldPrice: "$2,119.00",
      image: "/image/storeTop2.png",
    },
  ];

  const products = Array(4).fill(baseProducts).flat();

  const handleApplyFilters = () => {
    setShowFilter(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm">

        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold uppercase">
            Best Seller In This Category
          </h2>

          <button
            onClick={() => setShowFilter(true)}
            className="lg:hidden bg-black text-white px-4 py-2 rounded-lg text-sm"
          >
            Filter
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((item, index) => (
            <div
              key={index}
              className="text-center hover:shadow-md transition rounded-xl p-4"
            >
              <div className="flex justify-center mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-32 h-32 object-contain"
                />
              </div>

              <h3 className="text-sm font-medium text-gray-800 mb-2">
                {item.name}
              </h3>

              <div className="flex justify-center gap-2 items-center">
                <span className="text-red-600 font-semibold">
                  {item.price}
                </span>
                <span className="text-gray-400 line-through text-sm">
                  {item.oldPrice}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    
      {showFilter && (
        <div className="fixed inset-0 z-50 flex">

          {/* Overlay */}
          <div
            className="flex-1 bg-black/50"
            onClick={() => setShowFilter(false)}
          ></div>

          {/* Drawer */}
          <div className="w-80 bg-white h-full flex flex-col">

            {/* Scrollable Filter Area */}
            <div className="p-6 overflow-y-auto flex-1">

              <button
                onClick={() => setShowFilter(false)}
                className="mb-6 text-sm text-gray-500"
              >
                Close
              </button>

              <FiltersSidebar />

            </div>

            {/* Sticky Apply Button */}
            <div className="p-4 bg-white">
              <button
                onClick={handleApplyFilters}
                className="w-full bg-black text-white py-3 rounded-lg font-medium"
              >
                Apply Filters
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
