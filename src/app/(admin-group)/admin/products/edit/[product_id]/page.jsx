import { fetchProduct } from "@/api/api-call";
import EditProduct from "@/app/components/admin/EditProduct";

export default async function EditProductPage({ params }) {
    const promise = await params;
  const id = promise?.product_id;
  const {  product, colors, imageBaseUrl  } = await fetchProduct({ id });
  if (!product.length) {
    return <div>Product Not Found</div>;
  }

  return (
    <EditProduct
      product={product[0]}
      colors={colors}
      imageBaseUrl={imageBaseUrl}
    />
  );
}
