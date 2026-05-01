"use client";

import AllCategories from "./AllCategories";
import ByBrand from "./ByBrand";
import ByColor from "./ByColor";
import PriceFilter from "./PriceFilter";
import PromoBanner from "./PromoBanner";

export default function FiltersSidebar() {
  return (
    <div className="space-y-10">
      <AllCategories />
      <ByBrand />
      <ByColor />
      <PriceFilter/>
      <PromoBanner />
    </div>
  );
}
