

import StoreTopBar from "@/app/components/website/storePage/StoreTopBar";
import StoreTopSection from "@/app/components/website/storePage/StoreTopSection";
import PopularCategories from "@/app/components/website/storePage/PopularCategories";
import FilterLayout from "@/app/components/website/storePage/FilterLayout";

export default function StoreLayout({ children }) {
  return (
    <>
      <StoreTopBar title="Top Cell Phones & Tablets" />
      <StoreTopSection />
      <PopularCategories />

     
      <FilterLayout>
        {children}
      </FilterLayout>
    </>
  );
}
