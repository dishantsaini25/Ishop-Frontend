import AllCategories from "./AllCategories";
import ByBrand from "./ByBrand";
import ByColor from "./ByColor";
import FilterToggleWrapper from "./FilterToggleWrapper";
import PriceFilter from "./PriceFilter";
import PromoBanner from "./PromoBanner";

export default async function FilterLayout({ children,maxLimit }) {

  return (
    <div className="container mx-auto px-4 lg:px-6 py-6">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* LEFT SIDE */}
        <div className="w-full lg:w-1/4">
          <FilterToggleWrapper>
            <div className="space-y-6">
              <AllCategories />
              <ByBrand /> 
              <ByColor />
             <PriceFilter maxLimit={maxLimit} />
              <PromoBanner />
            </div>
          </FilterToggleWrapper>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-3/4">
          {children}
        </div>

      </div>
    </div>
  );
}
