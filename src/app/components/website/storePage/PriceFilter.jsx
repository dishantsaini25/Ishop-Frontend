"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

export default function PriceFilter({ maxLimit = 60000 }) {

  const router = useRouter();
  const searchParams = useSearchParams();

  const minParam = parseInt(searchParams.get("min_price")) || 0;
  const maxParam = parseInt(searchParams.get("max_price")) || maxLimit;

  const [value, setValue] = useState([minParam, maxParam]);

  useEffect(() => {
    setValue([minParam, maxParam]);
  }, [minParam, maxParam, maxLimit]);

  const applyFilter = (min, max) => {
    const query = new URLSearchParams(searchParams.toString());

    query.set("min_price", min);
    query.set("max_price", max);
    query.set("page", 1);

    router.push(`?${query.toString()}`, { scroll: false });
  };

  const clearFilter = () => {
    const query = new URLSearchParams(searchParams.toString());

    query.delete("min_price");
    query.delete("max_price");
    query.set("page", 1);

    router.push(`?${query.toString()}`, { scroll: false });


    setValue([0, maxLimit]);
  };


  useEffect(() => {

    const timer = setTimeout(() => {
      applyFilter(value[0], value[1]);
    }, 500);

    return () => clearTimeout(timer);

  }, [value]);

  return (
    <div className="bg-[#EEEFF6] rounded-2xl shadow-sm p-5">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-gray-800">
          Price
        </h4>

        <button
          onClick={clearFilter}
          className="text-sm text-red-500 hover:underline"
        >
          Clear
        </button>
      </div>


      <div className="flex flex-col gap-2 mb-4 text-sm">

        <button onClick={() => applyFilter(0, 1000)} className="text-left hover:text-teal-600">
          Under ₹1000
        </button>

        <button onClick={() => applyFilter(1000, 3000)} className="text-left hover:text-teal-600">
          ₹1000 - ₹3000
        </button>

        <button onClick={() => applyFilter(3000, 5000)} className="text-left hover:text-teal-600">
          ₹3000 - ₹5000
        </button>

        <button onClick={() => applyFilter(5000, maxLimit)} className="text-left hover:text-teal-600">
          Above ₹5000
        </button>

      </div>

      <RangeSlider
        min={0}
        max={maxLimit}
        step={100}
        value={value}
        onInput={setValue}
      />
      <div className="flex justify-between mt-3 text-sm text-gray-600">
        <span>₹{value[0]}</span>
        <span>₹{value[1]}</span>
      </div>

    </div>
  );
}
