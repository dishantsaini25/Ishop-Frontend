import { fetchProduct } from "@/api/api-call";
import ProductClient from "./ProductClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const productData = await fetchProduct({ slug: slug, status: true });
  const product = productData?.product?.[0];
  
  if (!product) {
    return { title: "Product Not Found" };
  }
  
  return {
    title: `${product.name} | Swoo Tech Mart`,
    description: product.description?.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description?.substring(0, 160),
      images: product.thumbnail ? [`${productData?.imageBaseUrl}/main/${product.thumbnail}`] : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  
  console.log("Product Slug:", slug);
  
  // Fetch product by slug
  const productData = await fetchProduct({ slug: slug, status: true });
  const product = productData?.product?.[0] || null;
  const imageBaseUrl = productData?.imageBaseUrl || "";
  
  console.log("Product found:", product?.name);
  
  // Fetch related products (same category)
  let relatedProducts = [];
  if (product && product.category_slug) {
    const relatedData = await fetchProduct({
      category_slug: product.category_slug,
      status: true,
      limit: 8,
    });
    relatedProducts = relatedData?.product || [];
  }
  
  return (
    <ProductClient 
      product={product} 
      imageBaseUrl={imageBaseUrl}
      relatedProducts={relatedProducts}
    />
  );
}