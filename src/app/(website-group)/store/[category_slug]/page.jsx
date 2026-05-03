import { fetchProduct } from "@/api/api-call";
import ProductCard from "@/app/components/website/storePage/ProductCard";

export const dynamic = 'force-dynamic';

export default async function Page({ params }) {

  const resolvedParams = await params;  
  console.log("Resolved Params:", resolvedParams); 
  const categoryslug = resolvedParams.category_slug ?? null;

  const res = await fetchProduct({
    status: true,
    category_slug: categoryslug
  });


  const product = res?.product || [];
  const imageBaseUrl = res?.imageBaseUrl || "";

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

      {product.length === 0 ? (
        <p className="col-span-full text-center text-gray-500">
          No products found
        </p>
      ) : (
        product.map((item) => (
          <ProductCard
            key={item._id}
            product={item}
            imageBaseUrl={imageBaseUrl}
          />
        ))
      )}

    </div>
  );
}
