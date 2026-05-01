import { fetchBrand, fetchCategory, fetchColors } from "@/api/api-call";
import AddProduct from "@/app/components/admin/AddProduct";

export default async function Page() {

  const  category = await fetchCategory();
  const brands = await fetchBrand();
  const colors = await fetchColors();

 

  return (
    <AddProduct
      category={category}
      brand={brands}
      color={colors}
    />
  );
}
