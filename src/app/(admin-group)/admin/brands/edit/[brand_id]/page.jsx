import { fetchBrand } from "@/api/api-call";
import EditBrand from "@/app/components/admin/EditBrand";

export default async function EditBrandPage({ params }) {
    const promise = await params;
  
  const id = promise.brand_id ?? null;

  const { brand, imageBaseUrl } = await fetchBrand({ id });

  return (
    <EditBrand
      brand={brand[0]}
      imageBaseUrl={imageBaseUrl}
    />
  );
}
